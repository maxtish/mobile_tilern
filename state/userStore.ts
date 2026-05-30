import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserState } from '../types/userTypes';
import { TrainingState, TrainingWord } from '../types/storiesTypes';

const normalizeUser = (user: User | null): User | null => {
  if (!user) return null;

  return {
    ...user,
    emailVerified: Boolean(user.emailVerified),
  };
};

const asyncStorageUserState: PersistStorage<UserState> = {
  getItem: async (name: string) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (!value) return null;

      const parsed = JSON.parse(value);

      if ('state' in parsed) {
        return {
          ...parsed,
          state: {
            user: normalizeUser(parsed.state.user ?? null),
            sessionStatus: parsed.state.sessionStatus ?? 'valid',
          },
        };
      }

      return {
        state: {
          user: normalizeUser(parsed.user ?? null),
          sessionStatus: parsed.sessionStatus ?? 'valid',
        },
      };
    } catch (e) {
      console.warn('Failed to parse user storage, resetting', e);
      await AsyncStorage.removeItem(name);
      return null;
    }
  },

  setItem: async (
    name: string,
    value: { state: UserState; version?: number },
  ) => {
    try {
      const normalizedValue = {
        ...value,
        state: {
          ...value.state,
          user: normalizeUser(value.state.user),
        },
      };

      await AsyncStorage.setItem(name, JSON.stringify(normalizedValue));
    } catch (e) {
      console.warn('Failed to save user storage', e);
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
      sessionStatus: 'valid',

      setUser: user =>
        set({
          user: normalizeUser(user),
          sessionStatus: 'valid',
        }),

      setSessionStatus: sessionStatus => set({ sessionStatus }),

      logout: () =>
        set({
          user: null,
          sessionStatus: 'expired',
        }),
    }),
    {
      name: 'user-storage',
      storage: asyncStorageUserState,
    },
  ),
);

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
