// app/api/auth/kakao/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SupabaseAuthRepository } from '@/(backend)/user/infrastructure/repositories/SupabaseAuthRepository';
import { KakaoAuthServiceImpl } from '@/(backend)/user/infrastructure/repositories/KakaoAuthServiceImpl';
import { KakaoLoginUseCase } from '@/(backend)/user/application/usecases/KakaoLoginUseCase';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: '인가 코드가 없습니다.' }, { status: 400 });
    }

    const authRepository = new SupabaseAuthRepository();
    const kakaoAuthService = new KakaoAuthServiceImpl();
    const kakaoLoginUseCase = new KakaoLoginUseCase(kakaoAuthService, authRepository);

    const { token } = await kakaoLoginUseCase.execute(code);

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('카카오 로그인 오류:', err);

    if (err instanceof Error) {
      if (err.message.includes('access token')) {
        return NextResponse.json({ error: '토큰 요청 실패' }, { status: 400 });
      }
      if (err.message.includes('user info')) {
        return NextResponse.json({ error: '사용자 정보 없음' }, { status: 400 });
      }
      if (err.message.includes('upsert user')) {
        return NextResponse.json({ error: 'DB 저장 실패' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
