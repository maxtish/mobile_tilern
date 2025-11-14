// app/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import { RootStackParamList } from './types';
import StoryScreen from '../screens/Story/StoryScreen';
import AuthScreen from '../screens/Auth/AuthScreen';
import AddStoryScreen from '../screens/AddStory/AddStoryScreen';
import AllWordsScreen from '../screens/WordsScreen/AllWordsScreen';
import TrainingScreen from '../screens/Training/WordTrainingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoryScreen"
        component={StoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen
        name="AddStory"
        component={AddStoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WordTraining"
        component={TrainingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AllWords"
        component={AllWordsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
