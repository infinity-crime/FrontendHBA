import { apiDepartPosition} from '../api/departamentPositionApi.ts';
import { getMockDepartmentPositions } from '../mockData/mockDepartmentPositionData.ts';
import type { DepartmentPositionResponse} from '../../components/types/DepartmentPosition.ts';

export interface PositionsQuery{
  departmentName?:string
  positionName?:string
  pageNumber: number
  pageSize: number
}

export const getAllDepartmentPositions= async ( 
    query: PositionsQuery
): Promise<DepartmentPositionResponse[]> => {
  // Return mock data with filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      let positions = getMockDepartmentPositions();
      
      if (query.departmentName) {
        positions = positions.filter(p => 
          p.department.name.toLowerCase().includes(query.departmentName!.toLowerCase())
        );
      }
      
      if (query.positionName) {
        positions = positions.filter(p => 
          p.position.name.toLowerCase().includes(query.positionName!.toLowerCase())
        );
      }
      
      const start = (query.pageNumber - 1) * query.pageSize;
      const end = start + query.pageSize;
      resolve(positions.slice(start, end));
    }, 500);
  });
};

