// Mock Department Position Data
import type { DepartmentPositionResponse } from '../../components/types/DepartmentPosition';

export const getMockDepartmentPositions = (): DepartmentPositionResponse[] => {
  return [
    {
      id: 1,
      position: { id: 1, name: 'Менеджер по продажам' },
      department: { id: 1, name: 'Продажи', headDepartment: 'Иван Петров' }
    },
    {
      id: 2,
      position: { id: 2, name: 'Старший менеджер' },
      department: { id: 1, name: 'Продажи', headDepartment: 'Иван Петров' }
    },
    {
      id: 3,
      position: { id: 3, name: 'Маркетолог' },
      department: { id: 2, name: 'Маркетинг', headDepartment: 'Екатерина Смирнова' }
    },
    {
      id: 4,
      position: { id: 4, name: 'SMM специалист' },
      department: { id: 2, name: 'Маркетинг', headDepartment: 'Екатерина Смирнова' }
    },
    {
      id: 5,
      position: { id: 5, name: 'Разработчик' },
      department: { id: 3, name: 'IT', headDepartment: 'Сергей Козлов' }
    },
    {
      id: 6,
      position: { id: 6, name: 'DevOps инженер' },
      department: { id: 3, name: 'IT', headDepartment: 'Сергей Козлов' }
    },
  ];
};
