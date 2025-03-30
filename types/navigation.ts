export type ChatStackParamList = {
  ChatList: undefined;
  Chat: {
    userId: string;
    userName: string;
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

export type TabParamList = {
  HomeTab: undefined;
  StreamsTab: undefined;
  ProfileTab: undefined;
  ChatTab: undefined;
}; 