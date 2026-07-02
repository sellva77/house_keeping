import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { getMeApi } from '../api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, token: string) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user: User, token: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  updateUser: async (user: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const { user } = await getMeApi();
        set({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
