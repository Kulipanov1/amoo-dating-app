import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StreamScreen from '../screens/StreamScreen';
import LiveScreen from '../screens/LiveScreen';
import { useLocalization } from '../hooks/useLocalization';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const StreamsStack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: '#8A2BE2',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const TabNavigator = () => {
  const { t } = useLocalization();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'favorite' : 'favorite-outline';
              break;
            case 'ChatTab':
              iconName = focused ? 'chat' : 'chat-outline';
              break;
            case 'StreamsTab':
              iconName = focused ? 'live-tv' : 'live-tv';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator}
        options={{ 
          title: t('navigation.home'),
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name="ChatTab" 
        component={ChatStackNavigator}
        options={{ 
          title: t('navigation.chat'),
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name="StreamsTab" 
        component={StreamsStackNavigator}
        options={{ 
          title: t('navigation.streams'),
          headerShown: false 
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStackNavigator}
        options={{ 
          title: t('navigation.profile'),
          headerShown: false 
        }}
      />
    </Tab.Navigator>
  );
};

// ... rest of the code ... 