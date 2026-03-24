

export type PositionResponse = {
    id:number;
    name: string;
    createdAt: string;
    updatedAt: string | null;
}

export type PositionLiteResponse = {
    id:number;
    name: string;
}


export type CreatePositionRequest = {
    departmentId:number;
    name: string;
}

export type UpdatePositionRequest = {
    id:number;
    name: string;
}

