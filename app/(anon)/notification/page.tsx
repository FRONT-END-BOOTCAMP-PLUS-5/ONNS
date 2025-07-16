'use client';

import { useEffect, useState } from 'react';
import NoticeItem from './components/NoticeItem';
import api from '@/utils/axiosInstance';
import { formatDate } from '@/lib/formatDate';
import { NotificationWithUser } from '@/(backend)/notifications/application/dtos/NotificationDto';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get('/notifications');
        setNotifications(response.data.notifications);
      } catch (err) {
        setError('알림을 불러오는데 실패했습니다.');
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">알림을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">새로운 알림이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {notifications.map((notification) => (
        <NoticeItem
          key={`notif-${notification.id}`}
          id={notification.id}
          isRead={notification.isRead}
          postId={notification.postId}
          type={notification.type}
          user={notification.actor.name}
          timestamp={formatDate(notification.dateCreated)}
        />
      ))}
    </div>
  );
}
