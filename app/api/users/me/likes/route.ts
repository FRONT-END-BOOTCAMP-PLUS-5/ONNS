import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { supabase } from '@/utils/supabase/supabaseClient';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { GetUserLikesUseCase } from '@/(backend)/my/application/usecases/GetUserLikesUseCase';

export async function GET() {
  const user = await getUserFromJWT();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const repository = new SbUserRepository(supabase);
  const getUserLikesUseCase = new GetUserLikesUseCase(repository);

  const likes = await getUserLikesUseCase.execute(user.id);

  return NextResponse.json({ ok: true, likes });
}
