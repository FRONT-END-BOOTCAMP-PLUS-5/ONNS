import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { UserDeleteUseCase } from '@/(backend)/user/application/usecases/UserDeleteUseCase';

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
