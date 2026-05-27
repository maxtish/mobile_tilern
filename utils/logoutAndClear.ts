import { useUserStore } from '../state/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHistoryJobsStore } from '../state/historyJobsStore';

export const logoutAuthOnly = async () => {
  useUserStore.getState().logout();
  useHistoryJobsStore.getState().reset();
  try {
    await AsyncStorage.removeItem('user-storage');
  } catch (e) {
    console.warn('Failed to clear user storage', e);
  }
};

export const clearAllLocalData = async () => {
  useHistoryJobsStore.getState().reset();

  await AsyncStorage.multiRemove([
    'user-storage',
    'stories:list',
    'training-storage',
    'history-jobs-storage',
  ]);
};
