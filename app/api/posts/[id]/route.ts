import SbBoardRepository from '@/(backend)/ootd/infrastructure/repositories/SbBoardRepositories';
import { supabase } from '@/utils/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import GetPostDetailUseCase from '@/(backend)/ootd/application/usecases/GetPostDetailUseCase';

/* 특정 게시글 조회 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Get user ID from JWT (optional for public posts)
    const user = await getUserFromJWT();
    const myUserId = user?.id || 0;

    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);
    const getPostDetailUseCase = new GetPostDetailUseCase(repository);

    const post = await getPostDetailUseCase.getPostById(id, myUserId);

    if (!post) {
      return NextResponse.json({ message: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { message: '게시글 조회 실패', error: 'FETCH_ERROR' },
      { status: 500 },
    );
  }
}

/* 게시글 수정 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ message: 'text는 필수입니다.' }, { status: 400 });
    }

    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);

    await repository.update(id, { text }, user.id);

    return NextResponse.json({ message: '게시글이 수정되었습니다.' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      return NextResponse.json({ message: '수정 권한이 없습니다.' }, { status: 403 });
    }
    return NextResponse.json({ message: '게시글 수정 실패' }, { status: 500 });
  }
}

/* 게시글 삭제 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);

    await repository.delete(id, user.id);

    return NextResponse.json({ message: '게시글이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      return NextResponse.json({ message: '삭제 권한이 없습니다.' }, { status: 403 });
    }
    return NextResponse.json({ message: '게시글 삭제 실패' }, { status: 500 });
  }
}
