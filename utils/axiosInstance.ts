import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing && refreshPromise) {
        try {
          await refreshPromise;
          return api(originalRequest);
        } catch (refreshError) {
          window.location.href = '/?login=1';
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      const refreshAxios = axios.create({
        baseURL: '/api',
        withCredentials: true,
        timeout: 10000,
      });

      refreshPromise = refreshAxios
        .post('/auth/refresh')
        .then(() => {
          isRefreshing = false;
          refreshPromise = null;
        })
        .catch((refreshError) => {
          isRefreshing = false;
          refreshPromise = null;
          window.location.href = '/?login=1';
          return Promise.reject(refreshError);
        });

      try {
        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/?login=1';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
