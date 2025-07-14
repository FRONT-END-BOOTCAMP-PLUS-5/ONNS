import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbNotiRepository } from '@/(backend)/notification/infrastructure/repositories/SbNotiRepository';
import { GetAllNotificationsUseCase } from '@/(backend)/notification/application/usecases/GetAllNotificationsUseCase';

// 모든 알림 조회
export async function GET() {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ success: false, message: '인증이 필요합니다.' }, { status: 401 });
    }

    const notificationRepository = new SbNotiRepository();
    const getAllNotificationsUseCase = new GetAllNotificationsUseCase(notificationRepository);

    const notifications = await getAllNotificationsUseCase.execute(user.id);

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알림 조회 중 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
