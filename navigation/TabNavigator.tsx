import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import ProfileScreen from '../screens/ProfileScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import HomeScreen from '../screens/HomeScreen';
import StreamsScreen from '../screens/StreamsScreen';
import SingleChatScreen from '../screens/SingleChatScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import LiveScreen from '../screens/LiveScreen';
import MapScreen from '../screens/MapScreen';
import AnimatedBackground from '../components/AnimatedBackground';
import {
  ChatStackParamList,
  ProfileStackParamList,
  HomeStackParamList,
  StreamsStackParamList,
  TabParamList,
} from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();
const ChatStack = createStackNavigator<ChatStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const StreamsStack = createStackNavigator<StreamsStackParamList>();

const ChatStackNavigator = () => (
  <ChatStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E3D3FF',
      },
      headerTintColor: '#333',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <ChatStack.Screen
      name="ChatList"
      component={ChatListScreen}
      options={{ title: 'Чаты' }}
    />
    <ChatStack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({
        title: route.params.userName,
      })}
    />
    <ChatStack.Screen
      name="SingleChat"
      component={SingleChatScreen}
      options={{ title: 'Чат' }}
    />
    <ChatStack.Screen
      name="ChatRoom"
      component={ChatRoomScreen}
      options={{ title: 'Комната' }}
    />
  </ChatStack.Navigator>
);

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E3D3FF',
      },
      headerTintColor: '#333',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <ProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Профиль' }}
    />
  </ProfileStack.Navigator>
);

const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E3D3FF',
      },
      headerTintColor: '#333',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="Map"
      component={MapScreen}
      options={{ title: 'Карта' }}
    />
  </HomeStack.Navigator>
);

const StreamsStackNavigator = () => (
  <StreamsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E3D3FF',
      },
      headerTintColor: '#333',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <StreamsStack.Screen
      name="Streams"
      component={StreamsScreen}
      options={{ title: 'Стримы' }}
    />
    <StreamsStack.Screen
      name="Live"
      component={LiveScreen}
      options={{ title: 'Прямой эфир' }}
    />
  </StreamsStack.Navigator>
);

export default function TabNavigator() {
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'StreamsTab') {
              iconName = focused ? 'videocam' : 'videocam-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'ChatTab') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E3D3FF',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{ title: 'Главная' }}
        />
        <Tab.Screen
          name="StreamsTab"
          component={StreamsStackNavigator}
          options={{ title: 'Стримы' }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{ title: 'Профиль' }}
        />
        <Tab.Screen
          name="ChatTab"
          component={ChatStackNavigator}
          options={{ title: 'Чаты' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
}); 