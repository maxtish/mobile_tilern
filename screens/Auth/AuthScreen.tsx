import React, { useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  AppState,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../state/userStore';
import { login } from '../../api/auth/login';
import { register } from '../../api/auth/register';
import { refreshToken } from '../../api/auth/refresh';
import { forgotPassword } from '../../api/auth/forgotPassword';
import { resetPassword } from '../../api/auth/resetPassword';
import { sendVerificationEmail } from '../../api/auth/sendVerificationEmail';
import { getMe } from '../../api/auth/me';
import { googleLogin } from '../../api/auth/googleLogin';
import { getGoogleIdToken } from '../../services/googleSignIn';
import { useAppTheme } from '../../theme/ThemeProvider';
import { mapServerUserToClient, User } from '../../types/userTypes';
import { saveTokens } from '../../utils/tokenStorage';
import { logoutAuthOnly } from '../../utils/logoutAndClear';
import { AuthMode } from './types';
import ProfileView from './components/ProfileView';
import AuthForm from './components/AuthForm';
import { getDeviceDescription } from '../../utils/deviceInfo';
import { changeEmail } from '../../api/auth/changeEmail';
import { clearAppCache } from '../../utils/cache/clearAppCache';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { appTheme, toggleTheme } = useAppTheme();

  const user = useUserStore(state => state.user);

  const [mode, setMode] = useState<AuthMode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');

  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const refreshProfile = async () => {
    if (!useUserStore.getState().user) return;

    try {
      const freshUser: User = await getMe();
      useUserStore.getState().setUser(freshUser);
    } catch (err) {
      console.log('Profile refresh failed:', err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      if (useUserStore.getState().user) {
        try {
          await refreshToken();
          await refreshProfile();
        } catch {
          console.log('Session check failed on mount');
        }
      }

      setHydrated(true);
    };

    checkSession();

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refreshProfile();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAuthSubmit = async () => {
    if (mode === 'login' || mode === 'register') {
      if (
        !email.trim() ||
        !password.trim() ||
        (mode === 'register' && !name.trim())
      ) {
        Alert.alert('Ошибка', 'Заполните все поля');
        return;
      }

      setLoading(true);

      try {
        const deviceInfo = await getDeviceDescription();
        const data =
          mode === 'login'
            ? await login(email.trim(), password, deviceInfo)
            : await register(email.trim(), password, name.trim(), deviceInfo);

        const mappedUser = mapServerUserToClient(data.user);

        await saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        useUserStore.getState().setUser(mappedUser);
      } catch (err: any) {
        Alert.alert('Ошибка', err.message || 'Произошла ошибка при входе');
      } finally {
        setLoading(false);
      }

      return;
    }

    if (mode === 'forgot') {
      if (!email.trim()) {
        Alert.alert('Ошибка', 'Введите email');
        return;
      }

      setLoading(true);

      try {
        await forgotPassword(email.trim());

        Alert.alert(
          'Письмо отправлено',
          'Если такой email существует, мы отправили инструкцию для восстановления пароля.',
        );

        setMode('reset');
      } catch (err: any) {
        Alert.alert('Ошибка', err.message || 'Не удалось отправить письмо');
      } finally {
        setLoading(false);
      }

      return;
    }

    if (mode === 'reset') {
      if (!resetToken.trim() || !newPassword.trim()) {
        Alert.alert('Ошибка', 'Введите token и новый пароль');
        return;
      }

      setLoading(true);

      try {
        await resetPassword({
          token: resetToken.trim(),
          newPassword: newPassword.trim(),
        });

        Alert.alert('Готово', 'Пароль изменён. Теперь можно войти.');
        setMode('login');
        setPassword('');
        setNewPassword('');
        setResetToken('');
      } catch (err: any) {
        Alert.alert('Ошибка', err.message || 'Не удалось изменить пароль');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const idToken = await getGoogleIdToken();

      if (!idToken) return;

      const deviceInfo = await getDeviceDescription();

      const data = await googleLogin(idToken, deviceInfo);
      const mappedUser = mapServerUserToClient(data.user);

      await saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      useUserStore.getState().setUser(mappedUser);
    } catch (err: any) {
      console.log('Google login error:', err);

      setTimeout(() => {
        Alert.alert('Ошибка', err.message || 'Не удалось войти через Google');
      }, 300);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async (newEmail: string) => {
    try {
      const freshUser = await changeEmail(newEmail);
      useUserStore.getState().setUser(freshUser);

      Alert.alert(
        'Email изменён',
        'Мы отправили письмо подтверждения на новый email.',
      );
    } catch (err: any) {
      Alert.alert('Ошибка', err.message || 'Не удалось изменить email');
    }
  };

  const handleSendVerificationEmail = async () => {
    setSendingVerification(true);

    try {
      const result = await sendVerificationEmail();

      if (result.alreadyVerified) {
        await refreshProfile();
        Alert.alert('Email уже подтверждён');
      } else {
        Alert.alert('Письмо отправлено', 'Проверьте вашу почту.');
      }
    } catch (err: any) {
      Alert.alert('Ошибка', err.message || 'Не удалось отправить письмо');
    } finally {
      setSendingVerification(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await clearAppCache();

      Alert.alert('Готово', 'Кэш приложения очищен.');
    } catch (err: any) {
      Alert.alert('Ошибка', err.message || 'Не удалось очистить кэш');
    }
  };
  if (!hydrated) {
    return (
      <View
        style={[styles.center, { backgroundColor: appTheme.colors.background }]}
      >
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
      </View>
    );
  }

  if (user) {
    return (
      <ProfileView
        user={user}
        appTheme={appTheme}
        sendingVerification={sendingVerification}
        onSendVerificationEmail={handleSendVerificationEmail}
        onGoHome={() => navigation.navigate('Home')}
        onOpenSecurity={() => navigation.navigate('Security')}
        onToggleTheme={toggleTheme}
        onLogout={logoutAuthOnly}
        onChangeEmail={handleChangeEmail}
        onClearCache={handleClearCache}
      />
    );
  }

  return (
    <AuthForm
      mode={mode}
      setMode={setMode}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      name={name}
      setName={setName}
      resetToken={resetToken}
      setResetToken={setResetToken}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      loading={loading}
      appTheme={appTheme}
      onSubmit={handleAuthSubmit}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
