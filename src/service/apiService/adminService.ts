import { apiAdmin} from '../api/adminApi.ts';
import { getMockAdminProfiles } from '../mockData/mockAdminData.ts';
import type { AdminProfileResponse,
    AdminCreateProfileRequest,
    AdminCreateProfileResponse,
    AdminUpdateProfileRequest} from '../../components/types/Admin.ts';


export interface UsersQuery{
  pageNumber: number
  pageSize: number
  fullName?: string
  isActive?: boolean
  departmentId?:number
}

export const getAllProfiles = async ( 
    pageNumber: number,
    pageSize: number
): Promise<AdminProfileResponse[]> => {
  // Return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const profiles = getMockAdminProfiles();
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      resolve(profiles.slice(start, end));
    }, 500);
  });
};

export const getAllFilteredProfiles = async ( 
    query: UsersQuery
): Promise<AdminProfileResponse[]> => {
  // Return mock data with filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      let profiles = getMockAdminProfiles();
      
      if (query.fullName) {
        profiles = profiles.filter(p => 
          p.fullName.toLowerCase().includes(query.fullName!.toLowerCase())
        );
      }
      
      if (query.isActive !== undefined) {
        profiles = profiles.filter(p => p.isActive === query.isActive);
      }
      
      if (query.departmentId) {
        profiles = profiles.filter(p => 
          p.departmentName === getMockDepartmentById(query.departmentId).name
        );
      }
      
      const start = (query.pageNumber - 1) * query.pageSize;
      const end = start + query.pageSize;
      resolve(profiles.slice(start, end));
    }, 500);
  });
};

export const adminCreateProfile = async ( request: AdminCreateProfileRequest
): Promise<AdminCreateProfileResponse> => {
  // Return mock response
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Проверка: если email = "for.dota@yandex.ru", то возвращаем ошибку 409 (Conflict)
      if (request.email === 'for.dota@yandex.ru') {
        const error: any = new Error('Email already exists');
        error.response = {
          status: 409,
          data: {
            message: 'Email already exists in the system'
          }
        };
        reject(error);
        return;
      }
      
      resolve({
        firstName: request.firstName,
        lastName: request.lastName,
        patronymic: request.patronymic,
        phoneNumber: request.phoneNumber,
        email: request.email,
        hireDate: request.hireDate,
        createdAt: new Date().toISOString(),
        departmentId: request.departmentId,
        IsActive: true
      });
    }, 500);
  });
};

export const adminUpdateProfile = async ( request: AdminUpdateProfileRequest): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Admin profile updated (mock):', request);
      resolve();
    }, 500);
  });
};


export const adminDeleteProfile = async (id: number): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Admin profile deleted (mock):', id);
      resolve();
    }, 500);
  });
};

// Helper function to get mock department by id (imported from mockData)
const getMockDepartmentById = (id: number) => {
  const departments = [
    { id: 1, name: 'Продажи', headDepartment: 'Иван Петров' },
    { id: 2, name: 'Маркетинг', headDepartment: 'Екатерина Смирнова' },
    { id: 3, name: 'IT', headDepartment: 'Сергей Козлов' },
    { id: 4, name: 'Финансы', headDepartment: 'Ольга Волкова' },
  ];
  return departments.find(d => d.id === id) || departments[0];
};
