import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './navigation/TabNavigator';
import { LocalizationProvider } from './src/contexts/LocalizationContext';

export default function App() {
  return (
    <LocalizationProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </LocalizationProvider>
  );
} 