// Mock Profile Data Service
import type { ProfileResponse } from '../../components/types/Profile';

export const getMockProfile = (): ProfileResponse => {
  return {
    id: 1,
    departmentId: 1,
    positionId: 1,
    firstName: 'Иван',
    lastName: 'Петров',
    patronymic: 'Сергеевич',
    phoneNumber: '+7 (999) 123-45-67',
    email: 'ivan.petrov@holiday-box.ru',
    isActive: true,
    positionName: 'Менеджер',
    birthDate: '1990-05-15',
    hireDate: '2023-01-20',
    dismissalDate: undefined,
    departmentName: 'Продажи',
    createdAt: '2023-01-20T10:00:00Z',
    updatedAt: '2024-03-24T14:30:00Z'
  };
};
