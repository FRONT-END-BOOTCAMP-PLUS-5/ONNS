import { NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbNotiRepository } from '@/(backend)/notification/infrastructure/repositories/SbNotiRepository';
import { GetUnreadCountUseCase } from '@/(backend)/notification/application/usecases/GetUnreadCountUseCase';

//읽지 않은 알림 체크
export async function GET() {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ success: false, message: '인증이 필요합니다.' }, { status: 401 });
    }

    const notificationRepository = new SbNotiRepository();
    const getUnreadCountUseCase = new GetUnreadCountUseCase(notificationRepository);

    const hasUnread = await getUnreadCountUseCase.execute(user.id);

    return NextResponse.json({
      success: true,
      hasUnread,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알림 체크 중 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
