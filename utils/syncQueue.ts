import AsyncStorage from '@react-native-async-storage/async-storage';
import { Word } from '../types/storiesTypes';

const QUEUE_KEY = 'sync_queue_words';

// Описываем структуру объекта в очереди
export interface SyncQueueItem {
  userId: string;
  word: Word;
  id: string;
}

export const addToSyncQueue = async (userId: string, word: Word) => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    const queue: SyncQueueItem[] = raw ? JSON.parse(raw) : [];

    const newItem: SyncQueueItem = {
      userId,
      word,
      id: Date.now().toString() + Math.random().toString(36).slice(2), // Добавляем рандом для уникальности
    };

    queue.push(newItem);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to add word to sync queue:', error);
  }
};

export const getSyncQueue = async (): Promise<SyncQueueItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to get sync queue:', error);
    return [];
  }
};

export const clearSyncQueue = async () => {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear sync queue:', error);
  }
};

// Полезное дополнение: удаление конкретного элемента из очереди после успешной отправки
export const removeFromQueue = async (itemId: string) => {
  try {
    const queue = await getSyncQueue();
    const filteredQueue = queue.filter(item => item.id !== itemId);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filteredQueue));
  } catch (error) {
    console.error('Failed to remove item from queue:', error);
  }
};
