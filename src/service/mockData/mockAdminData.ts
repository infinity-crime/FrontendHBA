// Mock Admin Data
import type { AdminProfileResponse } from '../../components/types/Admin';

export const getMockAdminProfiles = (): AdminProfileResponse[] => {
  return [
    {
      id: 1,
      userId: 1,
      fullName: 'Иван Петров',
      departmentName: 'Продажи',
      isActive: true
    },
    {
      id: 2,
      userId: 2,
      fullName: 'Мария Сидорова',
      departmentName: 'Маркетинг',
      isActive: true
    },
    {
      id: 3,
      userId: 3,
      fullName: 'Александр Иванов',
      departmentName: 'IT',
      isActive: false
    },
  ];
};
