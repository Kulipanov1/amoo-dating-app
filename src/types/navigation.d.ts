import { RouteProp, NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Chat: NavigatorScreenParams<ChatStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Streams: NavigatorScreenParams<StreamsStackParamList>;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: {
    chatId: string;
    otherUserId: string;
    userName: string;
  };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  SwipeCard: undefined;
};

export type StreamsStackParamList = {
  Streams: undefined;
  Stream: { streamId: string };
};

export type ChatScreenProps = {
  route: {
    params: {
      chatId: string;
      otherUserId: string;
      userName: string;
    };
  };
  navigation: any;
};

export type SingleChatScreenProps = {
  navigation: StackNavigationProp<ChatStackParamList, 'SingleChat'>;
  route: RouteProp<ChatStackParamList, 'SingleChat'>;
};

export type ChatRoomScreenProps = {
  navigation: StackNavigationProp<ChatStackParamList, 'ChatRoom'>;
  route: RouteProp<ChatStackParamList, 'ChatRoom'>;
};

export type HomeScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'Home'>;
  route: RouteProp<HomeStackParamList, 'Home'>;
};

export type MapScreenProps = {
  navigation: StackNavigationProp<HomeStackParamList, 'Map'>;
  route: RouteProp<HomeStackParamList, 'Map'>;
};

export type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

export type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
  route: RouteProp<ProfileStackParamList, 'Profile'>;
};

export type StreamsScreenProps = {
  navigation: StackNavigationProp<StreamsStackParamList, 'Streams'>;
  route: RouteProp<StreamsStackParamList, 'Streams'>;
};

export type LiveScreenProps = {
  navigation: StackNavigationProp<StreamsStackParamList, 'Live'>;
  route: RouteProp<StreamsStackParamList, 'Live'>;
}; 