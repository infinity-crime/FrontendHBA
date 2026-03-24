import { type DepartmentResponse } from './Departament.ts';
import { type PositionLiteResponse } from './Position.ts';

export type DepartmentPositionResponse = {
    id:number;
    position: PositionLiteResponse;
    department: DepartmentResponse;
}