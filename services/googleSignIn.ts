import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { GOOGLE_WEB_CLIENT_ID } from '../constants/google';

let configured = false;

export function configureGoogleSignIn() {
  if (configured) return;

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });

  configured = true;
}

export async function getGoogleIdToken(): Promise<string | null> {
  configureGoogleSignIn();

  try {
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 500);
    });

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const result = await GoogleSignin.signIn();

    const idToken = result.data?.idToken;

    if (!idToken) {
      throw new Error('Google не вернул idToken');
    }

    return idToken;
  } catch (err: any) {
    if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      return null;
    }

    if (err.code === statusCodes.IN_PROGRESS) {
      throw new Error('Вход через Google уже выполняется');
    }

    if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Google Play Services недоступны или устарели');
    }

    throw err;
  }
}
