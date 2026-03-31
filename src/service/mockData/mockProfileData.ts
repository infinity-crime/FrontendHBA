// Mock Profile Data Service
import type { ProfileResponse } from '../../components/types/Profile';

const getRole = (): string => {
  const login = localStorage.getItem('userLogin') || '';
  return login === 'админ' ? 'admin' : login === 'менеджер' ? 'manager' : 'user';
};

export const getMockProfile = (): ProfileResponse => {
  const role = getRole();
  
  if (role === 'admin') {
    return {
      id: 1,
      departmentId: 2,
      positionId: 2,
      firstName: 'Петр',
      lastName: 'Сидоров',
      patronymic: 'Алексеевич',
      phoneNumber: '+7 (999) 987-65-43',
      email: 'admin@holiday-box.ru',
      isActive: true,
      positionName: 'Директор',
      birthDate: '1985-03-10',
      hireDate: '2022-01-15',
      dismissalDate: undefined,
      departmentName: 'Администрация',
      createdAt: '2022-01-15T10:00:00Z',
      updatedAt: '2024-03-24T14:30:00Z'
    };
  }
  
  // manager или default role (менеджер)
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
