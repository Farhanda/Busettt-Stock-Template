import axios, { AxiosInstance } from 'axios';
import { ApiResponse, ApiPayload } from './types';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor untuk menyisipkan Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Helper Fungsi Unified Request
 * @param endpoint contoh: '/product', '/auth', '/transaction'
 * @param action nama aksi yang diinginkan BE
 * @param data payload data (optional)
 */
export const sendRequest = async <T>(
  endpoint: string,
  action: string,
  data: any = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.post<ApiResponse<T>>(endpoint, { action, data });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Terjadi kesalahan koneksi',
    };
  }
};