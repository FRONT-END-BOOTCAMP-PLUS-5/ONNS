import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/supabaseClient';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import SbBoardRepository from '@/(backend)/ootd/infrastructure/repositories/SbBoardRepositories';
import GetMostLikedPostsUseCase from '@/(backend)/ootd/application/usecases/GetMostLikedPostsUseCase';
import GetMostLikedByTempUseCase from '@/(backend)/ootd/application/usecases/GetMostLikedPostsByTempUseCase';
import CreateUseCase from '@/(backend)/ootd/application/usecases/CreateUseCase';
import GetPostUseCase from '@/(backend)/ootd/application/usecases/GetPostsUseCase';

// 게시글 조회 (필터/정렬/페이지네이션)
export async function GET(req: NextRequest) {
  try {
    // 인증
    const user = await getUserFromJWT();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const order = searchParams.get('order') || 'desc';
    const season = searchParams.get('season') || null;
    const currentTemp = parseInt(searchParams.get('temp') || '0');

    const boardRepository = new SbBoardRepository(supabase);
    let posts;
    let message;

    // 계절별 필터
    if (season) {
      posts = await boardRepository.getBySeason(season, sort, undefined, undefined, offset, limit);
      message = `${season} 계절 게시글 조회 성공`;
    } else {
      // 기타 정렬/필터
      switch (sort) {
        case 'likes':
          if (!currentTemp || isNaN(currentTemp)) {
            const getMostLikedPostsUseCase = new GetMostLikedPostsUseCase(boardRepository);
            posts = await getMostLikedPostsUseCase.execute(user.id, limit);
            message = '인기 게시글 조회 성공';
          } else {
            const getMostLikedByTempUseCase = new GetMostLikedByTempUseCase(boardRepository);
            posts = await getMostLikedByTempUseCase.execute(user.id, currentTemp, limit);
            message = `현재 온도(${currentTemp}°C) ±5도 내 인기 게시글 조회 성공`;
          }
          break;
        case 'recent':
        default:
          const getRecentPostsUseCase = new GetPostUseCase(boardRepository);
          posts = await getRecentPostsUseCase.getCurrentSeasonPosts(user.id, sort, offset, limit);
          message = '최신 게시글 조회 성공';
          break;
      }
    }

    return NextResponse.json({
      success: true,
      data: posts,
      message,
      meta: {
        sort,
        limit,
        order,
        season: season || 'current',
        temp: currentTemp || null,
        total: posts.length,
      },
    });
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    const message = error instanceof Error ? error.message : '게시글 조회 중 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 게시글 작성
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromJWT();
    if (!user) return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });

    // 1. FormData 파싱
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const text = formData.get('text') as string | null;
    const feels_likeStr = formData.get('feels_like') as string | null;
    const feels_like = feels_likeStr ? Number(feels_likeStr) : null;

    if (!file || !text || !feels_like) {
      return NextResponse.json(
        { message: '이미지, 내용, 체감온도 모두 필요합니다.' },
        { status: 400 },
      );
    }

    // 2. Supabase Storage에 이미지 업로드
    const fileName = `${user.id}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('ootd-img') // 실제 버킷 이름으로 변경!
      .upload(fileName, file, { contentType: file.type });

    if (data) {
      console.log(data);
    }
    if (error) {
      return NextResponse.json({ message: '이미지 업로드 실패', error }, { status: 500 });
    }

    // 3. 이미지 URL 생성
    const imageUrl = supabase.storage.from('ootd-img').getPublicUrl(fileName).data.publicUrl;

    // 4. 게시글 저장
    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);
    const createUseCase = new CreateUseCase(repository);

    const created = await createUseCase.execute(
      {
        text,
        feels_like,
        user_id: user.id,
      },
      [imageUrl],
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    return NextResponse.json({ message: '서버 에러', error: 'UNKNOWN_ERROR' }, { status: 500 });
  }
}
