import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import LiveScreen from '../screens/LiveScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#F8F4FF',
          borderTopWidth: 1,
          borderTopColor: '#E3D3FF',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          marginBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#8A2BE2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#333',
          fontSize: 18,
          fontWeight: 'bold',
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
        name="Люди рядом"
        component={MapScreen}
        options={{
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
        name="Чаты"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          tabBarBadge: 3, // Показываем количество непрочитанных сообщений
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
  );
} 