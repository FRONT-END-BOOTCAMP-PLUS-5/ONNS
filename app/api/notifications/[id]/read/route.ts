import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbNotiRepository } from '@/(backend)/notifications/infrastructure/repositories/SbNotiRepository';
import { MarkAsReadUseCase } from '@/(backend)/notifications/application/usecases/MarkAsReadUseCase';

// 알림 읽음 상태 변경 (PATCH)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ success: false, message: '인증이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const notificationId = parseInt(id);
    if (isNaN(notificationId)) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 알림 ID입니다.' },
        { status: 400 },
      );
    }

    const notificationRepository = new SbNotiRepository();
    const markAsReadUseCase = new MarkAsReadUseCase(notificationRepository);

    const updatedNotification = await markAsReadUseCase.execute(notificationId);

    return NextResponse.json({
      success: true,
      notification: updatedNotification,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '알림 상태 변경 중 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
