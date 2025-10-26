import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import { Story } from '../../types/storiesTypes';

const { width } = Dimensions.get('window');

interface StoryScreenProps {
  route: {
    params: {
      story: Story;
    };
  };
  navigation: any;
}

export default function StoryScreen({ route, navigation }: StoryScreenProps) {
  const { navTheme } = useAppTheme();
  const { story } = route.params;

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: navTheme.colors.background },
      ]}
    >
      {/* Картинка */}
      <Image
        source={{ uri: story.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Заголовок и уровень языка */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: navTheme.colors.text }]}>
          {story.title.ru} {/* Можно переключить на story.title.de */}
        </Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{story.languageLevel}</Text>
        </View>
      </View>

      {/* Полная история */}
      <Text style={[styles.fullStory, { color: navTheme.colors.text }]}>
        {story.fullStory}
      </Text>

      {/* Кнопка назад */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  image: { width: width - 32, height: 200, borderRadius: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', flex: 1 },
  levelBadge: {
    backgroundColor: '#FFD700',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  levelText: { color: '#000', fontWeight: 'bold' },
  fullStory: { fontSize: 16, lineHeight: 22 },
  backButton: {
    marginTop: 24,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
});
