import { SERVER_URL } from '../constants/constants';
import { useUserStore } from '../state/userStore';

export async function deleteHistory(historyId: string): Promise<void> {
  const token = useUserStore.getState().token;

  if (!token) {
    throw new Error('Пользователь не авторизован');
  }

  const res = await fetch(`${SERVER_URL}/history/${historyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Ошибка ${res.status}: ${res.statusText}`);
  }
}
