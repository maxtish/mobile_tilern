import { SERVER_URL } from '../constants/constants';
import { useUserStore } from '../state/userStore';

interface AddHistoryResponse {
  generatedStory: string;
}

export async function addHistory(story: string): Promise<AddHistoryResponse> {
  const token = useUserStore.getState().token; // достаем токен напрямую из Zustand

  if (!token) {
    throw new Error('Пользователь не авторизован');
  }

  const res = await fetch(`${SERVER_URL}/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ story }),
  });

  const data = await res.json();

  if (!res.ok) {
    // Выдаем ошибку с сервера, если есть поле error
    throw new Error(data.error || `Ошибка ${res.status}: ${res.statusText}`);
  }

  return data;
}
