import { Word } from './storiesTypes';

// --- Интерфейс для таблицы UserWords ---
export interface DBUserWord {
  id: string;
  user_id: string;
  history_id: string | null;
  word: Word; // { type: 'noun' | 'verb' | 'other'; word: string | { singular: string; plural: string }; translation: string }
  created_at: string; // timestamp в формате ISO
}

// --- Унифицированная модель для фронтенда ---
export interface UserWord {
  id: string;
  userId: string;
  historyId?: string | null;
  word: Word;
  createdAt: string;
}

// --- Фронтенд → База данных ---
export const mapUserWordToDB = (userWord: UserWord): DBUserWord => ({
  id: userWord.id,
  user_id: userWord.userId,
  history_id: userWord.historyId ?? null,
  word: userWord.word,
  created_at: userWord.createdAt,
});

// --- База данных → Фронтенд ---
export const mapDBToUserWord = (dbUserWord: DBUserWord): UserWord => ({
  id: dbUserWord.id,
  userId: dbUserWord.user_id,
  historyId: dbUserWord.history_id,
  word: dbUserWord.word,
  createdAt: dbUserWord.created_at,
});

export type TrainingWord = {
  word: Word;
  id: string;
  passedCorrectly: boolean;
  failed: boolean;
};

export interface TrainingState {
  words: TrainingWord[];
  setWords: (words: TrainingWord[]) => void;
  markCorrect: (id: string) => void;
  markFailed: (id: string) => void;
  reset: () => void;
}

export interface TrainingStateStorage {
  words: TrainingWord[];
}
