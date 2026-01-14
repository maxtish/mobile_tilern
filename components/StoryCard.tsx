import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import RNFS from 'react-native-fs';

import { SERVER_URL } from '../constants/constants';
import { History } from '../types/storiesTypes';
import { isAudioCached } from '../utils/cache/audioCache';

const { width } = Dimensions.get('window');

interface StoryCardProps {
  story: History;
  onPress: (story: History) => void;
  onLike: (story: History) => void;
  isLikePending: boolean;
  user: any;
}

export const StoryCard = React.memo(
  ({ story, onPress, onLike, isLikePending, user }: StoryCardProps) => {
    const [isDownloaded, setIsDownloaded] = useState(false);

    useEffect(() => {
      let active = true;

      isAudioCached(story.id)
        .then(exists => {
          if (active) setIsDownloaded(exists);
        })
        .catch(() => {
          if (active) setIsDownloaded(false);
        });

      return () => {
        active = false;
      };
    }, [story.id]);

    return (
      <Pressable style={styles.storyCard} onPress={() => onPress(story)}>
        <Image
          source={{ uri: `${SERVER_URL}${story.imageUrl}` }}
          style={styles.storyImage}
          resizeMode="cover"
        />

        {/* LIKE */}
        <TouchableOpacity
          onPress={() => onLike(story)}
          disabled={!user || isLikePending}
          style={[
            styles.likeButton,
            { opacity: !user || isLikePending ? 0.5 : 1 },
          ]}
        >
          {isLikePending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.likeContainer}>
              <Text style={{ fontSize: 20 }}>
                {story.likedByCurrentUser ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.likesCount}>{story.likesCount ?? 0}</Text>
            </View>
          )}
        </TouchableOpacity>

        {isDownloaded && (
          <View style={styles.downloadBadge}>
            <Text style={styles.downloadText}>✓ Offline</Text>
          </View>
        )}

        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{story.languageLevel}</Text>
        </View>

        <View style={styles.overlay} />

        <View style={styles.storyContainerText}>
          <Text style={styles.storyTextTitle} numberOfLines={2}>
            {story.title.ru}
          </Text>
          <Text style={styles.storyTextDescription} numberOfLines={2}>
            {story.description}
          </Text>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  storyCard: {
    width: width * 0.9,
    aspectRatio: 0.8,
    borderRadius: 19,
    marginBottom: 30,
    overflow: 'hidden',
  },
  storyImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    marginLeft: 4,
    color: '#fff',
    fontWeight: 'bold',
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ffda0b',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  levelText: {
    color: '#000',
    fontWeight: 'bold',
  },
  downloadBadge: {
    position: 'absolute',
    top: 55,
    left: 12,
    backgroundColor: 'rgba(40,167,69,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 10,
  },
  downloadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  storyContainerText: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    padding: 12,
    backgroundColor: 'rgba(56,52,52,0.85)',
    borderRadius: 15,
  },
  storyTextTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storyTextDescription: {
    color: '#ddd',
    fontSize: 13,
  },
});
