import { NextRequest, NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbNotiRepository } from '@/(backend)/notifications/infrastructure/repositories/SbNotiRepository';
import { UpdateNotificationReadUseCase } from '@/(backend)/notifications/application/usecases/UpdateNotificationReadUseCase';

// 알림 읽음 처리
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ success: false, message: '인증이 필요합니다.' }, { status: 401 });
    }

    const resolvedParams = await params;
    const notificationId = Number(resolvedParams.id);

    if (isNaN(notificationId)) {
      return NextResponse.json(
        { success: false, message: '알림 ID가 유효하지 않습니다.' },
        { status: 400 },
      );
    }

    const notificationRepository = new SbNotiRepository();
    const updateNotificationReadUseCase = new UpdateNotificationReadUseCase(notificationRepository);

    const result = await updateNotificationReadUseCase.execute(notificationId, user.id);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알림 읽음 처리 중 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
