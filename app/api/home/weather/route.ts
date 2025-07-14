import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat, lon 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }

  const REST_API_KEY = process.env.WEATHER_API_KEY;
  if (!REST_API_KEY) {
    return NextResponse.json(
      { error: 'Kakao REST API Key가 서버에 설정되어 있지 않습니다.' },
      { status: 500 },
    );
  }

  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`;
  try {
    const kakaoRes = await fetch(url, {
      headers: {
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
    });
    const data = await kakaoRes.json();
    return NextResponse.json(data, { status: kakaoRes.status });
  } catch (error) {
    return NextResponse.json(
      { error: '카카오 API 호출 실패', details: error instanceof Error ? error.message : error },
      { status: 500 },
    );
  }
}
