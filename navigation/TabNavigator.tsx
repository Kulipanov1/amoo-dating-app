import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalization } from '../src/contexts/LocalizationContext';

// Types
import {
  RootStackParamList,
  ChatStackParamList,
  ProfileStackParamList,
  HomeStackParamList,
  StreamsStackParamList,
} from '../src/types/navigation';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import StreamsScreen from '../screens/StreamsScreen';
import SingleChatScreen from '../screens/SingleChatScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import LiveScreen from '../screens/LiveScreen';
import MapScreen from '../screens/MapScreen';

// Components
import AnimatedBackground from '../components/AnimatedBackground';

const Tab = createBottomTabNavigator<RootStackParamList>();
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
      headerBackTitleVisible: false,
      headerBackImage: () => (
        <Ionicons name="chevron-back" size={24} color="#333" style={{ marginLeft: 10 }} />
      ),
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
        title: route.params?.userName || 'Чат',
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
      headerBackTitleVisible: false,
      headerBackImage: () => (
        <Ionicons name="chevron-back" size={24} color="#333" style={{ marginLeft: 10 }} />
      ),
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
      headerBackTitleVisible: false,
      headerBackImage: () => (
        <Ionicons name="chevron-back" size={24} color="#333" style={{ marginLeft: 10 }} />
      ),
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
      headerBackTitleVisible: false,
      headerBackImage: () => (
        <Ionicons name="chevron-back" size={24} color="#333" style={{ marginLeft: 10 }} />
      ),
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
  const { t } = useLocalization();

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            switch (route.name) {
              case 'HomeTab':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'ChatTab':
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                break;
              case 'StreamsTab':
                iconName = focused ? 'videocam' : 'videocam-outline';
                break;
              case 'ProfileTab':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
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
          name="ChatTab"
          component={ChatStackNavigator}
          options={{ title: 'Чаты' }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{ title: 'Профиль' }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabNavigator; 