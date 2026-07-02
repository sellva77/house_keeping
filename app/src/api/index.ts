import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ServiceCategory,
  ProviderProfile,
  Booking,
  Review,
  CreateBookingPayload,
  CreateReviewPayload,
  User,
} from '../types';

// Use 10.0.2.2 for Android emulator (maps to host localhost)
// const BASE_URL = 'http://192.168.1.5:5000/api';
const BASE_URL = 'http://10.120.78.27:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Auth =====

export const loginApi = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const registerApi = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const getMeApi = async (): Promise<{ user: User }> => {
  const res = await api.get('/auth/me');
  return res.data;
};

// ===== Services =====

export const getCategoriesApi = async (): Promise<{ categories: ServiceCategory[] }> => {
  const res = await api.get('/services/categories');
  return res.data;
};

export const getProvidersByCategoryApi = async (
  categoryId?: number
): Promise<{ providers: ProviderProfile[] }> => {
  const params = categoryId ? { categoryId } : {};
  const res = await api.get('/services/providers', { params });
  return res.data;
};

export const getProviderDetailApi = async (
  userId: number
): Promise<{ provider: ProviderProfile; reviews: Review[] }> => {
  const res = await api.get(`/services/providers/${userId}`);
  return res.data;
};

// ===== Bookings =====

export const createBookingApi = async (data: CreateBookingPayload): Promise<{ booking: Booking }> => {
  const res = await api.post('/bookings', data);
  return res.data;
};

export const getMyBookingsApi = async (
  status?: string
): Promise<{ bookings: Booking[] }> => {
  const params = status ? { status } : {};
  const res = await api.get('/bookings/my', { params });
  return res.data;
};

export const acceptBookingApi = async (id: number): Promise<{ booking: Booking }> => {
  const res = await api.patch(`/bookings/${id}/accept`);
  return res.data;
};

export const rejectBookingApi = async (id: number): Promise<{ booking: Booking }> => {
  const res = await api.patch(`/bookings/${id}/reject`);
  return res.data;
};

export const completeBookingApi = async (id: number): Promise<{ booking: Booking }> => {
  const res = await api.patch(`/bookings/${id}/complete`);
  return res.data;
};

export const cancelBookingApi = async (id: number): Promise<{ booking: Booking }> => {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return res.data;
};

// ===== Reviews =====

export const createReviewApi = async (data: CreateReviewPayload): Promise<{ review: Review }> => {
  const res = await api.post('/reviews', data);
  return res.data;
};

export const getProviderReviewsApi = async (
  providerId: number
): Promise<{ reviews: Review[] }> => {
  const res = await api.get(`/reviews/provider/${providerId}`);
  return res.data;
};

// ===== Profile =====

export const getProfileApi = async (): Promise<{ user: User }> => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateProfileApi = async (
  data: Partial<User & { skills?: string; experience?: number; hourlyRate?: number; serviceArea?: string }>
): Promise<{ user: User }> => {
  const res = await api.put('/profile', data);
  return res.data;
};

export default api;
