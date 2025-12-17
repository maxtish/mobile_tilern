import React, { ReactNode, useEffect } from 'react';
import RootNavigator from './navigation/RootNavigator';
import { ThemeProvider, useAppTheme } from './theme/ThemeProvider';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { createToastConfig } from './components/toastConfig';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// AppContent чтобы можно было использовать useAppTheme
const AppContent: React.FC = () => {
  const { isDark, appTheme } = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <SafeAreaWrapper>
        <RootNavigator />
      </SafeAreaWrapper>
      <Toast config={createToastConfig(appTheme)} />
    </SafeAreaProvider>
  );
};

const SafeAreaWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { appTheme } = useAppTheme();
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: appTheme.colors.background }]}
    >
      <View style={styles.appPadding}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  appPadding: {
    flex: 1, // чтобы занимать всю высоту SafeAreaView
    paddingHorizontal: 16,
  },
});
