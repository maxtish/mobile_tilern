import { History, SentenceGrammar } from '../types/storiesTypes';

// app/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  StoryScreen: { storyId: string };
  Auth: undefined;
  AddStory: undefined;
  WordTraining: { userId: string | undefined };
  AllWords: undefined;
  GameMemory: undefined;
  Grammar: { sentences: SentenceGrammar[] };
};
