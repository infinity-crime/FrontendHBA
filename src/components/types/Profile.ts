export interface ProfileResponse {
    id: number;
    departmentId: number;
    positionId: number;
    firstName: string;
    lastName: string;
    patronymic: string;
    phoneNumber: string;
    email: string;
    isActive: boolean;
    positionName: string;
    birthDate: string;
    hireDate: string;
    dismissalDate?: string;
    departmentName: string;
    createdAt: string;
    updatedAt?: string;
}

export interface UpdateProfile{
    id: number | undefined;
    userId: number | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    patronymic: string | undefined;
    phoneNumber: string | undefined;
}


