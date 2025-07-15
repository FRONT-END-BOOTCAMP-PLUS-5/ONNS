import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { supabase } from '@/utils/supabase/supabaseClient';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { GetUserPostsUseCase } from '@/(backend)/my/application/usecases/GetUserPostsUseCase';

export async function GET() {
  const user = await getUserFromJWT();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const repository = new SbUserRepository(supabase);
  const getUserPostsUseCase = new GetUserPostsUseCase(repository);

  const posts = await getUserPostsUseCase.execute(user.id);

  return NextResponse.json({ ok: true, posts });
}
