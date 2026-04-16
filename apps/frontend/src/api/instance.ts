import axios from 'axios';
import { redirect } from 'next/navigation';
import { accountCacheKey } from '@/lib/cache';
import { getSessionToken, removeSessionToken, setSessionToken } from '@/lib/cookies';
import { APP_CONFIG } from '../constants/app';
import { logout, refresh } from './requests/auth.req';

export const api = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  withCredentials: true,
});

export const instance = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        try {
          const resp = await refresh();
          const newAccessToken = resp.accessToken;
          setSessionToken(newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (error) {
          removeSessionToken();
          if (typeof window !== 'undefined') {
            localStorage.removeItem(accountCacheKey);
          }
          await logout();
          // const { toast } = await import("sonner");
          // toast.error("Session expired, redirecting to login.");
          isRefreshing = true;
          // setTimeout(() => {
          //   redirect('/signin');
          // }, 1000);
          return Promise.reject('Session expired');
        }
      }
    }
    return Promise.reject(error);
  },
);
