import RNFS from 'react-native-fs';

const AUDIO_DIR = `${RNFS.CachesDirectoryPath}/audio`;

export const getAudioPath = (storyId: string) => `${AUDIO_DIR}/${storyId}.mp3`;

export const ensureAudioDir = async () => {
  const exists = await RNFS.exists(AUDIO_DIR);
  if (!exists) {
    await RNFS.mkdir(AUDIO_DIR);
  }
};

export const isAudioCached = async (storyId: string) => {
  await ensureAudioDir();
  return RNFS.exists(getAudioPath(storyId));
};

export const downloadAudioIfNeeded = async (storyId: string, url: string) => {
  await ensureAudioDir();
  const path = getAudioPath(storyId);
  const exists = await RNFS.exists(path);
  if (exists) return path;

  const result = await RNFS.downloadFile({ fromUrl: url, toFile: path })
    .promise;

  if (result.statusCode !== 200) {
    console.error('Audio download failed', url, result);
    throw new Error('Failed to download audio');
  }

  const fileExists = await RNFS.exists(path);
  if (!fileExists) throw new Error('Audio file does not exist after download');

  return path;
};
