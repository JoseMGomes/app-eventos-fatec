import axios from 'axios';
import baseUrl from '../config/baseUrl';
import { getToken } from '../utils/tokenSave';

export const api = axios.create({
  baseURL: baseUrl.URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'app://agenda-fatec' 
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
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      setCookieHeader.forEach((cookie) => {
        if (cookie.includes('XSRF-TOKEN=')) {
          const csrfToken = cookie.split(';')[0].split('=')[1];
          api.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
          api.defaults.headers.common['X-CSRF-Token'] = csrfToken; 
        }
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);