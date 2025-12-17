import React from 'react';
import { StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { AppTheme } from '../types/themeTypes';

export const createToastConfig = (theme: AppTheme) => {
  return {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={[styles.base, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        text1Style={[styles.text1, { color: theme.colors.text }]}
        text2Style={[styles.text2, { color: theme.colors.textHistory }]}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={[styles.base, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        text1Style={[styles.text1, { color: theme.colors.text }]}
        text2Style={[styles.text2, { color: theme.colors.textHistory }]}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={[
          styles.base,
          styles.error,
          { backgroundColor: theme.colors.notification },
        ]}
        text1Style={[styles.text1, { color: '#fff' }]}
        text2Style={[styles.text2, { color: '#eee' }]}
      />
    ),
  };
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderLeftWidth: 0,
    minHeight: 56,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  content: { paddingHorizontal: 16 },
  text1: { fontSize: 15, fontWeight: '600' },
  text2: { fontSize: 13 },
  info: {},
  error: {},
});
