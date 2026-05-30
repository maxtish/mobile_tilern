import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'tilern.auth.tokens';

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function saveTokens(tokens: StoredTokens): Promise<void> {
  await Keychain.setGenericPassword('tokens', JSON.stringify(tokens), {
    service: TOKEN_SERVICE,
  });
}

export async function getTokens(): Promise<StoredTokens | null> {
  const credentials = await Keychain.getGenericPassword({
    service: TOKEN_SERVICE,
  });

  if (!credentials) return null;

  try {
    return JSON.parse(credentials.password) as StoredTokens;
  } catch {
    await clearTokens();
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  const tokens = await getTokens();
  return tokens?.accessToken || null;
}

export async function getRefreshToken(): Promise<string | null> {
  const tokens = await getTokens();
  return tokens?.refreshToken || null;
}

export async function clearTokens(): Promise<void> {
  await Keychain.resetGenericPassword({
    service: TOKEN_SERVICE,
  });
}
