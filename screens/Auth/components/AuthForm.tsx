import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { AuthMode } from '../types';
import GoogleSignInButton from './GoogleSignInButton';

type Props = {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;

  email: string;
  setEmail: (value: string) => void;

  password: string;
  setPassword: (value: string) => void;

  name: string;
  setName: (value: string) => void;

  resetToken: string;
  setResetToken: (value: string) => void;

  newPassword: string;
  setNewPassword: (value: string) => void;

  loading: boolean;
  appTheme: any;

  onSubmit: () => void;
  onGoogleLogin: () => void;
};

export default function AuthForm({
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  resetToken,
  setResetToken,
  newPassword,
  setNewPassword,
  loading,
  appTheme,
  onSubmit,
  onGoogleLogin,
}: Props) {
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
          onPress={onSubmit}
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

        {(mode === 'login' || mode === 'register') && (
          <>
            <Text style={styles.orText}>или</Text>

            <GoogleSignInButton
              appTheme={appTheme}
              loading={loading}
              onPress={onGoogleLogin}
            />
          </>
        )}

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

  authContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  authCard: {
    padding: 20,
    borderRadius: 24,
  },

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

  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },

  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  orText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
    marginBottom: 4,
  },

  switchBtn: {
    marginTop: 20,
    padding: 10,
  },

  switchBtnSmall: {
    marginTop: 4,
    padding: 8,
  },

  switchText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
