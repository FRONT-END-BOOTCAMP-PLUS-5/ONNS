import SbBoardRepository from '@/(backend)/ootd/infrastructure/repositories/SbBoardRepositories';
import { supabase } from '@/utils/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import SeasonUseCase from '@/(backend)/ootd/application/usecases/SeasonUseCase';

/* 계절별 게시글 조회 */
export async function GET(req: NextRequest) {
  try {
    const supabaseClient = supabase;
    const repository = new SbBoardRepository(supabaseClient);
    const seasonUseCase = new SeasonUseCase(repository);

    const { searchParams } = new URL(req.url);
    const season = searchParams.get('season');

    if (!season) {
      return NextResponse.json({ message: '계절 파라미터가 필요합니다.' }, { status: 400 });
    }

    const validSeasons = ['봄', '여름', '가을', '겨울'];
    if (!validSeasons.includes(season)) {
      return NextResponse.json(
        { message: '계절은 봄, 여름, 가을, 겨울 중 하나여야 합니다.' },
        { status: 400 },
      );
    }

    const sort = searchParams.get('sort');
    const posts = await seasonUseCase.getPostsBySeason(season, sort || undefined);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts by season:', error);
    return NextResponse.json(
      { message: '계절별 게시글 조회 실패', error: 'FETCH_ERROR' },
      { status: 500 },
    );
  }
}
