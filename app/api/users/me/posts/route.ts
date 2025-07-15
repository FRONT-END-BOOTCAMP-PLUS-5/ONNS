import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { GetUserPostsUseCase } from '@/(backend)/my/application/usecases/GetUserPostsUseCase';
import { supabase } from '@/utils/supabase/supabaseClient';

// 내가 작성한 게시글 조회
export async function GET() {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRepository = new SbUserRepository(supabase);
    const getUserPostsUseCase = new GetUserPostsUseCase(userRepository);

    const posts = await getUserPostsUseCase.execute(user.id);

    return NextResponse.json({ ok: true, posts });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ ok: false, error: '서버 에러' }, { status: 500 });
  }
}
