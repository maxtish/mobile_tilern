// app/theme/ThemeProvider.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import {
  navLightTheme,
  navDarkTheme,
  appLightTheme,
  appDarkTheme,
} from './theme';

// ────────────── Типы контекста ──────────────
type ThemeContextType = {
  navTheme: Theme; // для NavigationContainer
  appTheme: typeof appLightTheme; // кастомная тема приложения
  toggleTheme: () => void;
  isDark: boolean;
};

// Контекст с дефолтными значениями
const ThemeContext = createContext<ThemeContextType>({
  navTheme: navLightTheme,
  appTheme: appLightTheme,
  toggleTheme: () => {},
  isDark: false,
});

// Хук для использования темы в компонентах
export const useAppTheme = () => useContext(ThemeContext);

type Props = { children: ReactNode };

// ────────────── ThemeProvider ──────────────
export const ThemeProvider: React.FC<Props> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Навигационная тема для NavigationContainer
  const navTheme: Theme = isDark ? navDarkTheme : navLightTheme;

  // Кастомная тема для всего приложения
  const appTheme = isDark ? appDarkTheme : appLightTheme;

  return (
    <ThemeContext.Provider value={{ navTheme, appTheme, toggleTheme, isDark }}>
      <NavigationContainer theme={navTheme}>{children}</NavigationContainer>
    </ThemeContext.Provider>
  );
};
