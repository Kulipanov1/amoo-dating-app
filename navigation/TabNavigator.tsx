import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalization } from '../src/contexts/LocalizationContext';
import { StackNavigationOptions } from '@react-navigation/stack';
import {
  RootStackParamList,
  ChatStackParamList,
  ProfileStackParamList,
  HomeStackParamList,
  StreamsStackParamList,
  ChatScreenProps,
  SingleChatScreenProps,
  ChatRoomScreenProps,
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

const screenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  headerTintColor: '#333',
  headerTitleStyle: {
    fontWeight: '600' as TextStyle['fontWeight'],
  },
  headerBackTitleVisible: false,
  headerBackImage: () => (
    <Ionicons name="chevron-back" size={24} color="#333" style={{ marginLeft: 10 }} />
  ),
};

const ChatStackNavigator = () => {
  const { t } = useLocalization();
  return (
    <ChatStack.Navigator screenOptions={screenOptions}>
      <ChatStack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen as React.ComponentType<ChatScreenProps>}
        options={({ route }) => ({
          title: route.params?.userName || t('chat.title'),
        })}
      />
      <ChatStack.Screen
        name="SingleChat"
        component={SingleChatScreen as React.ComponentType<SingleChatScreenProps>}
        options={{ title: t('chat.title') }}
      />
      <ChatStack.Screen
        name="ChatRoom"
        component={ChatRoomScreen as React.ComponentType<ChatRoomScreenProps>}
        options={{ title: t('chat.title') }}
      />
    </ChatStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  const { t } = useLocalization();
  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
};

const HomeStackNavigator = () => {
  const { t } = useLocalization();
  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: t('common.map') }}
      />
    </HomeStack.Navigator>
  );
};

const StreamsStackNavigator = () => {
  const { t } = useLocalization();
  return (
    <StreamsStack.Navigator screenOptions={screenOptions}>
      <StreamsStack.Screen
        name="Streams"
        component={StreamsScreen}
        options={{ headerShown: false }}
      />
      <StreamsStack.Screen
        name="Live"
        component={LiveScreen}
        options={{ title: t('streams.goLive') }}
      />
    </StreamsStack.Navigator>
  );
};

const TabNavigator = () => {
  const { t } = useLocalization();

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ChatTab') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'StreamsTab') {
              iconName = focused ? 'videocam' : 'videocam-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'person' : 'person-outline';
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
          options={{ title: t('common.home') }}
        />
        <Tab.Screen
          name="ChatTab"
          component={ChatStackNavigator}
          options={{ title: t('common.chats') }}
        />
        <Tab.Screen
          name="StreamsTab"
          component={StreamsStackNavigator}
          options={{ title: t('common.streams') }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{ title: t('common.profile') }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default TabNavigator; 