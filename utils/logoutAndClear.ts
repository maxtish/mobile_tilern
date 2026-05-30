import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '../state/userStore';
import { useHistoryJobsStore } from '../state/historyJobsStore';
import { clearTokens } from './tokenStorage';

export const logoutAuthOnly = async () => {
  useUserStore.getState().logout();
  useHistoryJobsStore.getState().reset();

  try {
    await clearTokens();
    await AsyncStorage.removeItem('user-storage');
  } catch (e) {
    console.warn('Failed to clear auth storage', e);
  }
};

export const clearAllLocalData = async () => {
  useUserStore.getState().logout();
  useHistoryJobsStore.getState().reset();

  await clearTokens();

  await AsyncStorage.multiRemove([
    'user-storage',
    'stories:list',
    'training-storage',
    'history-jobs-storage',
  ]);
};
