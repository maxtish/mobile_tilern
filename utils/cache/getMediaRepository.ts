import { downloadImageIfNeeded } from './imageCache';
import { SERVER_URL } from '../../constants/constants';
import { downloadAudioIfNeeded } from './audioCache';
import { History } from '../../types/storiesTypes';

export const cacheStoryAssets = async (story: History) => {
  await Promise.all([
    downloadImageIfNeeded(story.id, `${SERVER_URL}${story.imageUrl}`),
  ]);
};
