export interface Story {
  id: number;
  title: {
    ru: string;
    de: string;
  };
  image: string;
  fullStory: string;
  languageLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  isNew: boolean;
}
