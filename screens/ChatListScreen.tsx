import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { hapticFeedback } from '../utils/haptics';

interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  lastOnline: string;
  isMuted: boolean;
}

const dummyChats: ChatPreview[] = [
  {
    id: '1',
    name: 'Анна',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastMessage: 'Привет! Как дела?',
    timestamp: '14:30',
    unreadCount: 2,
    isOnline: true,
    isPinned: true,
    lastOnline: 'Онлайн',
    isMuted: false,
  },
  {
    id: '2',
    name: 'Михаил',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    lastMessage: 'Давай встретимся завтра',
    timestamp: 'Вчера',
    unreadCount: 0,
    isOnline: false,
    isPinned: true,
    lastOnline: '3 часа назад',
    isMuted: true,
  },
  // Добавьте больше чатов здесь
];

export default function ChatListScreen() {
  const navigation = useNavigation();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });

    // Имитация загрузки чатов
    const timer = setTimeout(() => {
      setChats(dummyChats);
    }, 1000);

    return () => {
      subscription?.remove();
      clearTimeout(timer);
    };
  }, []);

  const handleChatPress = (chat: ChatPreview) => {
    hapticFeedback.light();
    navigation.navigate('Chat', { chatId: chat.id });
  };

  const handleLongPress = (chat: ChatPreview) => {
    hapticFeedback.medium();
    // Показать меню действий (закрепить, отключить уведомления и т.д.)
  };

  const isDesktop = windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => handleChatPress(item)}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <View style={styles.chatMeta}>
            {item.isMuted && (
              <Ionicons name="volume-mute" size={16} color="#666" style={styles.mutedIcon} />
            )}
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>

        <View style={styles.lastMessageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
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
    <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
      <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
        <View style={[styles.mainContent, isDesktop && { width: contentWidth }]}>
          <View style={styles.header}>
            <Text style={styles.logoText}>Amoo</Text>
          </View>

          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.chatList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  desktopSafeArea: {
    backgroundColor: '#8A2BE2',
  },
  wrapper: {
    flex: 1,
  },
  desktopWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F8F4FF',
    ...(Platform.OS === 'web' ? {
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    } : {}),
  },
  header: {
    height: 56,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
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
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mutedIcon: {
    marginRight: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#8A2BE2',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 