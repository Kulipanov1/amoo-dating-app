import React from 'react';
import { Platform } from 'react-native';
import WebApp from './src/screens/WebApp';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Define types for navigation
type RootTabParamList = {
  Знакомства: undefined;
  Карта: undefined;
  Эфир: undefined;
  Чаты: undefined;
  Профиль: undefined;
};

type TabScreenProps = BottomTabScreenProps<RootTabParamList>;

// Only import mobile components if not on web
let MobileApp: React.FC | null = null;
if (Platform.OS !== 'web') {
  const { NavigationContainer } = require('@react-navigation/native');
  const { createBottomTabNavigator } = require('@react-navigation/bottom-tabs');
  const { GestureHandlerRootView } = require('react-native-gesture-handler');
  const Ionicons = require('@expo/vector-icons/Ionicons').default;
  
  const SwipeScreen = require('./src/screens/SwipeScreen').default;
  const MapScreen = require('./src/screens/MapScreen').default;
  const LiveScreen = require('./src/screens/LiveScreen').default;
  const ChatScreen = require('./src/screens/ChatScreen').default;
  const ProfileScreen = require('./src/screens/ProfileScreen').default;

  const Tab = createBottomTabNavigator<RootTabParamList>();

  MobileApp = () => (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }: TabScreenProps) => ({
            tabBarIcon: ({ focused, color, size }: {
              focused: boolean;
              color: string;
              size: number;
            }) => {
              let iconName: string;

              switch (route.name) {
                case 'Знакомства':
                  iconName = focused ? 'heart' : 'heart-outline';
                  break;
                case 'Карта':
                  iconName = focused ? 'map' : 'map-outline';
                  break;
                case 'Эфир':
                  iconName = focused ? 'radio' : 'radio-outline';
                  break;
                case 'Чаты':
                  iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                  break;
                case 'Профиль':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
                default:
                  iconName = 'help-outline';
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
          <Tab.Screen name="Знакомства" component={SwipeScreen} />
          <Tab.Screen name="Карта" component={MapScreen} />
          <Tab.Screen name="Эфир" component={LiveScreen} />
          <Tab.Screen name="Чаты" component={ChatScreen} />
          <Tab.Screen name="Профиль" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const App = () => {
  if (!MobileApp || Platform.OS === 'web') {
    return <WebApp />;
  }
  return <MobileApp />;
};

export default App; 