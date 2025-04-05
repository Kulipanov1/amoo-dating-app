import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  HomeTab: undefined;
  ChatTab: undefined;
  StreamsTab: undefined;
  ProfileTab: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  Chat: { userName: string };
  SingleChat: undefined;
  ChatRoom: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Map: undefined;
};

export type StreamsStackParamList = {
  Streams: undefined;
  Live: undefined;
};

export type ChatScreenProps = {
  navigation: StackNavigationProp<ChatStackParamList, 'Chat'>;
  route: RouteProp<ChatStackParamList, 'Chat'>;
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

export type ProfileScreenProps = {
  navigation: StackNavigationProp<ProfileStackParamList, 'Profile'>;
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