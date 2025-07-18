import { NextRequest, NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbUserRepository } from '@/(backend)/my/infrastructure/repositories/SbUserRepository';
import { UploadProfileImageUseCase } from '@/(backend)/my/application/usecases/UploadProfileImageUseCase';
import { supabase } from '@/utils/supabase/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No image file provided' }, { status: 400 });
    }

    // Use clean architecture approach
    const userRepository = new SbUserRepository(supabase);
    const uploadProfileImageUseCase = new UploadProfileImageUseCase(userRepository);

    console.log('Starting profile image upload for user:', user.id);
    const result = await uploadProfileImageUseCase.execute(user.id, file);

    if (!result.success) {
      console.error('Upload failed:', result.error);
      return NextResponse.json(
        { ok: false, error: result.error || 'Upload failed' },
        { status: 400 },
      );
    }

    console.log('Upload successful, new profile image URL:', result.user?.profile_img);

    return NextResponse.json({
      ok: true,
      user: result.user,
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
