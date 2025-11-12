/*

пытается сопоставить текущее текстовое слово с группой таймингов (до 5 слов вперёд);

если не находит — пробует объединить несколько текстовых токенов (до 5) и сопоставить их с группой таймингов (до 5);

если и это не сработало — берёт ближайший тайминг и идёт дальше (чтобы не застревать);

аккуратно обновляет индексы (и возвращает массив, выровненный по текстовым токенам / группам).*/

import { WordTiming } from '../types/storiesTypes';

function normalize(str: string): string {
  return str
    .replace(/[\n\r]/g, ' ')
    .replace(/[.,!?;:"()«»—\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Сливает текст и тайминги: подбирает соответствия между словами текста и словами из озвучки.
 * Поддерживает объединение нескольких таймингов в одно слово и поиск вперёд до 5 шагов.
 */
export function mergeTimings(
  text: string,
  timings: WordTiming[],
): WordTiming[] {
  if (!text || !timings?.length) return [];

  const textTokens = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(t => t.trim())
    .filter(Boolean);

  const merged: WordTiming[] = [];
  let timingIndex = 0;
  const MAX_LOOKAHEAD = 5;

  const combinedTimingNorm = (startIdx: number, len: number): string => {
    return normalize(
      timings
        .slice(startIdx, startIdx + len)
        .map(t => t.word ?? '')
        .join(' '),
    );
  };

  for (let ti = 0; ti < textTokens.length; ti++) {
    const token = textTokens[ti];
    const normToken = normalize(token);

    // если тайминги закончились — добавляем нули
    if (timingIndex >= timings.length) {
      merged.push({ word: token, start: 0, end: 0 });
      continue;
    }

    // 1️⃣ Пробуем объединять тайминги (до 5)
    let found = false;
    for (
      let look = 1;
      look <= MAX_LOOKAHEAD && timingIndex + look - 1 < timings.length;
      look++
    ) {
      const normCombined = combinedTimingNorm(timingIndex, look);
      if (
        normToken === normCombined ||
        normToken.includes(normCombined) ||
        normCombined.includes(normToken)
      ) {
        merged.push({
          word: token,
          start: timings[timingIndex].start,
          end: timings[timingIndex + look - 1].end,
        });
        timingIndex += look;
        found = true;
        break;
      }
    }
    if (found) continue;

    // 2️⃣ Пробуем объединять несколько текстовых токенов и таймингов
    let matched = false;
    for (
      let textGroupLen = 2;
      textGroupLen <= MAX_LOOKAHEAD &&
      ti + textGroupLen - 1 < textTokens.length;
      textGroupLen++
    ) {
      const combinedText = textTokens.slice(ti, ti + textGroupLen).join(' ');
      const normCombinedText = normalize(combinedText);

      for (
        let timeGroupLen = 1;
        timeGroupLen <= MAX_LOOKAHEAD &&
        timingIndex + timeGroupLen - 1 < timings.length;
        timeGroupLen++
      ) {
        const normCombinedTiming = combinedTimingNorm(
          timingIndex,
          timeGroupLen,
        );
        if (
          normCombinedText === normCombinedTiming ||
          normCombinedText.includes(normCombinedTiming) ||
          normCombinedTiming.includes(normCombinedText)
        ) {
          merged.push({
            word: combinedText,
            start: timings[timingIndex].start,
            end: timings[timingIndex + timeGroupLen - 1].end,
          });
          ti += textGroupLen - 1;
          timingIndex += timeGroupLen;
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
    if (matched) continue;

    // 3️⃣ Проверка вперёд по таймингам (до 5 шагов)
    let foundForwardTiming = false;
    for (
      let lookahead = 1;
      lookahead <= MAX_LOOKAHEAD && timingIndex + lookahead < timings.length;
      lookahead++
    ) {
      const candidateNorm = combinedTimingNorm(timingIndex, lookahead + 1);
      if (
        normToken === candidateNorm ||
        normToken.includes(candidateNorm) ||
        candidateNorm.includes(normToken)
      ) {
        merged.push({
          word: token,
          start: timings[timingIndex].start,
          end: timings[timingIndex + lookahead].end,
        });
        timingIndex += lookahead + 1;
        foundForwardTiming = true;
        break;
      }
    }
    if (foundForwardTiming) continue;

    // 4️⃣ Если ничего не подошло — связываем текущее слово с текущим таймингом
    const curTiming = timings[timingIndex];
    merged.push({
      word: token,
      start: curTiming.start ?? 0,
      end: curTiming.end ?? 0,
    });
    timingIndex++;
  }

  return merged;
}
