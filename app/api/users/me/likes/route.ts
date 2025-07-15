import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { GetUserLikesUseCase } from '@/(backend)/my/application/usecases/GetUserLikesUseCase';
import { supabase } from '@/utils/supabase/supabaseClient';

// 내가 좋아요한 게시글 조회
export async function GET() {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRepository = new SbUserRepository(supabase);
    const getUserLikesUseCase = new GetUserLikesUseCase(userRepository);

    const likes = await getUserLikesUseCase.execute(user.id);

    return NextResponse.json({ ok: true, likes });
  } catch (error) {
    console.error('Error fetching user likes:', error);
    return NextResponse.json({ ok: false, error: '서버 에러' }, { status: 500 });
  }
}
