import React, { ReactNode, useEffect } from 'react';
import RootNavigator from './navigation/RootNavigator';
import { ThemeProvider } from './theme/ThemeProvider';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { useAppTheme } from './theme/ThemeProvider';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaWrapper>
          <RootNavigator />
        </SafeAreaWrapper>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

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
