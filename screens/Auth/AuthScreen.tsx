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
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import { useUserStore } from '../../state/userStore';
import { login } from '../../api/auth/login';
import { register } from '../../api/auth/register';
import { refreshToken } from '../../api/auth/refresh';
import { useAppTheme } from '../../theme/ThemeProvider';
import { mapServerUserToClient } from '../../types/userTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;
const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { appTheme, toggleTheme, isDark } = useAppTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const user = useUserStore(state => state.user);
  const logout = useUserStore(state => state.logout);

  // Проверка сессии при открытии профиля
  useEffect(() => {
    const checkSession = async () => {
      if (user) {
        try {
          // Пробуем обновить токен в фоне, чтобы проверить, жива ли сессия
          await refreshToken();
        } catch (e) {
          console.log('Session expired on mount');
        }
      }
      setHydrated(true);
    };
    checkSession();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const data = isLogin
        ? await login(email, password)
        : await register(email, password, name);

      const mappedUser = mapServerUserToClient(data.user);

      useUserStore
        .getState()
        .setUser(mappedUser, data.accessToken, data.refreshToken);
    } catch (err: any) {
      Alert.alert('Ошибка', err.message || 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
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

  // ===== ЭКРАН ПРОФИЛЯ =====
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
              { backgroundColor: appTheme.colors.background, marginTop: 20 },
            ]}
            onPress={logout}
          >
            <Text style={[styles.buttonText, { color: appTheme.colors.text }]}>
              Выйти из аккаунта
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ===== ЭКРАН ВХОДА / РЕГИСТРАЦИИ =====
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
          {isLogin ? 'Вход' : 'Создать аккаунт'}
        </Text>
        <Text style={styles.authSubTitle}>
          {isLogin
            ? 'Войдите в свой профиль TiLern'
            : 'Присоединяйтесь к сообществу TiLern'}
        </Text>

        {!isLogin && (
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

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: appTheme.colors.primary },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchBtn}
        >
          <Text style={[styles.switchText, { color: appTheme.colors.primary }]}>
            {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
          </Text>
        </TouchableOpacity>
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
  switchText: { textAlign: 'center', fontWeight: '600' },
  actions: { marginBottom: 40 },
});
