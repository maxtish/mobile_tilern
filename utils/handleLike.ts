import { History } from '../types/storiesTypes';
import { likeHistory, unlikeHistory } from '../api/likeHistory';

export const handleLikeOutside = async ({
  story,
  user,
  pendingLikes,
  setPendingLikes,
  setHistories,
}: {
  story: History;
  user: any;
  pendingLikes: Set<string>;
  setPendingLikes: React.Dispatch<React.SetStateAction<Set<string>>>;
  setHistories: React.Dispatch<React.SetStateAction<History[]>>;
}) => {
  if (!user) return;

  const storyId = story.id;

  // Защита от двойных запросов
  if (pendingLikes.has(storyId)) return;

  const alreadyLiked = !!story.likedByCurrentUser;

  // Оптимистичное обновление
  setHistories(prev =>
    prev.map(s =>
      s.id === storyId
        ? {
            ...s,
            likedByCurrentUser: !alreadyLiked,
            likesCount: Math.max(
              0,
              (s.likesCount ?? 0) + (alreadyLiked ? -1 : 1),
            ),
          }
        : s,
    ),
  );

  // помечаем запрос как pending
  setPendingLikes(prev => new Set(prev).add(storyId));

  try {
    let res;

    if (alreadyLiked) {
      res = await unlikeHistory(storyId, user.id);
    } else {
      res = await likeHistory(storyId, user.id);
    }

    if (res?.likesCount !== undefined) {
      setHistories(prev =>
        prev.map(s =>
          s.id === storyId
            ? {
                ...s,
                likedByCurrentUser: !alreadyLiked,
                likesCount: res.likesCount,
              }
            : s,
        ),
      );
    }
  } catch (e) {
    console.error('Ошибка лайка:', e);

    // Откат UI
    setHistories(prev =>
      prev.map(s =>
        s.id === storyId
          ? {
              ...s,
              likedByCurrentUser: alreadyLiked,
              likesCount: Math.max(
                0,
                (s.likesCount ?? 0) + (alreadyLiked ? 1 : -1),
              ),
            }
          : s,
      ),
    );
  } finally {
    // снимаем pending
    setPendingLikes(prev => {
      const copy = new Set(prev);
      copy.delete(storyId);
      return copy;
    });
  }
};
