import axios from 'axios';
import { Interceptors } from '../interceptors.ts';


const BASE_URL ='https://localhost:9001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

Interceptors(api);

