import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TextInput, Alert } from 'react-native';
import { User } from '../../../types/userTypes';

type Props = {
  user: User;
  appTheme: any;
  sendingVerification: boolean;

  onSendVerificationEmail: () => void;
  onGoHome: () => void;
  onOpenSecurity: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onChangeEmail: (email: string) => Promise<void>;
  onClearCache: () => void;
};

export default function ProfileView({
  user,
  appTheme,
  sendingVerification,
  onSendVerificationEmail,
  onGoHome,
  onOpenSecurity,
  onToggleTheme,
  onLogout,
  onChangeEmail,
  onClearCache,
}: Props) {
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user.email);
  const [changingEmail, setChangingEmail] = useState(false);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: appTheme.colors.background },
      ]}
    >
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.largeAvatar,
            { backgroundColor: appTheme.colors.card },
          ]}
        >
          <Text style={[styles.avatarText, { color: appTheme.colors.text }]}>
            {user.name?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={[styles.userName, { color: appTheme.colors.text }]}>
          {user.name || 'Пользователь'}
        </Text>

        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {!user.emailVerified && (
        <View
          style={[
            styles.warningCard,
            { backgroundColor: appTheme.colors.card },
          ]}
        >
          <Text style={[styles.warningTitle, { color: appTheme.colors.text }]}>
            Email не подтверждён
          </Text>

          <Text style={styles.warningText}>
            Подтвердите email, чтобы восстановление доступа и безопасность
            аккаунта работали корректно.
          </Text>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: appTheme.colors.primary },
            ]}
            onPress={onSendVerificationEmail}
            disabled={sendingVerification}
          >
            {sendingVerification ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Отправить письмо</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[styles.infoCard, { backgroundColor: appTheme.colors.card }]}
      >
        <InfoRow label="Role" value={user.role} appTheme={appTheme} />

        <Divider appTheme={appTheme} />

        <InfoRow
          label="Email verified"
          value={user.emailVerified ? 'Да' : 'Нет'}
          appTheme={appTheme}
        />

        <Divider appTheme={appTheme} />

        <InfoRow label="ID" value={user.id} appTheme={appTheme} small />
      </View>
      <View
        style={[styles.infoCard, { backgroundColor: appTheme.colors.card }]}
      >
        <Text style={[styles.warningTitle, { color: appTheme.colors.text }]}>
          Email
        </Text>

        {editingEmail ? (
          <>
            <TextInput
              placeholder="Новый email"
              value={newEmail}
              onChangeText={setNewEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
              style={[
                styles.input,
                {
                  color: appTheme.colors.text,
                  backgroundColor: appTheme.colors.background,
                  borderColor: appTheme.colors.border,
                },
              ]}
            />

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: appTheme.colors.primary },
              ]}
              disabled={changingEmail}
              onPress={async () => {
                if (!newEmail.trim()) {
                  Alert.alert('Ошибка', 'Введите email');
                  return;
                }

                try {
                  setChangingEmail(true);
                  await onChangeEmail(newEmail.trim());
                  setEditingEmail(false);
                } finally {
                  setChangingEmail(false);
                }
              }}
            >
              {changingEmail ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Сохранить email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setNewEmail(user.email);
                setEditingEmail(false);
              }}
            >
              <Text style={styles.cancelText}>Отмена</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[
              styles.mainButton,
              { backgroundColor: appTheme.colors.primary, marginHorizontal: 0 },
            ]}
            onPress={() => setEditingEmail(true)}
          >
            <Text style={styles.buttonText}>Изменить email</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actions}>
        <ActionButton
          title="На главную"
          icon="home-outline"
          backgroundColor="#28a745"
          onPress={onGoHome}
        />

        <ActionButton
          title="Безопасность"
          icon="shield-checkmark-outline"
          backgroundColor={appTheme.colors.primary}
          onPress={onOpenSecurity}
        />

        <ActionButton
          title="Сменить тему"
          icon="moon-outline"
          backgroundColor={appTheme.colors.primary}
          onPress={onToggleTheme}
        />
        <ActionButton
          title="Очистить кэш"
          icon="trash-bin-outline"
          backgroundColor="#6c757d"
          onPress={onClearCache}
        />

        <TouchableOpacity
          style={[
            styles.mainButton,
            {
              backgroundColor: appTheme.colors.background,
              marginTop: 20,
            },
          ]}
          onPress={onLogout}
        >
          <Text style={[styles.buttonText, { color: appTheme.colors.text }]}>
            Выйти из аккаунта
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
  appTheme,
  small,
}: {
  label: string;
  value: string;
  appTheme: any;
  small?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          {
            color: appTheme.colors.text,
            fontSize: small ? 12 : 16,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function Divider({ appTheme }: { appTheme: any }) {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: appTheme.colors.border,
        },
      ]}
    />
  );
}

function ActionButton({
  title,
  icon,
  backgroundColor,
  onPress,
}: {
  title: string;
  icon: string;
  backgroundColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.mainButton, { backgroundColor }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 8 }} />

      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  profileHeader: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },

  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },

  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },

  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  userEmail: {
    fontSize: 16,
    color: '#888',
  },

  warningCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  warningTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },

  warningText: {
    color: '#888',
    marginBottom: 14,
    lineHeight: 20,
  },

  infoCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  infoLabel: {
    color: '#888',
    fontSize: 14,
  },

  infoValue: {
    fontWeight: '600',
  },

  divider: {
    height: 1,
    width: '100%',
    opacity: 0.1,
  },

  actions: {
    marginBottom: 40,
  },

  mainButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
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
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  cancelButton: {
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    color: '#888',
    fontWeight: '700',
  },
});
