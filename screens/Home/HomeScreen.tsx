import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../state/userStore';
import { getHistories } from '../../api/getHistories';
import { History } from '../../types/storiesTypes';
import { SERVER_URL } from '../../constants/constants';
import { likeHistory, unlikeHistory } from '../../api/likeHistory'; // 🆕 добавлено
import { User, UserState } from '../../types/userTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { navTheme, appTheme, toggleTheme } = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore(state => state.user);
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchHistories();
    }, [user]),
  );

  const fetchHistories = async () => {
    try {
      const data = await getHistories(user);
      setHistories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /////////////////// logoutAndClear
  const logoutAndClear = async () => {
    const { logout } = useUserStore.getState(); // вызываем logout для очистки стейта
    logout();

    try {
      await AsyncStorage.removeItem('user-storage'); // очищаем persist вручную
    } catch (e) {
      console.warn('Failed to clear AsyncStorage', e);
    }

    setHistories([]); // очищаем локальные истории
  };

  /////////////// Новая функция для обработки лайков
  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set());

  const handleLike = async (story: History) => {
    if (!user) return;

    const storyId = story.id;
    // если уже выполняется запрос по этой истории — игнорируем новый клик
    if (pendingLikes.has(storyId)) return;

    const alreadyLiked = !!story.likedByCurrentUser;

    // оптимистичный локальный апдейт: сразу изменяем UI
    setHistories(prev =>
      prev.map(s =>
        s.id === storyId
          ? {
              ...s,
              likedByCurrentUser: !alreadyLiked,
              likesCount: Math.max(0, s.likesCount + (alreadyLiked ? -1 : 1)),
            }
          : s,
      ),
    );

    // помечаем как pending
    setPendingLikes(prev => new Set(prev).add(storyId));

    try {
      if (alreadyLiked) {
        const res = await unlikeHistory(storyId, user.id);
        // если сервер возвращает актуальный likesCount, применить его
        if (res?.likesCount !== undefined) {
          setHistories(prev =>
            prev.map(s =>
              s.id === storyId
                ? {
                    ...s,
                    likesCount: res.likesCount,
                    likedByCurrentUser: false,
                  }
                : s,
            ),
          );
        }
      } else {
        const res = await likeHistory(storyId, user.id);
        if (res?.likesCount !== undefined) {
          setHistories(prev =>
            prev.map(s =>
              s.id === storyId
                ? { ...s, likesCount: res.likesCount, likedByCurrentUser: true }
                : s,
            ),
          );
        }
      }
    } catch (e) {
      console.error('Ошибка лайка:', e);
      // Откат: возвращаем предыдущее состояние (инвертируем обратно)
      setHistories(prev =>
        prev.map(s =>
          s.id === storyId
            ? {
                ...s,
                likedByCurrentUser: alreadyLiked,
                likesCount: Math.max(0, s.likesCount + (alreadyLiked ? 1 : -1)),
              }
            : s,
        ),
      );
      // можно показать уведомление пользователю
      // showToast('Не удалось обновить лайк. Попробуйте ещё раз.');
    } finally {
      // снимаем pending
      setPendingLikes(prev => {
        const copy = new Set(prev);
        copy.delete(storyId);
        return copy;
      });
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: navTheme.colors.background }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 60 }}
    >
      {/* Верхняя панель */}
      <View style={styles.header}>
        {user?.role === 'ADMIN' || user?.role === 'USER' ? (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              onPress={() => navigation.navigate('AddStory')}
            >
              <Text style={styles.buttonText}>Добавить историю</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text
            style={[
              styles.title,
              {
                color: navTheme.colors.text,
                fontFamily: navTheme.fonts.heavy.fontFamily,
              },
            ]}
          >
            Добро пожаловать!
          </Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: navTheme.colors.card }]}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={{ color: navTheme.colors.text }}>A</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              { backgroundColor: navTheme.colors.primary },
            ]}
          >
            <Text style={{ color: navTheme.colors.text }}>🌓</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Горизонтальный скролл новых историй */}
      <View style={{ height: height / 3, marginBottom: 20 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyScroll}
        >
          {histories
            .filter(story => story)
            .map(story => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyNewCard}
                onPress={() => navigation.navigate('StoryScreen', { story })}
              >
                <ImageBackground
                  source={{ uri: `${SERVER_URL}${story.imageUrl}` }}
                  style={styles.storyImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{story.languageLevel}</Text>
                  </View>
                  <View style={styles.overlay} />
                  <Text
                    style={styles.storyText}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {story.title.ru}
                  </Text>
                </ImageBackground>
                <TouchableOpacity
                  onPress={() => handleLike(story)}
                  disabled={!user || pendingLikes.has(story.id)}
                  style={[
                    styles.likeButton,
                    { opacity: !user || pendingLikes.has(story.id) ? 0.5 : 1 },
                  ]}
                >
                  {pendingLikes.has(story.id) ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text style={{ fontSize: 20 }}>
                      {story.likedByCurrentUser ? '❤️' : '🤍'}
                    </Text>
                  )}
                  <Text style={{ marginLeft: 4 }}>{story.likesCount || 0}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Вертикальный список обычных историй */}
      <View style={styles.storyScroll}>
        {histories
          .filter(story => story)
          .map(story => (
            <TouchableOpacity
              key={story.id}
              style={[styles.storyCard, { height: 200, marginBottom: 16 }]}
              onPress={() => navigation.navigate('StoryScreen', { story })}
            >
              <ImageBackground
                source={{ uri: `${SERVER_URL}${story.imageUrl}` }}
                style={styles.storyImage}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{story.languageLevel}</Text>
                </View>
                <View style={styles.overlay} />
                <Text
                  style={styles.storyText}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {story.title.ru}
                </Text>
              </ImageBackground>
              <TouchableOpacity
                onPress={() => handleLike(story)}
                disabled={!user || pendingLikes.has(story.id)}
                style={[
                  styles.likeButton,
                  { opacity: !user || pendingLikes.has(story.id) ? 0.5 : 1 },
                ]}
              >
                {pendingLikes.has(story.id) ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={{ fontSize: 20 }}>
                    {story.likedByCurrentUser ? '❤️' : '🤍'}
                  </Text>
                )}
                <Text style={{ marginLeft: 4 }}>{story.likesCount || 0}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#dc3545', marginLeft: 8 }]}
        onPress={logoutAndClear}
      >
        <Text style={styles.buttonText}>Очистить стейт</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24 },
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  storySection: { height: height / 3 },
  storyScroll: { alignItems: 'center' },
  storyCard: { width: width * 0.9, height: '90%', marginRight: 16 },
  storyNewCard: { width: width * 0.6, height: '90%', marginRight: 16 },
  storyImage: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 12,
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ffda0bff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  levelText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  storyText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});
