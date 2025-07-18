import { NextRequest, NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { GetUserPostsUseCase } from '@/(backend)/my/application/usecases/GetUserPostsUseCase';
import { supabase } from '@/utils/supabase/supabaseClient';

// 내가 작성한 게시글 조회
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const userRepository = new SbUserRepository(supabase);
    const getUserPostsUseCase = new GetUserPostsUseCase(userRepository);

    const result = await getUserPostsUseCase.execute(user.id, { page, limit });

    return NextResponse.json({
      ok: true,
      posts: result.data,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ ok: false, error: '서버 에러' }, { status: 500 });
  }
}
