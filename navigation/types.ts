import { Story } from '../types/storiesTypes';

// app/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  StoryScreen: { story: Story };
};
