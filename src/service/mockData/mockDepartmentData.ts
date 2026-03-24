// Mock Department Data
import type { DepartmentResponse } from '../../components/types/Departament';

export const getMockDepartments = (): DepartmentResponse[] => {
  return [
    {
      id: 1,
      name: 'Продажи',
      headDepartment: 'Иван Петров'
    },
    {
      id: 2,
      name: 'Маркетинг',
      headDepartment: 'Екатерина Смирнова'
    },
    {
      id: 3,
      name: 'IT',
      headDepartment: 'Сергей Козлов'
    },
    {
      id: 4,
      name: 'Финансы',
      headDepartment: 'Ольга Волкова'
    },
  ];
};

export const getMockDepartmentById = (id: number | undefined): DepartmentResponse => {
  const departments = getMockDepartments();
  return departments.find(d => d.id === id) || departments[0];
};
