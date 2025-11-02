// app/state/userStore.ts
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState } from '../types/userTypes';

const asyncStorageUserState: PersistStorage<UserState> = {
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (!value) return null;

      const parsed = JSON.parse(value);

      // если объект уже содержит state — возвращаем как есть
      if ('state' in parsed) return parsed;

      // если старый формат (просто UserState), оборачиваем
      return { state: parsed };
    } catch (e) {
      console.warn('Failed to parse storage value, resetting', e);
      await AsyncStorage.removeItem(name);
      return null;
    }
  },
  setItem: async (
    name: string,
    value: { state: UserState; version?: number },
  ) => {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save storage value', e);
    }
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'user-storage',
      storage: asyncStorageUserState,
    },
  ),
);
