import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  appTheme: any;
  loading: boolean;
  onPress: () => void;
};

export default function GoogleSignInButton({
  appTheme,
  loading,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.googleButton,
        {
          backgroundColor: appTheme.colors.card,
          borderColor: appTheme.colors.border,
        },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      <Ionicons
        name="logo-google"
        size={20}
        color={appTheme.colors.text}
        style={{ marginRight: 8 }}
      />

      <Text style={[styles.googleButtonText, { color: appTheme.colors.text }]}>
        Войти через Google
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },

  googleButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
