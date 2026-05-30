import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

import { useHistoryJobsStore } from '../../state/historyJobsStore';
import { useTrainingStore } from '../../state/userStore';

const CACHE_KEYS = ['stories:list', 'history-jobs-storage', 'training-storage'];

const CACHE_PREFIXES = ['userWords:'];

const CACHE_DIRS = [
  `${RNFS.CachesDirectoryPath}/images`,
  `${RNFS.CachesDirectoryPath}/audio`,
];

export async function clearAppCache() {
  const keys = await AsyncStorage.getAllKeys();

  const keysToRemove = keys.filter(key => {
    if (CACHE_KEYS.includes(key)) return true;
    return CACHE_PREFIXES.some(prefix => key.startsWith(prefix));
  });

  if (keysToRemove.length > 0) {
    await AsyncStorage.multiRemove(keysToRemove);
  }

  for (const dir of CACHE_DIRS) {
    const exists = await RNFS.exists(dir);

    if (exists) {
      await RNFS.unlink(dir);
    }
  }

  useHistoryJobsStore.getState().reset();
  useTrainingStore.getState().reset();
}
