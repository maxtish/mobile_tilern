import { Story } from '../types/storiesTypes';

export const stories: Story[] = [
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: true,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: true,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: true,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: true,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: true,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: true,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: false,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: false,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: false,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: false,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: false,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
  {
    id: 1,
    title: {
      ru: 'История о путешествии в Берлин',
      de: 'Eine Reise nach Berlin',
    },
    image: 'https://picsum.photos/400/300?random=1',

    fullStory: {
      de: 'Letzten Sommer habe ich eine Reise nach Berlin gemacht. Ich habe viele Sehenswürdigkeiten gesehen, wie das Brandenburger Tor und den Reichstag. Das Essen war auch sehr lecker!',
      ru: 'Прошлым летом я отправился в путешествие в Берлин. Я увидел много достопримечательностей, таких как Бранденбургские ворота и Рейхстаг. Еда была тоже очень вкусной!',
    },

    languageLevel: 'A2',
    isNew: false,

    audioUrl: 'https://example.com/audio/berlin.mp3', // 🔹 заглушка

    wordTiming: [
      { word: 'Letzten', start: 0.0, end: 0.4 },
      { word: 'Sommer', start: 0.4, end: 0.8 },
      { word: 'habe', start: 0.8, end: 1.0 },
      { word: 'ich', start: 1.0, end: 1.2 },
      { word: 'eine', start: 1.2, end: 1.4 },
      { word: 'Reise', start: 1.4, end: 1.8 },
      { word: 'nach', start: 1.8, end: 2.0 },
      { word: 'Berlin', start: 2.0, end: 2.4 },
      { word: 'gemacht', start: 2.4, end: 2.8 },
    ],

    words: [
      {
        type: 'other',
        word: 'Letzten',
        translation: 'прошлым',
      },
      {
        type: 'noun',
        word: { singular: 'Sommer', plural: 'Sommer' },
        translation: 'лето',
      },
      {
        type: 'verb',
        word: 'habe',
        translation: 'имею / сделал (в Perfekt)',
      },
      {
        type: 'other',
        word: 'ich',
        translation: 'я',
      },
      {
        type: 'other',
        word: 'eine',
        translation: 'одна (артикль)',
      },
      {
        type: 'noun',
        word: { singular: 'Reise', plural: 'Reisen' },
        translation: 'путешествие',
      },
      {
        type: 'other',
        word: 'nach',
        translation: 'в / к (направление)',
      },
      {
        type: 'noun',
        word: { singular: 'Berlin', plural: 'Berlin' },
        translation: 'Берлин',
      },
      {
        type: 'verb',
        word: 'gemacht',
        translation: 'сделал',
      },
      { type: 'other', word: 'Ich', translation: 'Я' },
      {
        type: 'verb',
        word: 'habe',
        translation: 'иметь (вспомогательный глагол)',
      },
      { type: 'other', word: 'viele', translation: 'много' },
      {
        type: 'noun',
        word: { singular: 'Sehenswürdigkeit', plural: 'Sehenswürdigkeiten' },
        translation: 'достопримечательность',
      },
      { type: 'verb', word: 'sehen', translation: 'видеть' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'other',
        word: 'das',
        translation: 'определённый артикль (средний род)',
      },
      {
        type: 'noun',
        word: { singular: 'Brandenburger Tor', plural: 'Brandenburger Tore' },
        translation: 'Бранденбургские ворота',
      },
      { type: 'other', word: 'und', translation: 'и' },
      {
        type: 'other',
        word: 'den',
        translation: 'определённый артикль (м.р., вин. падеж)',
      },
      {
        type: 'noun',
        word: { singular: 'Reichstag', plural: 'Reichstage' },
        translation: 'Рейхстаг',
      },
      {
        type: 'noun',
        word: { singular: 'Essen', plural: 'Essen' },
        translation: 'еда',
      },
      { type: 'verb', word: 'sein', translation: 'быть (форма: war — был)' },
      { type: 'other', word: 'auch', translation: 'тоже' },
      { type: 'other', word: 'sehr', translation: 'очень' },
      { type: 'other', word: 'lecker', translation: 'вкусный' },
    ],
  },
];
