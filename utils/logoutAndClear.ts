import { useUserStore } from '../state/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { History } from '../types/storiesTypes';

export const logoutAndClear = async (
  setHistories: React.Dispatch<React.SetStateAction<History[]>>,
) => {
  const { logout } = useUserStore.getState(); // вызываем logout для очистки стейта
  logout();

  try {
    await AsyncStorage.removeItem('user-storage'); // очищаем persist вручную
  } catch (e) {
    console.warn('Failed to clear AsyncStorage', e);
  }

  setHistories([]); // очищаем локальные истории
};
