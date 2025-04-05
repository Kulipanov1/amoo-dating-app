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
  Chat: { userName: string; userId: string };
  SingleChat: { chatId: string; user: { id: string; name: string; avatar: string } };
  ChatRoom: { chatId: string; userName: string; userAvatar: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Map: undefined;
};

export type StreamsStackParamList = {
  Streams: undefined;
  Live: undefined;
};

export type ChatScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'Chat'>;
export type ChatScreenRouteProp = RouteProp<ChatStackParamList, 'Chat'>;

export type ChatScreenProps = {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
};

export type SingleChatScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'SingleChat'>;
export type SingleChatScreenRouteProp = RouteProp<ChatStackParamList, 'SingleChat'>;

export type SingleChatScreenProps = {
  navigation: SingleChatScreenNavigationProp;
  route: SingleChatScreenRouteProp;
};

export type ChatRoomScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'ChatRoom'>;
export type ChatRoomScreenRouteProp = RouteProp<ChatStackParamList, 'ChatRoom'>;

export type ChatRoomScreenProps = {
  navigation: ChatRoomScreenNavigationProp;
  route: ChatRoomScreenRouteProp;
}; 