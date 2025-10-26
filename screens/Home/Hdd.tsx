import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';

const { width, height } = Dimensions.get('window');

const mockStories = [
  {
    id: 1,
    title: 'История о путешествии...',
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    id: 2,
    title: 'Невероятное приключение',
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    id: 3,
    title: 'Как я жил без интернета',
    image: 'https://picsum.photos/400/300?random=3',
  },
];

export default function HomeScreen() {
  const { navTheme, appTheme, toggleTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      {/* Верхняя панель */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: navTheme.colors.text,
              fontFamily: 'Playwrite DE SAS',
            },
          ]}
        >
          Добро пожаловать!
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Аватар */}
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: navTheme.colors.card }]}
          >
            <Text style={{ color: navTheme.colors.text }}>A</Text>
          </TouchableOpacity>

          {/* Переключатель темы */}
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

      {/* Секция историй */}
      <View style={styles.storySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyScroll}
        >
          {mockStories.map(story => (
            <TouchableOpacity key={story.id} style={styles.storyCard}>
              <ImageBackground
                source={{ uri: story.image }}
                style={styles.storyImage}
                imageStyle={{ borderRadius: 16 }}
              >
                <View style={styles.overlay} />
                <Text
                  style={styles.storyText}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {story.title}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
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
  title: { fontSize: 24, fontWeight: '700' },
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
  storySection: { height: height / 3 },
  storyScroll: { alignItems: 'center' },
  storyCard: { width: width * 0.6, height: '90%', marginRight: 16 },
  storyImage: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  storyText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
