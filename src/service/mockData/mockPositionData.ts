// Mock Position Data
import type { PositionResponse } from '../../components/types/Position';

export const getMockPositionsByDepartmentId = (departmentId: number | undefined): PositionResponse[] => {
  const positions: Record<number, PositionResponse[]> = {
    1: [
      {
        id: 1,
        name: 'Менеджер по продажам',
        createdAt: '2023-01-10T10:00:00Z',
        updatedAt: null
      },
      {
        id: 2,
        name: 'Старший менеджер',
        createdAt: '2023-01-15T10:00:00Z',
        updatedAt: null
      },
    ],
    2: [
      {
        id: 3,
        name: 'Маркетолог',
        createdAt: '2023-02-01T10:00:00Z',
        updatedAt: null
      },
      {
        id: 4,
        name: 'SMM специалист',
        createdAt: '2023-02-05T10:00:00Z',
        updatedAt: null
      },
    ],
    3: [
      {
        id: 5,
        name: 'Разработчик',
        createdAt: '2023-03-01T10:00:00Z',
        updatedAt: null
      },
      {
        id: 6,
        name: 'DevOps инженер',
        createdAt: '2023-03-10T10:00:00Z',
        updatedAt: null
      },
    ],
  };

  return positions[departmentId || 1] || positions[1];
};
