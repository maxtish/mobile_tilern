import { useState, useEffect, useRef } from 'react';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import { SERVER_URL } from '../constants/constants';

export const useAudio = (storyId: string, audioUrl: string) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<number | null>(null);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    const localPath = `${RNFS.CachesDirectoryPath}/${storyId}.mp3`;
    const loadSound = (path: string) => {
      const s = new Sound(path, '', error => {
        if (!error) setSound(s);
        setIsLoading(false);
      });
    };
    RNFS.exists(localPath)
      .then(exists =>
        exists
          ? loadSound(localPath)
          : RNFS.downloadFile({
              fromUrl: `${SERVER_URL}${audioUrl}`,
              toFile: localPath,
            }).promise.then(() => loadSound(localPath)),
      )
      .catch(() => setIsLoading(false));

    return () => {
      if (sound) sound.release();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const play = (onEnd?: () => void) => {
    if (!sound || isLoading) return;
    if (isPlaying) {
      sound.pause();
      setIsPlaying(false);
    } else {
      const playCallback = (success: boolean) => {
        if (success && isLooping) {
          // Если включен повтор, запускаем снова
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
