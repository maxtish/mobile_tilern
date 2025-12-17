// types/themeTypes.ts
export type FontWeight = '400' | '500' | '700' | '900';

export type ThemeFonts = {
  regular: { fontFamily: string; fontWeight: FontWeight };
  medium: { fontFamily: string; fontWeight: FontWeight };
  bold: { fontFamily: string; fontWeight: FontWeight };
  heavy: { fontFamily: string; fontWeight: FontWeight };
};

export type AppColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  textHistory: string;
  wordHistoryBackground: string;
};

export type AppTheme = {
  dark: boolean;
  colors: AppColors;
  fonts: ThemeFonts;
};
