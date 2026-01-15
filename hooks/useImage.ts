import { useEffect, useState } from 'react';
import { getImagePath, isImageCached } from '../utils/cache/imageCache';
import { SERVER_URL } from '../constants/constants';

export const useCachedImage = (storyId: string, imageUrl: string) => {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    isImageCached(storyId).then(cached => {
      if (!active) return;
      setUri(
        cached ? `file://${getImagePath(storyId)}` : `${SERVER_URL}${imageUrl}`,
      );
    });

    return () => {
      active = false;
    };
  }, [storyId, imageUrl]);

  return uri;
};
