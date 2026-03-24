import { apiDepart} from '../api/departamentApi.ts';
import { getMockDepartments, getMockDepartmentById } from '../mockData/mockDepartmentData.ts';
import type {DepartmentResponse} from '../../components/types/Departament.ts';

export const getDepartById = async (id:number| undefined): Promise<DepartmentResponse> => {
  // Return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockDepartmentById(id));
    }, 500);
  });
};

export const getAllDepartments = async ( ): Promise<DepartmentResponse[]> => {
  // Return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockDepartments());
    }, 500);
  });
};