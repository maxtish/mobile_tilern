import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Sound from 'react-native-sound';
import {
  getAudioPath,
  downloadAudioIfNeeded,
  isAudioCached,
} from '../utils/cache/audioCache';
import { SERVER_URL } from '../constants/constants';

export const useAudio = (storyId: string | null, audioUrl: string | null) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<number | null>(null);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);

      // Если storyId или audioUrl нет — выходим сразу
      if (!storyId || !audioUrl) {
        console.warn('Audio not available: storyId or audioUrl is null');
        setIsLoading(false);
        return;
      }

      try {
        // Проверяем, есть ли уже закэшированное аудио
        const cached = await isAudioCached(storyId);

        // Получаем путь к файлу (скачиваем, если нет)
        const localPath = cached
          ? getAudioPath(storyId)
          : await downloadAudioIfNeeded(storyId, `${SERVER_URL}${audioUrl}`);

        if (!active) return;

        // Загружаем звук

        const pathForSound =
          Platform.OS === 'ios' ? 'file://' + localPath : localPath;
        const s = new Sound(pathForSound, '', error => {
          if (error) {
            console.error('Failed to load sound', error, pathForSound);
          } else {
            setSound(s);
          }
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Audio load error', err);
        if (active) setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
      if (sound) sound.release();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [storyId, audioUrl]);

  const play = (onEnd?: () => void) => {
    if (!sound || isLoading) return;

    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      const playCallback = (success: boolean) => {
        if (success && isLooping) {
          sound.play(playCallback);
        } else {
          setIsPlaying(false);
          onEnd?.();
        }
      };

      sound.play(playCallback);
      setIsPlaying(true);
    }
  };

  return {
    sound,
    isPlaying,
    isLoading,
    play,
    timerRef,
    setIsPlaying,
    isLooping,
    setIsLooping,
  };
};
