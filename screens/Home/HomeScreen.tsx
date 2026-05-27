import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import { useAppTheme } from '../../theme/ThemeProvider';
import { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../state/userStore';
import { History } from '../../types/storiesTypes';
import { logoutAuthOnly } from '../../utils/logoutAndClear';
import { handleLikeOutside } from '../../utils/handleLike';
import { StoryCard } from '../../components/StoryCard';

import { getStoriesRepository } from '../../utils/cache/repository';
import { cacheStoryAssets } from '../../utils/cache/getMediaRepository';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { appTheme, toggleTheme } = useAppTheme();
  const user = useUserStore(state => state.user);
  const sessionStatus = useUserStore(state => state.sessionStatus);
  const [isOnline, setIsOnline] = useState(true);
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set());

  const [page, setPage] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable));
    });

    return () => unsubscribe();
  }, []);

  // ===== Загрузка историй =====
  const fetchHistories = async (pageNum = 1) => {
    // Если мы в офлайне и это не первая страница — выходим
    if (!isOnline && pageNum > 1) return;
    if (isMoreLoading) return;

    try {
      pageNum === 1 ? setLoading(true) : setIsMoreLoading(true);
      setError(''); // Сбрасываем старые ошибки

      // Вызов репозитория. Если сервер "лежит" (таймаут 7с),
      // apiFetch внутри выкинет ошибку, и мы упадем в catch
      const data = await getStoriesRepository(user, pageNum, 10, isOnline);

      if (data.length < 10) setHasMore(false);

      setHistories(prev => (pageNum === 1 ? data : [...prev, ...data]));
      setPage(pageNum);

      // Кэшируем медиа в фоне, только если есть реальный интернет
      if (isOnline) {
        data.forEach(story => {
          cacheStoryAssets(story).catch(() => {});
        });
      }
    } catch (err: any) {
      if (err.message === 'SESSION_EXPIRED') {
        setError('Сессия истекла. Войдите снова.');
        setHasMore(false);
        return;
      }
      if (
        err.message === 'OFFLINE_MODE' ||
        err.message === 'REQUEST_TIMEOUT' ||
        err.message === 'SERVER_ERROR'
      ) {
        if (pageNum === 1 && histories.length === 0) {
          setError('Сервер недоступен. Показаны сохранённые данные.');
        }

        setHasMore(false);
        return;
      }

      setError('Не удалось загрузить истории.');
      setHasMore(false);
    } finally {
      setLoading(false);
      setIsMoreLoading(false);
    }
  };

  // При фокусе экрана
  useFocusEffect(
    useCallback(() => {
      fetchHistories(1);
    }, [user, isOnline]),
  );

  // ===== Пагинация =====
  const loadMore = () => {
    if (!isMoreLoading && hasMore && isOnline) {
      fetchHistories(page + 1);
    }
  };

  // ===== Лайк =====
  const handleLike = async (story: History) => {
    handleLikeOutside({
      story,
      user,
      pendingLikes,
      setPendingLikes,
      setHistories,
    });
  };

  // ===== Рендер карточки =====
  const renderStoryItem = useCallback(
    ({ item }: { item: History }) => (
      <StoryCard
        story={item}
        user={user}
        isLikePending={pendingLikes.has(item.id)}
        onPress={async story => {
          navigation.navigate('StoryScreen', { storyId: String(story.id) });
        }}
        onLike={handleLike}
      />
    ),
    [user, pendingLikes],
  );

  // ===== Лоадер при первом запуске =====
  if (loading && histories.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={{ flex: 1, marginTop: 15 }}>
      {/* ===== Header ===== */}
      <View style={styles.header}>
        {user ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#28a745' }]}
            onPress={() => navigation.navigate('AddStory')}
          >
            <Text style={styles.buttonText}>Добавить историю</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.title, { color: appTheme.colors.text }]}>
            TiLern
          </Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {user ? (
            <TouchableOpacity
              style={[styles.avatar, { backgroundColor: appTheme.colors.card }]}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={{ color: appTheme.colors.text }}>
                {user.name?.[0]?.toUpperCase() || 'U'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: appTheme.colors.primary },
              ]}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.loginButtonText}>Войти</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              { backgroundColor: appTheme.colors.primary },
            ]}
          >
            <Text style={{ color: appTheme.colors.text }}>🌓</Text>
          </TouchableOpacity>
        </View>
      </View>
      {error ? (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#ff9800', fontSize: 12 }}>{error}</Text>
        </View>
      ) : null}

      {sessionStatus === 'needs_refresh' && (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#ff9800', fontSize: 12 }}>
            ⚠️ Сессия требует проверки. Данные показаны из кэша.
          </Text>
        </View>
      )}
      {/* ===== List ===== */}
      <FlatList
        data={histories}
        renderItem={renderStoryItem}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={7}
        initialNumToRender={5}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{
          paddingVertical: 20,
          alignItems: 'center',
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={() => fetchHistories(1)}
        refreshing={loading}
        ListFooterComponent={
          isMoreLoading ? (
            <ActivityIndicator size="small" style={{ margin: 20 }} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text
                style={{ color: appTheme.colors.text, textAlign: 'center' }}
              >
                {isOnline
                  ? 'Историй пока нет или сервер недоступен.'
                  : 'Нет сохраненных историй для чтения офлайн.'}
              </Text>
            </View>
          ) : null
        }
      />

      {/* ===== Word training ===== */}
      {user && (
        <TouchableOpacity
          style={styles.showButton}
          onPress={() =>
            navigation.navigate('WordTraining', {
              userId: user.id,
            })
          }
        >
          <Text style={styles.showButtonText}>📚 Тренировка слов</Text>
        </TouchableOpacity>
      )}
      {!isOnline && (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: '#ff9800', fontSize: 12 }}>
            📡 Нет интернета — показан офлайн-кэш
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButton: {
    marginLeft: 12,
    padding: 10,
    borderRadius: 12,
  },
  button: {
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  showButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#424242',
    alignSelf: 'center',
    marginBottom: 20,
  },
  showButtonText: {
    color: '#bbbbbb',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
