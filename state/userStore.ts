// app/state/userStore.ts
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState } from '../types/userTypes';
import { TrainingState, TrainingWord } from '../types/storiesTypes';

const asyncStorageUserState: PersistStorage<UserState> = {
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (!value) return null;

      const parsed = JSON.parse(value);

      if ('state' in parsed) return parsed;

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

/**
 * useUserStore
 *
 * sessionStatus:
 * - valid: токены нормальные
 * - needs_refresh: access token протух, но сервер/интернет недоступен
 * - expired: сервер подтвердил, что refresh token умер
 */
export const useUserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      token: null,
      refreshToken: null,

      sessionStatus: 'valid',

      setUser: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          sessionStatus: 'valid',
        }),

      setSessionStatus: sessionStatus => set({ sessionStatus }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          sessionStatus: 'expired',
        }),
    }),
    {
      name: 'user-storage',
      storage: asyncStorageUserState,
    },
  ),
);

// -------------------------
// useTrainingStore — состояние для тренировки слов
// -------------------------

export interface TrainingStateStorage {
  words: TrainingWord[];
}

const asyncStorageTrainingState: PersistStorage<TrainingStateStorage> = {
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (!value) return null;

      const parsed = JSON.parse(value);

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
