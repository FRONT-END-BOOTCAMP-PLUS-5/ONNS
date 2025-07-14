import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SbAuthRepository } from '@/(backend)/user/infrastructure/repositories/SbAuthRepository';
import jwt from 'jsonwebtoken';
import { supabase } from '@/utils/supabase/supabaseClient';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: '리프레시 토큰이 없습니다.' }, { status: 401 });
    }

    let user;
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as { id: number };

      // 유저 조회
      const { data: userData, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', decoded.id)
        .single();

      if (error || !userData) {
        return NextResponse.json({ error: '유저를 찾을 수 없습니다.' }, { status: 401 });
      }
      user = userData;
    } catch {
      return NextResponse.json({ error: '리프레시 토큰이 유효하지 않습니다.' }, { status: 401 });
    }

    // access token 발급
    const authRepository = new SbAuthRepository();
    const tokens = authRepository.generateJWT(user);
    cookieStore.set('token', tokens.accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15,
    });

    return NextResponse.json({ success: true, access_token: tokens.accessToken });
  } catch (err) {
    console.error('엑세스 토큰 재발급 오류:', err);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
