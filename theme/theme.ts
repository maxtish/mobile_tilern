// app/theme/theme.ts

import { Theme } from '@react-navigation/native';

// ────────────── NavigationContainer Themes ──────────────
export const navLightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#4B7BE5',
    background: '#F9FAFB',
    card: '#8ea6f5ff',
    text: '#1E1E1E',
    border: '#E5E7EB',
    notification: '#FF3B30',
  },
  fonts: {
    regular: { fontFamily: 'Roboto-Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Roboto-Medium', fontWeight: '500' as const },
    bold: { fontFamily: 'Roboto-Bold', fontWeight: '700' as const },
    heavy: { fontFamily: 'Roboto-Black', fontWeight: '900' as const },
  },
};

export const navDarkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#FF453A',
    background: '#FF453A',
    card: '#FF453A',
    text: '#FF453A',
    border: '#FF453A',
    notification: '#FF453A',
  },
  fonts: {
    regular: { fontFamily: 'Roboto-Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Roboto-Medium', fontWeight: '500' as const },
    bold: { fontFamily: 'Roboto-Bold', fontWeight: '700' as const },
    heavy: { fontFamily: 'Roboto-Black', fontWeight: '900' as const },
  },
};

// ────────────── Кастомная тема приложения ──────────────
export const appLightTheme = {
  dark: false,
  colors: {
    primary: '#4B7BE5',
    background: '#ddddddff',
    card: '#8ea6f5ff',
    text: '#1E1E1E',
    border: '#E5E7EB',
    notification: '#FF3B30',
    textHistory: '#424242ff',
    wordHistoryBackground: '#535353ff',
  },
  fonts: {
    regular: { fontFamily: 'Roboto-Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Roboto-Medium', fontWeight: '500' as const },
    bold: { fontFamily: 'Roboto-Bold', fontWeight: '700' as const },
    heavy: { fontFamily: 'Roboto-Black', fontWeight: '900' as const },
  },
};

export const appDarkTheme = {
  dark: true,
  colors: {
    primary: '#6C8EFF',
    background: '#333333ff',
    card: '#8ea6f5ff',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#FF453A',
    textHistory: '#CFCFCF',
    wordHistoryBackground: '#524c4cff',
  },
  fonts: {
    regular: { fontFamily: 'Roboto-Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Roboto-Medium', fontWeight: '500' as const },
    bold: { fontFamily: 'Roboto-Bold', fontWeight: '700' as const },
    heavy: { fontFamily: 'Roboto-Black', fontWeight: '900' as const },
  },
};
