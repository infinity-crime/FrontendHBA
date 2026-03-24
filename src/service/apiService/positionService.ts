
import type { CreatePositionRequest, PositionResponse, UpdatePositionRequest } from '../../components/types/Position.ts';
import { apiPosition} from '../api/positionApi.ts';
import { getMockPositionsByDepartmentId } from '../mockData/mockPositionData.ts';


export const getAllPositionsByDepartamnetId = async (id:number| undefined): Promise<PositionResponse[]> => {
  // Return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockPositionsByDepartmentId(id));
    }, 500);
  });
};

export const createPosition = async (request: CreatePositionRequest): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Position created (mock):', request);
      resolve();
    }, 500);
  });
};

export const updatePosition = async (request: UpdatePositionRequest): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Position updated (mock):', request);
      resolve();
    }, 500);
  });
};

export const deletePosition = async (id:number| undefined): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Position deleted (mock):', id);
      resolve();
    }, 500);
  });
};

