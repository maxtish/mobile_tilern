This is a new [**React Native**](https://reactnative.dev) project, bootstrapped
using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

app/
┣ api/ # Запросы к backend API (axios/fetch)
┃ ┣ client.ts # axios instance
┃ ┗ userApi.ts # пример endpoint'а
┣ assets/ # иконки, изображения, шрифты
┣ components/ # UI-компоненты (Button, Card, Avatar, etc.)
┣ hooks/ # Кастомные React hooks
┣ navigation/ # Навигация (react-navigation router)
┃ ┣ RootNavigator.tsx
┃ ┗ types.ts
┣ screens/ # Экранные компоненты
┃ ┣ Home/
┃ ┃ ┗ HomeScreen.tsx
┃ ┣ Auth/
┃ ┃ ┣ LoginScreen.tsx
┃ ┃ ┗ RegisterScreen.tsx
┣ state/ # Zustand / Redux / Jotai store
┃ ┗ userStore.ts
┣ utils/ # Утилиты (helpers, formatters)
┣ theme/ # Цвета, шрифты, отступы
┣ types/ # Глобальные TypeScript типы
┣ App.tsx # Корень приложения (StatusBar, Router, Provider)
┗ index.tsx # Точка входа

# Getting Started

 npx react-native run-android