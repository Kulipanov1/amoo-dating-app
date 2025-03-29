import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import LiveScreen from './screens/LiveScreen';
import ProfileScreen from './screens/ProfileScreen';
import Header from './components/Header';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: '#B19CD9',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            elevation: 0,
            shadowOpacity: 0,
          },
          header: () => <Header />,
          headerStyle: {
            backgroundColor: 'white',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
          },
          headerTitleStyle: {
            color: '#8A2BE2',
            fontSize: 20,
          },
        }}
      >
        <Tab.Screen
          name="Знакомства"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Карта"
          component={MapScreen}
          options={{
            title: 'Люди рядом',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Эфиры"
          component={LiveScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="videocam" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Профиль"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 