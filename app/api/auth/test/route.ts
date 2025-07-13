import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUserFromJWT();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: '로그인이 필요합니다.',
          message: 'JWT 토큰이 없거나 유효하지 않습니다.',
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        profile_img: user.profile_img,
      },
      message: '로그인 상태가 정상입니다.',
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: '서버 에러가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
