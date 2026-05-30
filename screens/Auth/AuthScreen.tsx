import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  AppState,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../state/userStore';
import { login } from '../../api/auth/login';
import { register } from '../../api/auth/register';
import { refreshToken } from '../../api/auth/refresh';
import { forgotPassword } from '../../api/auth/forgotPassword';
import { resetPassword } from '../../api/auth/resetPassword';
import { sendVerificationEmail } from '../../api/auth/sendVerificationEmail';
import { getMe } from '../../api/auth/me';
import { useAppTheme } from '../../theme/ThemeProvider';
import { mapServerUserToClient, User, UserState } from '../../types/userTypes';
import { saveTokens } from '../../utils/tokenStorage';
import { logoutAuthOnly } from '../../utils/logoutAndClear';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;
type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { appTheme, toggleTheme } = useAppTheme();

  const [mode, setMode] = useState<AuthMode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');

  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const user = useUserStore(state => state.user);

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
      if (!email || !password || (mode === 'register' && !name)) {
        Alert.alert('Ошибка', 'Заполните все поля');
        return;
      }

      setLoading(true);

      try {
        const data =
          mode === 'login'
            ? await login(email, password)
            : await register(email, password, name);

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

  const handleSendVerificationEmail = async () => {
    setSendingVerification(true);

    try {
      const result = await sendVerificationEmail();

      if (result.alreadyVerified) {
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
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: appTheme.colors.background },
        ]}
      >
        <View style={styles.profileHeader}>
          <View
            style={[
              styles.largeAvatar,
              { backgroundColor: appTheme.colors.card },
            ]}
          >
            <Text style={[styles.avatarText, { color: appTheme.colors.text }]}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>

          <Text style={[styles.userName, { color: appTheme.colors.text }]}>
            {user.name}
          </Text>

          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {!user.emailVerified && (
          <View
            style={[
              styles.warningCard,
              { backgroundColor: appTheme.colors.card },
            ]}
          >
            <Text
              style={[styles.warningTitle, { color: appTheme.colors.text }]}
            >
              Email не подтверждён
            </Text>

            <Text style={styles.warningText}>
              Подтвердите email, чтобы восстановление доступа и безопасность
              аккаунта работали корректно.
            </Text>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: appTheme.colors.primary },
              ]}
              onPress={handleSendVerificationEmail}
              disabled={sendingVerification}
            >
              {sendingVerification ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Отправить письмо</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View
          style={[styles.infoCard, { backgroundColor: appTheme.colors.card }]}
        >
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={[styles.infoValue, { color: appTheme.colors.text }]}>
              {user.role}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: appTheme.colors.border },
            ]}
          />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email verified</Text>
            <Text style={[styles.infoValue, { color: appTheme.colors.text }]}>
              {user.emailVerified ? 'Да' : 'Нет'}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: appTheme.colors.border },
            ]}
          />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text
              style={[
                styles.infoValue,
                { color: appTheme.colors.text, fontSize: 12 },
              ]}
            >
              {user.id}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.mainButton, { backgroundColor: '#28a745' }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons
              name="home-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>На главную</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mainButton,
              { backgroundColor: appTheme.colors.primary },
            ]}
            onPress={toggleTheme}
          >
            <Ionicons
              name="moon-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Сменить тему</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mainButton,
              {
                backgroundColor: appTheme.colors.background,
                marginTop: 20,
              },
            ]}
            onPress={logoutAuthOnly}
          >
            <Text style={[styles.buttonText, { color: appTheme.colors.text }]}>
              Выйти из аккаунта
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: appTheme.colors.background },
      ]}
      contentContainerStyle={styles.authContent}
    >
      <View style={styles.authCard}>
        <Text style={[styles.authTitle, { color: appTheme.colors.text }]}>
          {mode === 'login' && 'Вход'}
          {mode === 'register' && 'Создать аккаунт'}
          {mode === 'forgot' && 'Восстановление пароля'}
          {mode === 'reset' && 'Новый пароль'}
        </Text>

        <Text style={styles.authSubTitle}>
          {mode === 'login' && 'Войдите в свой профиль TiLern'}
          {mode === 'register' && 'Присоединяйтесь к TiLern'}
          {mode === 'forgot' && 'Введите email, и мы отправим инструкцию'}
          {mode === 'reset' && 'Введите token из письма и новый пароль'}
        </Text>

        {mode === 'register' && (
          <TextInput
            placeholder="Ваше имя"
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
            style={[
              styles.input,
              {
                color: appTheme.colors.text,
                backgroundColor: appTheme.colors.card,
                borderColor: appTheme.colors.border,
              },
            ]}
          />
        )}

        {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
            style={[
              styles.input,
              {
                color: appTheme.colors.text,
                backgroundColor: appTheme.colors.card,
                borderColor: appTheme.colors.border,
              },
            ]}
          />
        )}

        {(mode === 'login' || mode === 'register') && (
          <TextInput
            placeholder="Пароль"
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
            style={[
              styles.input,
              {
                color: appTheme.colors.text,
                backgroundColor: appTheme.colors.card,
                borderColor: appTheme.colors.border,
              },
            ]}
          />
        )}

        {mode === 'reset' && (
          <>
            <TextInput
              placeholder="Token из письма"
              autoCapitalize="none"
              value={resetToken}
              onChangeText={setResetToken}
              placeholderTextColor="#888"
              style={[
                styles.input,
                {
                  color: appTheme.colors.text,
                  backgroundColor: appTheme.colors.card,
                  borderColor: appTheme.colors.border,
                },
              ]}
            />

            <TextInput
              placeholder="Новый пароль"
              autoCapitalize="none"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholderTextColor="#888"
              style={[
                styles.input,
                {
                  color: appTheme.colors.text,
                  backgroundColor: appTheme.colors.card,
                  borderColor: appTheme.colors.border,
                },
              ]}
            />
          </>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: appTheme.colors.primary },
          ]}
          onPress={handleAuthSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'login' && 'Войти'}
              {mode === 'register' && 'Зарегистрироваться'}
              {mode === 'forgot' && 'Отправить письмо'}
              {mode === 'reset' && 'Изменить пароль'}
            </Text>
          )}
        </TouchableOpacity>

        {mode === 'login' && (
          <>
            <TouchableOpacity
              onPress={() => setMode('register')}
              style={styles.switchBtn}
            >
              <Text
                style={[styles.switchText, { color: appTheme.colors.primary }]}
              >
                Нет аккаунта? Регистрация
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('forgot')}
              style={styles.switchBtnSmall}
            >
              <Text
                style={[styles.switchText, { color: appTheme.colors.primary }]}
              >
                Забыли пароль?
              </Text>
            </TouchableOpacity>
          </>
        )}

        {mode !== 'login' && (
          <TouchableOpacity
            onPress={() => setMode('login')}
            style={styles.switchBtn}
          >
            <Text
              style={[styles.switchText, { color: appTheme.colors.primary }]}
            >
              Вернуться ко входу
            </Text>
          </TouchableOpacity>
        )}

        {mode === 'forgot' && (
          <TouchableOpacity
            onPress={() => setMode('reset')}
            style={styles.switchBtnSmall}
          >
            <Text
              style={[styles.switchText, { color: appTheme.colors.primary }]}
            >
              У меня уже есть token
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  authContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  authCard: { padding: 20, borderRadius: 24 },
  authTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  authSubTitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileHeader: { alignItems: 'center', marginTop: 50, marginBottom: 30 },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  avatarText: { fontSize: 40, fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  userEmail: { fontSize: 16, color: '#888' },
  warningCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  warningText: {
    color: '#888',
    marginBottom: 14,
    lineHeight: 20,
  },
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: { color: '#888', fontSize: 14 },
  infoValue: { fontWeight: '600', fontSize: 16 },
  divider: { height: 1, width: '100%', opacity: 0.1 },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  mainButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { marginTop: 20, padding: 10 },
  switchBtnSmall: { marginTop: 4, padding: 8 },
  switchText: { textAlign: 'center', fontWeight: '600' },
  actions: { marginBottom: 40 },
});
