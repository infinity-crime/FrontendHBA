export interface AuthResponse {
    token: string;
    isFirstLogin:boolean
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerifyResetCodetRequest {
    email: string;
    code:string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
    verifyPassword : string;
}

export interface ChangePasswordRequest {
    userId: number;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}