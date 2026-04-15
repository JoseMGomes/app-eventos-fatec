import axios from 'axios';
import baseUrl from '../config/baseUrl';
import { getToken } from '../utils/tokenSave';

export const api = axios.create({
  baseURL: baseUrl.URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);