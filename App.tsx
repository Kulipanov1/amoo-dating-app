import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MapScreen from './screens/MapScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'help-outline';

            if (route.name === 'Знакомства') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Профиль') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Карта') {
              iconName = focused ? 'map' : 'map-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerTitleStyle: {
            color: '#8A2BE2',
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Знакомства" 
          component={HomeScreen}
          options={{
            title: 'Знакомства'
          }}
        />
        <Tab.Screen 
          name="Карта" 
          component={MapScreen}
          options={{
            title: 'Люди рядом'
          }}
        />
        <Tab.Screen 
          name="Профиль" 
          component={ProfileScreen}
          options={{
            title: 'Мой профиль'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 