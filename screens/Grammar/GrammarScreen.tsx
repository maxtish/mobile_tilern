import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import Markdown from 'react-native-markdown-display';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { colorsArticle } from '../../constants/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Grammar'>;

type GrammarScreenNavigationProp = NavigationProp<
  RootStackParamList,
  'Grammar'
>;

export default function GrammarScreen({ route }: Props) {
  const { appTheme } = useAppTheme();
  const navigation = useNavigation<GrammarScreenNavigationProp>();
  const sentences = route.params.sentences;

  // Стили для Markdown (чтобы подстроить под тему приложения)
  const markdownStyles = StyleSheet.create({
    body: {
      color: appTheme.colors.text, // Используем цвет текста из вашей темы
      fontSize: 16,
    },
    strong: {
      fontWeight: 'bold',
      color: appTheme.colors.primary, // Например, выделить жирный акцентным цветом
    },
    bullet_list: {
      marginBottom: 10,
    },
    list_item: {
      marginVertical: 2,
    },
  });

  // -------------------------
  // Основной UI
  // -------------------------
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: appTheme.colors.background },
      ]}
    >
      {sentences.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={[styles.germanText, { color: appTheme.colors.text }]}>
            {item.de}
          </Text>
          <Text style={styles.russianText}>{item.ru}</Text>

          <View style={styles.grammarContainer}>
            <Text style={styles.label}>Грамматика:</Text>
            {/* Рендерим Markdown */}
            <Markdown style={markdownStyles}>{item.grammar}</Markdown>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// -------------------------
// Стили
// -------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)', // Легкий фон для карточки
  },
  germanText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  russianText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  grammarContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 5,
    color: '#888',
  },
});
