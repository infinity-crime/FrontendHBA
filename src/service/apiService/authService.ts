
import { api } from '../api/authApi.ts';
import type { LoginRequest, AuthResponse, VerifyResetCodetRequest, ResetPasswordRequest, ChangePasswordRequest} from '../../components/types/Auth.ts';

export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  // This is not used anymore as LoginForm generates mock token directly
  const response = await api.post<AuthResponse>('/auth/login', request);
  
  return response.data;
};

export const refreshToken = async (): Promise<{ token: string }> => {
  // Mock response - generate a new mock token
  return new Promise((resolve) => {
    setTimeout(() => {
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };
      
      const payload = {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '1',
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'mockuser',
        'iat': Math.floor(Date.now() / 1000),
        'exp': Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
      };
      
      const base64UrlEncode = (str: string): string => {
        return btoa(str)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      };
      
      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedPayload = base64UrlEncode(JSON.stringify(payload));
      const signature = base64UrlEncode('mock-signature');
      
      const token = `${encodedHeader}.${encodedPayload}.${signature}`;
      
      resolve({ token });
    }, 500);
  });
};

export const logout = async (): Promise<void> => {
  // Mock logout - just remove token and user login
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('userLogin');
      console.log('Logged out (mock)');
      resolve();
    }, 500);
  });
};

export const changePassword = async (request: ChangePasswordRequest): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Password changed (mock):', request);
      resolve();
    }, 500);
  });
};

export const forgotPassword = async (email: string): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Forgot password request sent (mock) for:', email);
      resolve();
    }, 500);
  });
};

export const verifyResetCodePassword = async (request: VerifyResetCodetRequest): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Reset code verified (mock):', request);
      resolve();
    }, 500);
  });
};

export const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Password reset (mock):', request);
      resolve();
    }, 500);
  });
};

