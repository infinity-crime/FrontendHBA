import axios from 'axios';
import { Interceptors } from '../interceptors.ts';


const BASE_URL ='https://localhost:7235/api/v1/departments';

export const apiDepart = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

Interceptors(apiDepart);