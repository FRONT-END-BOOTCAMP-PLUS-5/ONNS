import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/supabaseClient';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import SbBoardRepository from '@/(backend)/ootd/infrastructure/repositories/SbBoardRepositories';
import GetRandomPostsUseCase from '@/(backend)/ootd/application/usecases/GetRandomPostsUseCase';
import GetMostLikedPostsUseCase from '@/(backend)/ootd/application/usecases/GetMostLikedPostsUseCase';

export async function GET(request: NextRequest) {
  try {
    // 토큰 인증
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query parameters
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'recent'; // recent, random, likes
    const limit = parseInt(searchParams.get('limit') || '10');
    const order = searchParams.get('order') || 'desc';
    const season = searchParams.get('season'); // spring, summer, autumn, winter

    // 의존성 주입
    const boardRepository = new SbBoardRepository(supabase);

    let posts;
    let message;

    switch (sort) {
      case 'random':
        const getRandomPostsUseCase = new GetRandomPostsUseCase(boardRepository);
        posts = await getRandomPostsUseCase.execute(user.id, limit);
        message = '랜덤 게시글을 성공적으로 조회했습니다.';
        break;

      case 'likes':
        const getMostLikedPostsUseCase = new GetMostLikedPostsUseCase(boardRepository);
        posts = await getMostLikedPostsUseCase.execute(user.id, limit);
        message = '인기 게시글을 성공적으로 조회했습니다.';
        break;

      case 'recent':
      default:
        if (season) {
          // Get posts by specific season
          posts = await boardRepository.getBySeason(season);
          message = `${season} 계절 게시글을 성공적으로 조회했습니다.`;
        } else {
          // Get current season posts
          posts = await boardRepository.getCurrentSeasonPosts();
          message = '현재 계절 게시글을 성공적으로 조회했습니다.';
        }
        // Apply limit in JavaScript since the methods don't support it
        posts = posts.slice(0, limit);
        break;
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
        total: posts.length,
      },
    });
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    const message = error instanceof Error ? error.message : '게시글 조회 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
