import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import { useUserStore } from '../../state/userStore';
import { login } from '../../api/auth/login';
import { useAppTheme } from '../../theme/ThemeProvider';
import { register } from '../../api/auth/register';
import { mapServerUserToClient } from '../../types/userTypes';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { navTheme, appTheme, toggleTheme } = useAppTheme();
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const logout = useUserStore(state => state.logout);

  const [hydrated, setHydrated] = useState(false);

  // Проверка загрузки состояния из AsyncStorage
  useEffect(() => {
    const unsubscribe = useUserStore.persist.onHydrate(() => {
      setHydrated(true);
    });
    // На случай, если store уже загружен
    setHydrated(true);
    return () => unsubscribe?.();
  }, []);

  const handleSubmit = async () => {
    try {
      const data = isLogin
        ? await login(email, password)
        : await register(email, password, name);

      // мапим серверного юзера в клиентского
      const user = mapServerUserToClient(data.user);

      // Сохраняем user + accessToken + refreshToken
      useUserStore.getState().setUser(
        user,
        data.accessToken, // <-- accessToken
        data.refreshToken, // <-- refreshToken
      );
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  if (!hydrated) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Если пользователь уже авторизован — показываем его инфо
  if (user) {
    return (
      <View style={styles.container}>
        {/* Верхняя панель */}
        <View style={styles.header}>
          {user?.role === 'ADMIN' || user?.role === 'USER' ? (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#28a745' }]}
                onPress={() => navigation.navigate('AddStory')}
              >
                <Text style={styles.buttonText}>Добавить историю</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text
              style={[
                styles.title,
                {
                  color: navTheme.colors.text,
                  fontFamily: navTheme.fonts.heavy.fontFamily,
                },
              ]}
            >
              TiLern – Lies, lerne, sprich.
            </Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.avatar, { backgroundColor: navTheme.colors.card }]}
            >
              <Text style={{ color: navTheme.colors.text }}>A</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleTheme}
              style={[
                styles.themeButton,
                { backgroundColor: navTheme.colors.primary },
              ]}
            >
              <Text style={{ color: navTheme.colors.text }}>🌓</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#28a745' }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>На главную</Text>
        </TouchableOpacity>

        <Text style={[styles.infoText, { color: navTheme.colors.text }]}>
          Name: {user.name}
        </Text>
        <Text style={[styles.infoText, { color: navTheme.colors.text }]}>
          User: {user.email}
        </Text>
        <Text style={[styles.infoText, { color: navTheme.colors.text }]}>
          ID: {user.id}
        </Text>
        <Text style={[styles.infoText, { color: navTheme.colors.text }]}>
          Role: {user.role}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#dc3545' }]}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Форма login/register
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: navTheme.colors.text }]}>
        {isLogin ? 'Login' : 'Register'}
      </Text>

      {!isLogin && (
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={navTheme.colors.text}
          style={[styles.input, { color: navTheme.colors.text }]}
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={navTheme.colors.text}
        style={[styles.input, { color: navTheme.colors.text }]}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
        placeholderTextColor={navTheme.colors.text}
        style={[styles.input, { color: navTheme.colors.text }]}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? 'No account? Register' : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchText: { color: '#007bff', textAlign: 'center', marginTop: 8 },
  infoText: { fontSize: 18, marginBottom: 8, textAlign: 'center' },
  themeButton: {
    marginLeft: 12,
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
