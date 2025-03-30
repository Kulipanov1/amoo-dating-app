import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import StreamsScreen from '../screens/StreamsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#E3D3FF',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Знакомства',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="People"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Люди рядом',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Streams"
        component={StreamsScreen}
        options={{
          tabBarLabel: 'Эфиры',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="videocam" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatStack}
        options={{
          tabBarLabel: 'Чаты',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
} 