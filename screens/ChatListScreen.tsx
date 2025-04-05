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
import AnimatedBackground from '../components/AnimatedBackground';
import { useNavigation } from '@react-navigation/native';
import { ChatScreenNavigationProp } from '../types/navigation';

type RootStackParamList = {
  ChatList: undefined;
  Chat: {
    userId: string;
    userName: string;
    userAvatar: string;
  };
  Profile: {
    userId: string;
  };
};

type Props = StackScreenProps<RootStackParamList, 'ChatList'>;

interface ChatItem {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: {
    text: string;
    timestamp: number;
    unread: boolean;
  };
}

const dummyChats: ChatItem[] = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Анна Иванова',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    lastMessage: {
      text: 'Привет! Как дела?',
      timestamp: Date.now() - 5 * 60 * 1000,
      unread: true,
    },
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Мария Петрова',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
    lastMessage: {
      text: 'Отличная фотография!',
      timestamp: Date.now() - 60 * 60 * 1000,
      unread: false,
    },
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Дмитрий Соколов',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    lastMessage: {
      text: 'Где встретимся?',
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      unread: false,
    },
  },
];

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { width: windowWidth } = Dimensions.get('window');
  const isDesktop = Platform.OS === 'web' && windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));

    if (minutes < 60) {
      return `${minutes} мин`;
    } else if (hours < 24) {
      return `${hours} ч`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('Chat', {
        userId: item.user.id,
        userName: item.user.name,
        userAvatar: item.user.avatar,
      })}
    >
      <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timeStamp}>{formatTimestamp(item.lastMessage.timestamp)}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage.text}
        </Text>
      </View>
      {item.lastMessage.unread && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>1</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AnimatedBackground />
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
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScreenWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    width: '100%',
    maxWidth: 600,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
    minHeight: 60,
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
  timeStamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginRight: 40,
    lineHeight: 20,
  },
  unreadBadge: {
    position: 'absolute',
    right: 0,
    top: '50%',
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChatListScreen; 