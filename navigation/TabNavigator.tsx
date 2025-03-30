import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { HomeIcon, HeartIcon, MessageIcon, ProfileIcon, StreamIcon } from '../components/Icons';

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

const TabNavigator = () => {
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: '#FF4B6E',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
            title: 'Главная'
          }}
        />
        <Tab.Screen
          name="StreamsTab"
          component={StreamsStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <StreamIcon color={color} size={size} />,
            title: 'Стримы'
          }}
        />
        <Tab.Screen
          name="ChatTab"
          component={ChatStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <MessageIcon color={color} size={size} />,
            title: 'Чаты'
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
            title: 'Профиль'
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
}); 