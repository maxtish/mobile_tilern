import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useUserStore } from '../../state/userStore';
import { getHistories } from '../../api/getHistories';
import { History } from '../../types/storiesTypes';
import { SERVER_URL } from '../../constants/constants';
import { logoutAndClear } from '../../utils/logoutAndClear';
import { handleLikeOutside } from '../../utils/handleLike';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { navTheme, appTheme, toggleTheme } = useAppTheme();
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore(state => state.user);
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set());

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
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  /////////////////// Очистить стейт
  const handleLogout = async () => {
    await logoutAndClear(setHistories);
  };

  ///////////////  для обработки лайков
  const handleLike = async (story: History) => {
    handleLikeOutside({
      story,
      user,
      pendingLikes,
      setPendingLikes,
      setHistories,
    });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View
      style={{
        flex: 1,
        marginTop: 15,
      }}
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
            TiLern – Lies, lerne, sprich.
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

      <ScrollView
        key={histories.length}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
      >
        {/* Вертикальный список обычных историй */}
        <View style={styles.storyScroll}>
          {histories
            .filter(story => story)
            .map(story => (
              <Pressable
                key={story.id}
                style={[styles.storyCard]}
                onPress={() => navigation.navigate('StoryScreen', { story })}
              >
                <ImageBackground
                  source={{ uri: `${SERVER_URL}${story.imageUrl}` }}
                  style={styles.storyImage}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <TouchableOpacity
                    onPress={() => handleLike(story)}
                    disabled={!user || pendingLikes.has(story.id)}
                    style={[
                      styles.likeButton,
                      {
                        opacity: !user || pendingLikes.has(story.id) ? 0.5 : 1,
                      },
                    ]}
                  >
                    {pendingLikes.has(story.id) ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <Text style={{ fontSize: 20 }}>
                        {story.likedByCurrentUser ? '❤️' : '🤍'}
                      </Text>
                    )}
                    <Text style={{ marginLeft: 4, color: '#fff' }}>
                      {story.likesCount || 0}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{story.languageLevel}</Text>
                  </View>
                  <View style={styles.overlay} />
                  <View style={styles.storyContainerText}>
                    <Text
                      style={styles.storyTextTitle}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {story.title.ru}
                    </Text>
                    <Text
                      style={styles.storyTextDescription}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {story.description}
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            ))}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#dc3545', marginLeft: 8 }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Очистить стейт</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 18 },
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

  storyScroll: { alignItems: 'center' },
  storyCard: {
    width: width * 0.9,
    aspectRatio: 0.8,
    borderRadius: 19,
    marginBottom: 30,
  },

  storyImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  storyContainerText: {
    margin: 20,
    padding: 10,
    backgroundColor: '#383434d2',
    borderRadius: 15,
  },
  storyTextTitle: {
    color: '#bbbbbb',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  storyTextDescription: { color: '#bbbbbb', fontSize: 14, fontWeight: '300' },

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

  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
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
});
