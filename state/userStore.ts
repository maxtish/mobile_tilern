// app/state/userStore.ts
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState } from '../types/userTypes';
import { TrainingState, TrainingWord } from '../types/userWord';

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

// -------------------------
// useTrainingStore — состояние для тренировки слов
export interface TrainingStateStorage {
  words: TrainingWord[];
}

const asyncStorageTrainingState: PersistStorage<TrainingStateStorage> = {
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (!value) return null;

      const parsed = JSON.parse(value);

      // возвращаем объект с ключом state, как ожидает Zustand
      if ('state' in parsed) return parsed;
      return { state: parsed };
    } catch (e) {
      console.warn('Failed to parse training state, resetting', e);
      await AsyncStorage.removeItem(name);
      return null;
    }
  },
  setItem: async (
    name: string,
    value: { state: TrainingStateStorage; version?: number },
  ) => {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
      console.warn('Failed to save training state', e);
    }
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      words: [],
      setWords: (words: TrainingWord[]) => set({ words }),
      markCorrect: (id: string) =>
        set({
          words: get().words.map(w =>
            w.id === id ? { ...w, passedCorrectly: true, failed: false } : w,
          ),
        }),
      markFailed: (id: string) =>
        set({
          words: get().words.map(w =>
            w.id === id ? { ...w, failed: true } : w,
          ),
        }),
      reset: () => set({ words: [] }),
    }),
    {
      name: 'training-storage',
      storage: asyncStorageTrainingState,
    },
  ),
);
