import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/supabaseClient';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import SbCommentRepository from '@/(backend)/comments/infrastructure/repositories/SbCommentRepository';
import DeleteCommentUseCase from '@/(backend)/comments/application/usecases/DeleteCommentUseCase';

// 댓글 삭제 API
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseClient = supabase;
    const repository = new SbCommentRepository(supabaseClient);
    const deleteCommentUseCase = new DeleteCommentUseCase(repository);

    const resolvedParams = await params;
    const commentId = Number(resolvedParams.id);

    await deleteCommentUseCase.execture(commentId, user.id);

    return NextResponse.json({ ok: true, message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    if (error instanceof Error && error.message.includes('권한이 없습니다')) {
      return NextResponse.json({ message: '삭제 권한이 없습니다.' }, { status: 403 });
    }
    return NextResponse.json({ message: '서버 에러', error: 'UNKNOWN_ERROR' }, { status: 500 });
  }
}
