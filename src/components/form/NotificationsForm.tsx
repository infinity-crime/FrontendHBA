import { useState, useEffect } from 'react';
import { Badge, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import '../style/NotificationsForm.css';
import { getMockNotifications } from '../../service/mockData/mockNotificationData';
import type { Notification } from '../types/Notification';

export const NotificationsForm = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(getMockNotifications());
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'profile_update':
        return '👤';
      case 'profile_delete':
        return '❌';
      case 'profile_create':
        return '✅';
      case 'order':
        return '📦';
      case 'system':
        return '⚙️';
      default:
        return '📢';
    }
  };


  const getStatusBadgeColor = (type: string) => {
    switch (type) {
      case 'profile_update':
        return 'processing';
      case 'profile_delete':
        return 'error';
      case 'profile_create':
        return 'success';
      case 'order':
        return 'warning';
      case 'system':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>
          <BellOutlined style={{ marginRight: '12px' }} />
          Уведомления
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: '12px' }} />
          )}
        </h1>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <Empty description="Нет уведомлений" />
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                <span style={{ fontSize: '24px' }}>
                  {getNotificationIcon(notification.type)}
                </span>
              </div>

              <div className="notification-content">
                <div className="notification-title-row">
                  <h3>{notification.title}</h3>
                  <Badge
                    status={getStatusBadgeColor(notification.type) as any}
                    text={
                      notification.type === 'profile_update'
                        ? 'Обновление профиля'
                        : notification.type === 'profile_delete'
                        ? 'Удаление профиля'
                        : notification.type === 'profile_create'
                        ? 'Создание профиля'
                        : notification.type === 'order'
                        ? 'Заказ'
                        : 'Система'
                    }
                  />
                </div>

                <p className="notification-message">{notification.message}</p>

                {notification.changedFields && notification.changedFields.length > 0 && (
                  <div className="changed-fields">
                    <span className="label">Измененные поля:</span>
                    <div className="fields-list">
                      {notification.changedFields.map((field, idx) => (
                        <span key={idx} className="field-tag">
                          {field === 'phoneNumber'
                            ? 'Номер телефона'
                            : field === 'email'
                            ? 'Email'
                            : field === 'hireDate'
                            ? 'Дата найма'
                            : field === 'positionName'
                            ? 'Должность'
                            : field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="notification-footer">
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {!notification.read && (
                    <span className="unread-badge">Новое</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
