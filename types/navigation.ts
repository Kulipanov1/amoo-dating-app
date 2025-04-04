import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type TabParamList = {
  HomeTab: undefined;
  StreamsTab: undefined;
  ChatTab: undefined;
  ProfileTab: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: {
    userId: string;
    userName: string;
    userAvatar: string;
  };
  SingleChat: {
    chatId: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  };
  ChatRoom: {
    chatId: string;
    userName: string;
    userAvatar: string;
  };
  UserProfile: {
    userId: string;
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  EditProfile: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Map: undefined;
  UserProfile: {
    userId: string;
  };
};

export type StreamsStackParamList = {
  Streams: undefined;
  Live: {
    streamId: string;
    userName: string;
  };
};

export type ChatScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'Chat'>;
export type ChatScreenRouteProp = RouteProp<ChatStackParamList, 'Chat'>;

export type ChatScreenProps = {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
};

export type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;
export type HomeScreenRouteProp = RouteProp<HomeStackParamList, 'Home'>;

export type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}; 