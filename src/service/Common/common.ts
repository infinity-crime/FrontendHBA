import axios from "axios";

//Клиент для выполения запроса на refresh токена
export const refreshApi = axios.create({
    baseURL: 'https://localhost:9001/api',
    withCredentials: true, 
});

//Флаг и массив для хранения запросов, которые нужно повторить после обновления токена
export const refreshState = {
  isRefreshing: false,
  failedQueue: [] as { resolve: (token: string) => void; reject: (reason?: unknown) => void }[],
};

//Общая очередь запросов, чтобы не вызывалось по несколько запросов на refresh токена
export const processQueue = (error: unknown = null, token: string | null = null): void => {
  refreshState.failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token !== null) {
      prom.resolve(token);
    }
  });
  refreshState.failedQueue= [];
};