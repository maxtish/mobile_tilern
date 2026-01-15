import RNFS from 'react-native-fs';

const IMAGE_DIR = `${RNFS.CachesDirectoryPath}/images`;

export const getImagePath = (storyId: string) => `${IMAGE_DIR}/${storyId}.jpg`;

export const ensureImageDir = async () => {
  const exists = await RNFS.exists(IMAGE_DIR);
  if (!exists) {
    await RNFS.mkdir(IMAGE_DIR);
  }
};

export const isImageCached = async (storyId: string) => {
  await ensureImageDir();
  return RNFS.exists(getImagePath(storyId));
};

export const downloadImageIfNeeded = async (storyId: string, url: string) => {
  await ensureImageDir();

  const path = getImagePath(storyId);
  const exists = await RNFS.exists(path);

  if (exists) return path;

  await RNFS.downloadFile({
    fromUrl: url,
    toFile: path,
  }).promise;

  return path;
};
