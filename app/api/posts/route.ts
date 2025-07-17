import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/supabaseClient';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import SbBoardRepository from '@/(backend)/ootd/infrastructure/repositories/SbBoardRepositories';
import GetRandomPostsUseCase from '@/(backend)/ootd/application/usecases/GetRandomPostsUseCase';
import GetRandomPostsByTempUseCase from '@/(backend)/ootd/application/usecases/GetRandomPostsByTempUseCase';
import GetMostLikedPostsUseCase from '@/(backend)/ootd/application/usecases/GetMostLikedPostsUseCase';
import GetMostLikedByTempUseCase from '@/(backend)/ootd/application/usecases/GetMostLikedPostsByTempUseCase';
import CreateUseCase from '@/(backend)/ootd/application/usecases/CreateUseCase';
import GetPostUseCase from '@/(backend)/ootd/application/usecases/GetPostsUseCase';

/* 게시글 조회 (다양한 정렬 및 필터링) */
export async function GET(req: NextRequest) {
  try {
    // 토큰 인증 (선택적 - 로그인하지 않은 사용자도 게시글을 볼 수 있음)
    const user = await getUserFromJWT();
    const userId = user?.id || 0; // 로그인하지 않은 경우 0으로 설정

    // Query parameters
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') || 'recent'; // recent, random, likes, temp
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const order = searchParams.get('order') || 'desc';
    const season = searchParams.get('season') || null; // spring, summer, autumn, winter
    const currentTemp = parseInt(searchParams.get('temp') || '0'); // current temperature for temp-based filtering

    // 의존성 주입
    const boardRepository = new SbBoardRepository(supabase);

    let posts;
    let message;

    // Handle season filtering first (if specified)
    if (season) {
      posts = await boardRepository.getBySeason(season, sort);
      message = `${season} 계절 게시글을 성공적으로 조회했습니다.`;
      posts = posts.slice(0, limit);
    } else {
      // Handle sorting without season filter
      switch (sort) {
        case 'random':
          // Check if temperature is provided for temperature-based random posts
          if (currentTemp && !isNaN(currentTemp)) {
            const getRandomPostsByTempUseCase = new GetRandomPostsByTempUseCase(boardRepository);
            posts = await getRandomPostsByTempUseCase.execute({
              myUserId: userId,
              currentTemp,
              tempRange: 5,
              limit,
            });
            message = `현재 온도(${currentTemp}°C) 기준 ±5도 범위 내 랜덤 게시글을 성공적으로 조회했습니다.`;
          } else {
            const getRandomPostsUseCase = new GetRandomPostsUseCase(boardRepository);
            posts = await getRandomPostsUseCase.execute(userId, limit);
            message = '랜덤 게시글을 성공적으로 조회했습니다.';
          }
          break;

        case 'likes':
          if (!currentTemp || isNaN(currentTemp)) {
            const getMostLikedPostsUseCase = new GetMostLikedPostsUseCase(boardRepository);
            posts = await getMostLikedPostsUseCase.execute(userId, limit);
            message = '인기 게시글을 성공적으로 조회했습니다.';
          } else {
            const getMostLikedByTempUseCase = new GetMostLikedByTempUseCase(boardRepository);
            posts = await getMostLikedByTempUseCase.execute(userId, currentTemp, limit);
            message = `현재 온도(${currentTemp}°C) 기준 ±5도 범위 내 인기 게시글을 성공적으로 조회했습니다.`;
          }
          break;

        case 'recent':
        default:
          const getRecentPostsUseCase = new GetPostUseCase(boardRepository);
          posts = await getRecentPostsUseCase.getCurrentSeasonPosts(userId, sort, offset, limit);
          message = '최신 게시글을 성공적으로 조회했습니다.';
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
    const message = error instanceof Error ? error.message : '게시글 조회 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* 게시글 작성 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);
    const createUseCase = new CreateUseCase(repository);

    const body = await req.json();
    const { text, feels_like, img_url } = body;

    // img_url이 문자열이면 배열로 변환
    const imgUrls = img_url ? (Array.isArray(img_url) ? img_url : [img_url]) : [];

    const created = await createUseCase.execute(
      {
        text,
        feels_like,
        user_id: user.id,
      },
      imgUrls,
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json({ message: '서버 에러', error: 'UNKNOWN_ERROR' }, { status: 500 });
  }
}
