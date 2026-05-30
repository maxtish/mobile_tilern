import AsyncStorage from '@react-native-async-storage/async-storage';

import { useUserStore } from '../state/userStore';
import { clearTokens } from './tokenStorage';
import { clearAppCache } from './cache/clearAppCache';

export const logoutAuthOnly = async () => {
  useUserStore.getState().logout();

  try {
    await clearAppCache();
    await clearTokens();
    await AsyncStorage.removeItem('user-storage');
  } catch (e) {
    console.warn('Failed to clear auth storage', e);
  }
};

export const clearAllLocalData = async () => {
  useUserStore.getState().logout();

  await clearAppCache();
  await clearTokens();

  await AsyncStorage.removeItem('user-storage');
};
