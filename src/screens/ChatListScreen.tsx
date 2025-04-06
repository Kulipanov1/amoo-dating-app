import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ChatService, { Chat, Message } from '../services/ChatService';
import { auth } from '../config/firebase';

type RootStackParamList = {
  Chat: { chatId: string; otherUserId: string };
  NewChat: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ChatListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
    const unsubscribe = ChatService.onChatUpdated(
      auth.currentUser?.uid || '',
      handleChatUpdate
    );
    return () => unsubscribe();
  }, []);

  const loadChats = async () => {
    try {
      const userChats = await ChatService.getUserChats(auth.currentUser?.uid || '');
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatUpdate = (chat: Chat) => {
    setChats(prevChats => {
      const index = prevChats.findIndex(c => c.id === chat.id);
      if (index === -1) {
        return [...prevChats, chat];
      }
      const newChats = [...prevChats];
      newChats[index] = chat;
      return newChats;
    });
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUserId = item.participants.find(
      (id: string) => id !== auth.currentUser?.uid
    );
    const unreadCount = item.unreadCount[auth.currentUser?.uid || ''] || 0;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('Chat', {
            chatId: item.id,
            otherUserId: otherUserId || '',
          })
        }
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: `https://ui-avatars.com/api/?name=${otherUserId}` }}
            style={styles.avatar}
            resizeMode="cover"
          />
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{otherUserId}</Text>
            <Text style={styles.time}>
              {formatTimestamp(item.lastMessage?.timestamp || new Date())}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.content || 'Нет сообщений'}
            </Text>
            <MaterialIcons
              name={unreadCount > 0 ? 'done' : 'done-all'}
              size={16}
              color={unreadCount > 0 ? '#666' : '#4CAF50'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Чаты</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => navigation.navigate('NewChat')}
        >
          <MaterialIcons name="chat" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  newChatButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4081',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  chatFooter: {
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
});

export default ChatListScreen; 