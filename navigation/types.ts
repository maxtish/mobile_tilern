import { History } from '../types/storiesTypes';

// app/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  StoryScreen: { story: History };
  Auth: undefined;
};
