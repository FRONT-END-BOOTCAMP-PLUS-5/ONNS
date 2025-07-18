import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let isRedirecting = false;

const redirectToLogin = () => {
  if (!isRedirecting) {
    isRedirecting = true;
    console.log('Redirecting to login...');
    window.location.href = '/?login=1';
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url === '/auth/refresh') {
      redirectToLogin();
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing && refreshPromise) {
        try {
          console.log('Waiting for existing refresh...');
          await refreshPromise;
          console.log('Refresh completed, retrying request...');
          return api(originalRequest);
        } catch (refreshError) {
          redirectToLogin();
          return Promise.reject(refreshError);
        }
      }

      isRefreshing = true;

      const refreshAxios = axios.create({
        baseURL: '/api',
        timeout: 10000,
      });

      refreshPromise = refreshAxios
        .post('/auth/refresh')
        .then(() => {
          console.log('Token refresh successful');
          isRefreshing = false;
          refreshPromise = null;
        })
        .catch((refreshError) => {
          console.log(
            'Token refresh failed:',
            refreshError.response?.status,
            refreshError.response?.data,
          );
          isRefreshing = false;
          refreshPromise = null;
          redirectToLogin();
          return Promise.reject(refreshError);
        });

      try {
        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
