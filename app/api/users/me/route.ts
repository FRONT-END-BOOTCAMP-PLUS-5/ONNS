import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { supabase } from '@/utils/supabase/supabaseClient';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { GetUserUseCase } from '@/(backend)/my/application/usecases/GetUserUseCase';
import { UpdateUserUseCase } from '@/(backend)/my/application/usecases/UpdateUserUseCase';

// 회원 정보 조회
export async function GET() {
  const user = await getUserFromJWT();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const repository = new SbUserRepository(supabase);
  const getUserUseCase = new GetUserUseCase(repository);

  const userData = await getUserUseCase.execute(user.id);

  if (!userData) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: userData });
}

// 회원 정보 수정
export async function PATCH(request: Request) {
  const user = await getUserFromJWT();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // First, get current user data
  const repository = new SbUserRepository(supabase);
  const getUserUseCase = new GetUserUseCase(repository);
  const currentUser = await getUserUseCase.execute(user.id);

  if (!currentUser) {
    return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
  }

  // Only update fields that are provided and different from current values
  const updateFields: { name?: string; profile_img?: string } = {};

  if (body.name !== undefined && body.name !== currentUser.name) {
    updateFields.name = body.name;
  }

  if (body.profile_img !== undefined && body.profile_img !== currentUser.profile_img) {
    updateFields.profile_img = body.profile_img;
  }

  // If no fields need updating, return current user data
  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ ok: true, user: currentUser, message: 'No changes detected' });
  }

  const updateUserUseCase = new UpdateUserUseCase(repository);
  const updatedUser = await updateUserUseCase.execute(user.id, updateFields);

  if (!updatedUser) {
    return NextResponse.json({ ok: false, error: 'Failed to update user' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, user: updatedUser });
}
