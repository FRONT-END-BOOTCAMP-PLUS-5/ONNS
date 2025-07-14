import GetPostUseCase from '@/(backend)/ootd/application/usecases/GetPostUseCase';
import CreateUseCase from '@/(backend)/ootd/application/usecases/CreateUseCase';
import SbBoardRepository from '@/(backend)/ootd/infrastructure/repositories/SbBoardRepositories';
import { supabase } from '@/utils/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';

/* 게시글 작성 */
export async function POST(req: NextRequest) {
  try {
    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);
    const createUseCase = new CreateUseCase(repository);

    const body = await req.json();
    const { text, feels_like, user_id, img_url } = body;

    // img_url이 문자열이면 배열로 변환
    const imgUrls = img_url ? (Array.isArray(img_url) ? img_url : [img_url]) : [];

    const created = await createUseCase.execute(
      {
        text,
        feels_like,
        user_id,
      },
      imgUrls,
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json({ message: '서버 에러', error: 'UNKNOWN_ERROR' }, { status: 500 });
  }
}

/* 현재 계절 게시글 조회 */
export async function GET(req: NextRequest) {
  try {
    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);
    const getPostUseCase = new GetPostUseCase(repository);

    // 현재 사용자 정보 가져오기
    const user = await getUserFromJWT();
    const myUserId = user?.id || 0;

    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort');

    const posts = await getPostUseCase.getAllPosts(myUserId, sort || undefined);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: '게시글 조회 실패', error: 'FETCH_ERROR' },
      { status: 500 },
    );
  }
}
