import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../theme/ThemeProvider';

import { getSessions, UserSession } from '../../api/auth/getSessions';

import { logoutDevice } from '../../api/auth/logoutDevice';
import { logoutAllDevices } from '../../api/auth/logoutAllDevices';
import { logoutAuthOnly } from '../../utils/logoutAndClear';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SecurityScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { appTheme } = useAppTheme();

  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  const loadSessions = async () => {
    try {
      setLoading(true);

      const data = await getSessions();

      setSessions(data);
    } catch (err: any) {
      Alert.alert('Ошибка', err.message || 'Не удалось загрузить устройства');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const formatDate = (value: string | null) => {
    if (!value) return 'Нет данных';

    return new Date(value).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDeviceTitle = (session: UserSession) => {
    if (session.device_info) {
      return session.device_info;
    }

    const source = session.user_agent || '';

    if (source.includes('Android')) return 'Android устройство';
    if (source.includes('iPhone')) return 'iPhone';
    if (source.includes('Windows')) return 'Windows';
    if (source.includes('Mac')) return 'Mac';
    if (source.includes('Chrome')) return 'Chrome';

    return 'Устройство';
  };

  const getDeviceIcon = (session: UserSession) => {
    const source = `${session.device_info || ''} ${session.user_agent || ''}`;

    if (source.includes('Android')) return 'phone-portrait-outline';
    if (source.includes('iPhone')) return 'phone-portrait-outline';
    if (source.includes('Windows')) return 'desktop-outline';
    if (source.includes('Mac')) return 'laptop-outline';
    if (source.includes('Chrome')) return 'globe-outline';

    return 'phone-portrait-outline';
  };

  const handleLogoutDevice = (sessionId: string) => {
    Alert.alert(
      'Удалить устройство?',
      'На этом устройстве потребуется войти заново.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoadingId(sessionId);

              await logoutDevice(sessionId);

              await loadSessions();
            } catch (err: any) {
              Alert.alert(
                'Ошибка',
                err.message || 'Не удалось удалить устройство',
              );
            } finally {
              setActionLoadingId(null);
            }
          },
        },
      ],
    );
  };

  const handleLogoutAllDevices = () => {
    Alert.alert(
      'Выйти со всех устройств?',
      'Текущая сессия тоже будет завершена.',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            try {
              setLogoutAllLoading(true);

              await logoutAllDevices();

              await logoutAuthOnly();

              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            } catch (err: any) {
              Alert.alert(
                'Ошибка',
                err.message || 'Не удалось выйти со всех устройств',
              );
            } finally {
              setLogoutAllLoading(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: appTheme.colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: appTheme.colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={appTheme.colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color: appTheme.colors.text,
            },
          ]}
        >
          Безопасность
        </Text>
      </View>

      <Text style={styles.subtitle}>
        Устройства, на которых выполнен вход в аккаунт.
      </Text>

      {sessions.map(session => (
        <View
          key={session.id}
          style={[
            styles.card,
            {
              backgroundColor: appTheme.colors.card,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Ionicons
              name={getDeviceIcon(session)}
              size={24}
              color={appTheme.colors.primary}
            />

            <View style={styles.deviceInfo}>
              <Text
                style={[
                  styles.deviceTitle,
                  {
                    color: appTheme.colors.text,
                  },
                ]}
              >
                {getDeviceTitle(session)}
              </Text>

              <Text style={styles.metaText}>
                IP: {session.ip_address || 'Неизвестно'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Создана</Text>

            <Text
              style={[
                styles.value,
                {
                  color: appTheme.colors.text,
                },
              ]}
            >
              {formatDate(session.created_at)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Последняя активность</Text>

            <Text
              style={[
                styles.value,
                {
                  color: appTheme.colors.text,
                },
              ]}
            >
              {formatDate(session.last_used_at || session.created_at)}
            </Text>
          </View>

          <Text numberOfLines={2} style={styles.userAgent}>
            {session.user_agent || 'User-Agent отсутствует'}
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleLogoutDevice(session.id)}
            disabled={actionLoadingId === session.id}
          >
            {actionLoadingId === session.id ? (
              <ActivityIndicator color="#dc3545" />
            ) : (
              <Text style={styles.deleteText}>Удалить устройство</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.refreshButton} onPress={loadSessions}>
        <Text style={styles.refreshText}>Обновить список</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutAllButton}
        onPress={handleLogoutAllDevices}
        disabled={logoutAllLoading}
      >
        {logoutAllLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.logoutAllText}>Выйти со всех устройств</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    color: '#888',
    marginBottom: 20,
  },

  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  deviceInfo: {
    marginLeft: 12,
    flex: 1,
  },

  deviceTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  metaText: {
    color: '#888',
    marginTop: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  label: {
    color: '#888',
  },

  value: {
    fontWeight: '600',
  },

  userAgent: {
    color: '#888',
    marginTop: 8,
    fontSize: 12,
  },

  deleteButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteText: {
    color: '#dc3545',
    fontWeight: '700',
  },

  refreshButton: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#888',
  },

  refreshText: {
    fontWeight: '700',
  },

  logoutAllButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutAllText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
