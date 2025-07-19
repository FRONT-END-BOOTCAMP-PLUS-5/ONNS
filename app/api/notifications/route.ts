import { NextRequest, NextResponse } from 'next/server';
import { getUserFromJWT } from '@/utils/auth/tokenAuth';
import { SbNotiRepository } from '@/(backend)/notifications/infrastructure/repositories/SbNotiRepository';
import { GetAllNotificationsUseCase } from '@/(backend)/notifications/application/usecases/GetAllNotificationsUseCase';

// 모든 알림 조회
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromJWT();
    if (!user) {
      return NextResponse.json({ success: false, message: '인증이 필요합니다.' }, { status: 401 });
    }

    // Query parameters for filtering
    const { searchParams } = new URL(req.url);
    const hasUnread = searchParams.get('hasUnread');
    const unread = searchParams.get('unread');
    const recent = searchParams.get('recent');

    const notificationRepository = new SbNotiRepository();
    const getAllNotificationsUseCase = new GetAllNotificationsUseCase(notificationRepository);
    const notifications = await getAllNotificationsUseCase.execute(user.id);

    if (hasUnread === 'true') {
      // 읽지 않은 알림이 하나라도 있으면 true 반환
      const hasUnreadValue = notifications.some((notification) => !notification.isRead);
      return NextResponse.json({ hasUnread: hasUnreadValue });
    }

    // Filter by unread if specified
    let filteredNotifications = notifications;
    if (unread === 'true') {
      filteredNotifications = notifications.filter((notification) => !notification.isRead);
    }

    // Filter by recent (1 day) if specified
    if (recent === '1d') {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      filteredNotifications = filteredNotifications.filter(
        (notification) => new Date(notification.dateCreated) >= oneDayAgo,
      );
    }

    return NextResponse.json({
      success: true,
      notifications: filteredNotifications,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '알림 조회 중 오류가 발생했습니다.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
