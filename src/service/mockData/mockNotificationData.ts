// Mock Notifications Data
import type { Notification } from '../../components/types/Notification';

export const getMockNotifications = (): Notification[] => {
  return [
    {
      id: 1,
      type: 'profile_update',
      title: 'Ваш профиль был обновлен',
      message: 'Администратор обновил следующие поля вашего профиля: Номер телефона, Email',
      createdAt: '2024-03-23T14:30:00Z',
      read: false,
      changedFields: ['phoneNumber', 'email'],
    },
    {
      id: 2,
      type: 'profile_update',
      title: 'Ваш профиль был обновлен',
      message: 'Администратор обновил следующие поля вашего профиля: Дата найма',
      createdAt: '2024-03-22T10:15:00Z',
      read: false,
      changedFields: ['hireDate'],
    },
    {
      id: 3,
      type: 'system',
      title: 'Система была обновлена',
      message: 'Портал был обновлен. Добавлены новые функции управления заказами.',
      createdAt: '2024-03-21T09:00:00Z',
      read: true,
    },
    {
      id: 4,
      type: 'order',
      title: 'Новый заказ создан',
      message: 'Заказ №1001 был успешно создан. Сумма заказа: 15,500 ₽',
      createdAt: '2024-03-20T16:45:00Z',
      read: true,
    },
    {
      id: 5,
      type: 'profile_update',
      title: 'Ваш профиль был обновлен',
      message: 'Администратор обновил следующие поля вашего профиля: Должность',
      createdAt: '2024-03-19T11:20:00Z',
      read: true,
      changedFields: ['positionName'],
    },
    {
      id: 6,
      type: 'system',
      title: 'Профилактическое обслуживание',
      message: 'Плановое обслуживание системы завершено успешно.',
      createdAt: '2024-03-18T02:00:00Z',
      read: true,
    },
  ];
};
