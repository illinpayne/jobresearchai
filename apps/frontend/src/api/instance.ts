"use client";

import axios, { type InternalAxiosRequestConfig } from "axios";
import { redirect } from "next/navigation";
import { DisposeCache } from "@/lib/cache";
import {
  getSessionToken,
  removeSessionToken,
  setSessionToken,
} from "@/lib/cookies";
import { APP_CONFIG } from "../constants/app";
import { logout, refresh } from "./requests/auth.req";

export const api = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  withCredentials: true,
});

export const instance = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getSessionToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const resp = await refresh();
        const newAccessToken = resp.accessToken;

        setSessionToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeSessionToken();
        if (typeof window !== "undefined") {
          DisposeCache();
        }
        await logout();
        setTimeout(() => {
          redirect("/signin");
        }, 1000);

        return Promise.reject("Session expired");
      } finally {
        // Unlock the refresh process regardless of success or failure
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// let isRefreshing = false;
// instance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (!isRefreshing) {
//         try {
//           const resp = await refresh();
//           const newAccessToken = resp.accessToken;
//           setSessionToken(newAccessToken);

//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//           return instance(originalRequest);
//         } catch (error) {
//           removeSessionToken();
//           if (typeof window !== "undefined") {
//             DisposeCache();
//           }
//           await logout();
//           // const { toast } = await import("sonner");
//           // toast.error("Session expired, redirecting to login.");
//           isRefreshing = true;
//           // setTimeout(() => {
//           //   redirect('/signin');
//           // }, 1000);
//           return Promise.reject("Session expired");
//         }
//       }
//     }
//     return Promise.reject(error);
//   },
// );
