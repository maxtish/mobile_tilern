import { useUserStore } from '../state/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { History } from '../types/storiesTypes';

export const logoutAuthOnly = async () => {
  useUserStore.getState().logout();

  try {
    await AsyncStorage.removeItem('user-storage');
  } catch (e) {
    console.warn('Failed to clear user storage', e);
  }
};

export const clearAllLocalData = async () => {
  await AsyncStorage.multiRemove([
    'user-storage',
    'stories:list',
    'training-storage',
  ]);
};
