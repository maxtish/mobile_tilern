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
  navTheme: Theme; // строго для NavigationContainer
  appTheme: typeof appLightTheme; // кастомные поля приложения
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
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Навигационная тема — только поля, которые принимает NavigationContainer
  const navTheme: Theme = isDark ? navDarkTheme : navLightTheme;

  // Кастомная тема приложения (шрифты, spacing, цвета UI, тени)
  const appTheme = isDark ? appDarkTheme : appLightTheme;

  return (
    <ThemeContext.Provider value={{ navTheme, appTheme, toggleTheme, isDark }}>
      <NavigationContainer theme={navTheme}>{children}</NavigationContainer>
    </ThemeContext.Provider>
  );
};
