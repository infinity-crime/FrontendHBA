import {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload} from '../components/types/JwtPayload';
import { processQueue, refreshApi, refreshState } from "./Common/common";

export const Interceptors = (instance: AxiosInstance) => {

const ERROR_TOAST_ID = 'error';
const ERROR_REFRESH_TOAST_ID = 'error_refresh';

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
    const isAuthPath =
      config.url?.includes('login') ||
      config.url?.includes('refresh') ||
      config.url?.includes('forgot-password') ||
      config.url?.includes('restore-password')

    if (!isAuthPath) {
      const token: string | null = localStorage.getItem('access_token');

      if (token === null) {window.location.href = "/login";}
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;

        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        
          if (userId && config.url) {
            config.url = config.url.replace(/:userId/g, encodeURIComponent(String(userId)));
          }
        } catch (error) {
          console.error('Ошибка декодирования токена:', error);
        }
      }
    }
    return config;
  },
  (error): Promise<never> => Promise.reject(error),
);
   
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      silent?: boolean; 
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (refreshState.isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          refreshState.failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      refreshState.isRefreshing = true;

      try {
        const response = await refreshApi.post('/auth/refresh');
        if (!response.data.token) {
          throw new Error("Нет нового токена");
        }
        const { token } = response.data;
        localStorage.setItem('access_token', token);
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${token}`;

        processQueue(null, token);

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        toast.error("Ошибка авторизации. Переход на страницу входа...",{toastId: ERROR_REFRESH_TOAST_ID});

        await new Promise((resolve) => setTimeout(resolve, 5000));

        localStorage.removeItem('access_token');
        delete instance.defaults.headers.common.Authorization; 
      
        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        refreshState.isRefreshing = false;
      }
    }

    let message = "Произошла ошибка"

    if (error.response) {
      const status = error.response.status
      const data = error.response.data as
        | {
            errors?: Record<string, string[]>
          }
        | undefined

      if (error.response?.status === 403 ){
        message = "Нет доступа"
        localStorage.removeItem('access_token');
        delete instance.defaults.headers.common.Authorization;   
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      if (data?.errors) {
        const allErrors = Object.values(data.errors)
          .flat()
          .filter(Boolean)

        message =
          allErrors.length > 0
            ? allErrors.join(", ")
            : "Ошибка валидации"
      } else {
        if (status === 400)
          message = "Некорректный запрос"
        else if (status === 404)
          message = "Ресурс не найден"
        else if (status === 409)
          message = "Конфликт данных"
        else if (status >= 500)
          message = "Ошибка сервера. Попробуйте позже"
      }
    } else if (error.request) {
      message = "Нет соединения с сервером. Проверьте интернет."
    } else {
      message = "Неизвестная ошибка"
    }

    if (typeof window !== "undefined" && !originalRequest?.silent) {
      toast.error(message, {
        toastId: ERROR_TOAST_ID, 
        autoClose: 2000,})
    }

    return Promise.reject(error);
  },
);

}