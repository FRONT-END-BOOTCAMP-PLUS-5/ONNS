import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { LogoutUseCase } from '@/(backend)/user/application/usecases/LogoutUseCase';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
      const logoutUseCase = new LogoutUseCase();
      await logoutUseCase.execute(token);
    }

    const response = NextResponse.json({ success: true, message: '로그아웃 완료' });
    response.cookies.set('token', '', { maxAge: 0, path: '/' });
    response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
