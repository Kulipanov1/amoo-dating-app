import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import ScreenWrapper from '../components/ScreenWrapper';

type RootStackParamList = {
  ChatList: undefined;
  Chat: {
    userId: string;
    userName: string;
  };
  Profile: {
    userId: string;
  };
};

type Props = StackScreenProps<RootStackParamList, 'ChatList'>;

interface ChatPreview {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastSeen?: Date;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount: number;
}

const dummyChats: ChatPreview[] = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Анна Иванова',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
      isOnline: true,
    },
    lastMessage: {
      text: 'Привет! Как дела?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 минут назад
      isRead: false,
    },
    unreadCount: 1,
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Мария Петрова',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3',
      isOnline: false,
      lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
    },
    lastMessage: {
      text: 'Отличная фотография!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 час назад
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: '3',
    user: {
      id: '4',
      name: 'Дмитрий Соколов',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3',
      isOnline: true,
    },
    lastMessage: {
      text: 'Где встретимся?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 часа назад
      isRead: true,
    },
    unreadCount: 0,
  },
];

export default function ChatListScreen({ navigation }: Props) {
  const { width: windowWidth } = Dimensions.get('window');
  const isDesktop = Platform.OS === 'web' && windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} мин`;
    } else if (hours < 24) {
      return `${hours} ч`;
    } else {
      return `${days} д`;
    }
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', {
        userId: item.user.id,
        userName: item.user.name,
      })}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.lastMessage.timestamp)}
          </Text>
        </View>

        <View style={styles.lastMessage}>
          <Text 
            style={[
              styles.messageText,
              !item.lastMessage.isRead && styles.unreadText
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.text}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper isDesktop={isDesktop} contentWidth={contentWidth}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Чаты</Text>
          <TouchableOpacity style={styles.newChatButton}>
            <Ionicons name="create-outline" size={24} color="#8A2BE2" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={dummyChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  newChatButton: {
    padding: 8,
  },
  chatList: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6FF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  unreadText: {
    color: '#333',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#8A2BE2',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
}); 