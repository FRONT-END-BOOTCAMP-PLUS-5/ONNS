import SbCommentRepository from '@/(backend)/comment/infrastructure/repositories/SbCommentRepository';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { supabase } from '@/utils/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const params = await context.params;
    const commentId = Number(params.id);

    const supabaseClient = supabase;
    const repository = new SbCommentRepository(supabaseClient);

    const deleted = await repository.deleteById(commentId, user.id);

    if (!deleted) {
      return NextResponse.json({ ok: false, error: '삭제에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: '댓글이 성공적으로 삭제되었습니다.',
      commentId: params.id,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);

    if (error instanceof Error) {
      if (error.message.includes('댓글이 존재하지 않거나 권한이 없습니다')) {
        return NextResponse.json({ ok: false, error: '삭제 권한이 없습니다.' }, { status: 403 });
      }
      if (error.message.includes('댓글 삭제 실패')) {
        return NextResponse.json({ ok: false, error: '삭제에 실패했습니다.' }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: false, error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}
