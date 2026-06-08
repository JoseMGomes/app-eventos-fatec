import axios from 'axios';
import { Alert } from 'react-native';
import baseUrl from '../config/baseUrl';
import { getToken } from '../utils/tokenSave';

export const api = axios.create({
  baseURL: baseUrl.URL,
  timeout: 20000,
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


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      Alert.alert(
        "Conexão Lenta",
        "A internet parece estar instável ou o servidor demorou muito para responder. Por favor, tente novamente."
      );
    }
    return Promise.reject(error);
  }
);