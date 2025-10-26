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
    primary: '#6C8EFF',
    background: '#424242ff',
    card: '#8ea6f5ff',
    text: '#FFFFFF',
    border: '#333333',
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
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    semibold: { fontFamily: 'System', fontWeight: '600' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
  spacing: { s: 8, m: 16, l: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 16, xl: 24 },
  shadow: {
    light: {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    heavy: {
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
  },
  colors: {
    textSecondary: '#6B7280',
    backgroundSecondary: '#F3F4F6',
    buttonBackground: '#4B7BE5',
    buttonText: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.2)',
  },
};

export const appDarkTheme = {
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    semibold: { fontFamily: 'System', fontWeight: '600' as const },
    bold: { fontFamily: 'System', fontWeight: '700' as const },
    heavy: { fontFamily: 'System', fontWeight: '900' as const },
  },
  spacing: { s: 8, m: 16, l: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 16, xl: 24 },
  shadow: {
    light: {
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    heavy: {
      shadowColor: '#000',
      shadowOpacity: 0.7,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
  },
  colors: {
    textSecondary: '#9CA3AF',
    backgroundSecondary: '#1F1F1F',
    buttonBackground: '#6C8EFF',
    buttonText: '#FFFFFF',
    overlay: 'rgba(0,0,0,0.3)',
  },
};
