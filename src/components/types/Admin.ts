

export type AdminProfileResponse = {
    id:number;
    userId:number;
    fullName:string,
    departmentName:string,
    isActive: boolean
}


export type AdminCreateProfileRequest = {
    firstName: string;
    lastName: string;
    patronymic: string;
    phoneNumber:string;
    email: string;
    birthDate:string;
    hireDate:string;
    departmentId: number;
    positionId: number;
}


export type AdminCreateProfileResponse = {
    firstName:string;
    lastName:string;
    patronymic:string;
    phoneNumber:string;
    email:string;
    hireDate:string;
    createdAt:string;
    departmentId:number;
    IsActive:boolean;
}


export type AdminUpdateProfileRequest = {
    id:number;
    departmentId:number
    positionId:number
    firstName: string;
    lastName: string;
    patronymic: string;
    phoneNumber:string;
    email: string;
    birthDate: string,
    isActive: boolean,
}
