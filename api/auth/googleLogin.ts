import { apiFetch } from '../apiFetch';
import { LoginResponse } from '../../types/userTypes';

export async function googleLogin(
  idToken: string,
  deviceInfo: string,
): Promise<LoginResponse> {
  const res = await apiFetch(
    '/auth/google',
    {
      method: 'POST',
      body: JSON.stringify({ idToken, deviceInfo }),
    },
    false,
    10000,
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Google login failed');
  }

  return data;
}
