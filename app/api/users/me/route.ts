import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { GetUserUseCase } from '@/(backend)/my/application/usecases/GetUserUseCase';
import { UpdateUserUseCase } from '@/(backend)/my/application/usecases/UpdateUserUseCase';
import { UserDeleteUseCase } from '@/(backend)/user/application/usecases/UserDeleteUseCase';
import { supabase } from '@/utils/supabase/supabaseClient';

// 회원 정보 조회
export async function GET() {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userRepository = new SbUserRepository(supabase);
    const getUserUseCase = new GetUserUseCase(userRepository);

    const userData = await getUserUseCase.execute(user.id);

    if (!userData) {
      return NextResponse.json({ ok: false, error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, user: userData });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ ok: false, error: '서버 에러' }, { status: 500 });
  }
}

// 회원 정보 수정
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, profile_img } = body;

    const userRepository = new SbUserRepository(supabase);
    const updateUserUseCase = new UpdateUserUseCase(userRepository);

    const updatedUser = await updateUserUseCase.execute(user.id, { name, profile_img });

    if (!updatedUser) {
      return NextResponse.json(
        { ok: false, error: '사용자 정보 수정에 실패했습니다.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ ok: false, error: '서버 에러' }, { status: 500 });
  }
}

// 회원탈퇴
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: '토큰이 없습니다.' }, { status: 401 });
    }

    const userDeleteUseCase = new UserDeleteUseCase();

    const result = await userDeleteUseCase.execute(token);

    // 쿠키 삭제
    const response = NextResponse.json(result);
    response.cookies.set('token', '', { maxAge: 0, path: '/' });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : '회원탈퇴 중 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
