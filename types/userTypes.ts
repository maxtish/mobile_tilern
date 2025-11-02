export interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export type UserRole = 'USER' | 'PREMIUM' | 'EDITOR' | 'ADMIN';

// --- Клиентская модель (для API / фронта) ---
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
}

// --- Серверная модель (из БД) ---
export interface DBUser {
  id: string;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// --- Маппер: DB → API (server response) ---
export const mapDBUserToUser = (dbUser: DBUser): User => ({
  id: dbUser.id,
  email: dbUser.email,
  name: dbUser.name,
  avatarUrl: dbUser.avatar_url,
  role: dbUser.role,
});

export interface LoginResponse {
  user: User;
  token: string;
}

[
  {
    id: '65da5230-df97-48b6-abdc-18759d5c1b2f',
    title: { de: 'Überraschungen der Physik', ru: 'Сюрпризы физики' },
    description: 'Краткие факты о физических явлениях, которые удивляют.',
    fullStory: {
      de: 'Licht ist extrem schnell – 300.000 Kilometer pro Sekunde! Metall wird bei −196 °C spröde wie Glas. Unter extremem Druck kann Wasser heiß bleiben, ohne zu kochen. Die Welt der Physik ist voller Überraschungen!',
      ru: 'Свет невероятно быстр – 300 000 километров в секунду! Металл становится хрупким, как стекло, при −196 °C. Под экстремальным давлением вода может оставаться горячей, не закипая. Мир физики полон сюрпризов!',
    },
    languageLevel: 'B1',
    imageUrl: '/media/70/dd/65da5230-df97-48b6-abdc-18759d5c1b2f.png',
    audioUrl: '/media/70/dd/65da5230-df97-48b6-abdc-18759d5c1b2f.mp3',
    wordTiming: [
      { end: 0.550000011920929, word: 'Licht', start: 0 },
      { end: 1.100000023841858, word: 'ist', start: 0.550000011920929 },
      { end: 1.6500000357627869, word: 'extrem', start: 1.100000023841858 },
      { end: 2.200000047683716, word: 'schnell,', start: 1.6500000357627869 },
      { end: 2.7500000596046448, word: '300.000', start: 2.200000047683716 },
      { end: 3.3000000715255737, word: 'km', start: 2.7500000596046448 },
      { end: 3.8500000834465027, word: 'pro', start: 3.3000000715255737 },
      { end: 4.400000095367432, word: 'Sekunde.', start: 3.8500000834465027 },
      { end: 5.142857279096331, word: 'Metall', start: 4.400000095367432 },
      { end: 5.885714462825231, word: 'wird', start: 5.142857279096331 },
      { end: 6.628571646554129, word: 'bei', start: 5.885714462825231 },
      { end: 7.371428830283029, word: '–196°C', start: 6.628571646554129 },
      { end: 8.114286014011928, word: 'spröde', start: 7.371428830283029 },
      { end: 8.857143197740827, word: 'wie', start: 8.114286014011928 },
      { end: 9.600000381469727, word: 'Glas.', start: 8.857143197740827 },
      { end: 10.000000381469727, word: 'Unter', start: 9.600000381469727 },
      { end: 10.400000381469727, word: 'extremen', start: 10.000000381469727 },
      { end: 10.800000381469726, word: 'Druck', start: 10.400000381469727 },
      { end: 11.200000381469726, word: 'kann', start: 10.800000381469726 },
      { end: 11.600000381469727, word: 'Wasser', start: 11.200000381469726 },
      { end: 12.000000381469727, word: 'heiß', start: 11.600000381469727 },
      { end: 12.400000381469727, word: 'bleiben,', start: 12.000000381469727 },
      { end: 12.800000381469726, word: 'ohne', start: 12.400000381469727 },
      { end: 13.200000381469726, word: 'zu', start: 12.800000381469726 },
      { end: 13.600000381469727, word: 'kochen.', start: 13.200000381469726 },
      { end: 13.942857469831194, word: 'Die', start: 13.600000381469727 },
      { end: 14.285714558192662, word: 'Welt', start: 13.942857469831194 },
      { end: 14.628571646554128, word: 'der', start: 14.285714558192662 },
      { end: 14.971428734915596, word: 'Physik', start: 14.628571646554128 },
      { end: 15.314285823277064, word: 'ist', start: 14.971428734915596 },
      { end: 15.657142911638532, word: 'voller', start: 15.314285823277064 },
      { end: 16, word: 'Überraschungen.', start: 15.657142911638532 },
    ],
    words: [
      {
        type: 'noun',
        word: { plural: null, singular: 'das Licht' },
        translation: 'свет',
      },
      { type: 'other', word: 'ist', translation: 'является' },
      { type: 'other', word: 'extrem', translation: 'экстремальный' },
      { type: 'other', word: 'schnell', translation: 'быстрый' },
      { type: 'other', word: '–', translation: 'тире' },
      {
        type: 'noun',
        word: { plural: 'die Kilometer', singular: 'der Kilometer' },
        translation: 'километр',
      },
      { type: 'other', word: 'pro', translation: 'за' },
      {
        type: 'noun',
        word: { plural: 'die Sekunden', singular: 'die Sekunde' },
        translation: 'секунда',
      },
      {
        type: 'noun',
        word: { plural: null, singular: 'das Metall' },
        translation: 'металл',
      },
      { type: 'other', word: 'wird', translation: 'становится' },
      { type: 'other', word: 'bei', translation: 'при' },
      {
        type: 'noun',
        word: { plural: null, singular: '−196 °C' },
        translation: '−196 °C',
      },
      { type: 'other', word: 'spröde', translation: 'ломкий' },
      { type: 'other', word: 'wie', translation: 'как' },
      {
        type: 'noun',
        word: { plural: 'die Gläser', singular: 'das Glas' },
        translation: 'стекло',
      },
      { type: 'other', word: 'Unter', translation: 'под' },
      { type: 'other', word: 'extremem', translation: 'экстремальным' },
      {
        type: 'noun',
        word: { plural: 'die Drücke', singular: 'der Druck' },
        translation: 'давление',
      },
      { type: 'other', word: 'kann', translation: 'может' },
      {
        type: 'noun',
        word: { plural: null, singular: 'das Wasser' },
        translation: 'вода',
      },
      { type: 'other', word: 'heiß', translation: 'горячий' },
      { type: 'other', word: 'bleiben', translation: 'оставаться' },
      { type: 'other', word: 'ohne', translation: 'без' },
      { type: 'other', word: 'zu', translation: 'чтобы' },
      { type: 'other', word: 'kochen', translation: 'кипеть' },
      {
        type: 'other',
        word: 'Die',
        translation: 'определённый артикль женского рода',
      },
      {
        type: 'noun',
        word: { plural: 'die Welten', singular: 'die Welt' },
        translation: 'мир',
      },
      {
        type: 'other',
        word: 'der',
        translation: 'определённый артикль мужского рода',
      },
      {
        type: 'noun',
        word: { plural: null, singular: 'die Physik' },
        translation: 'физика',
      },
      { type: 'other', word: 'ist', translation: 'является' },
      { type: 'other', word: 'voller', translation: 'полный' },
      {
        type: 'noun',
        word: { plural: 'die Überraschungen', singular: 'die Überraschung' },
        translation: 'сюрприз',
      },
    ],
    createdDate: '2025-11-02T13:22:22.696Z',
    updatedDate: '2025-11-02T13:22:22.696Z',
    authorName: 'AI Story Generator',
    authorRole: 'ADMIN',
    viewsCount: 0,
  },
];
