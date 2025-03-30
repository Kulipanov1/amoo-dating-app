import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SectionList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function ChatScreen() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'online'>('all');

  useEffect(() => {
    // Имитация загрузки чатов
    setTimeout(() => {
      setChats(dummyChats);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getSections = () => {
    let filteredChats = chats;

    // Применяем фильтры
    switch (activeFilter) {
      case 'unread':
        filteredChats = chats.filter(chat => chat.unreadCount > 0);
        break;
      case 'online':
        filteredChats = chats.filter(chat => chat.isOnline);
        break;
    }

    // Фильтруем по поиску
    filteredChats = filteredChats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Группируем чаты
    const pinnedChats = filteredChats.filter(chat => chat.isPinned);
    const regularChats = filteredChats.filter(chat => !chat.isPinned);

    const sections = [];
    
    if (pinnedChats.length > 0) {
      sections.push({
        title: 'Закрепленные',
        data: pinnedChats,
      });
    }
    
    if (regularChats.length > 0) {
      sections.push({
        title: 'Все чаты',
        data: regularChats,
      });
    }

    return sections;
  };

  const handleChatPress = (chat: ChatPreview) => {
    hapticFeedback.light();
    // Навигация к чату
    console.log('Opening chat:', chat.id);
  };

  const handleLongPress = (chat: ChatPreview) => {
    hapticFeedback.medium();
    // Показать меню действий (закрепить, отключить уведомления и т.д.)
    console.log('Long press on chat:', chat.id);
  };

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
        <Text style={styles.lastOnline}>{item.lastOnline}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <TouchableOpacity 
        style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
        onPress={() => setActiveFilter('all')}
      >
        <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
          Все
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.filterButton, activeFilter === 'unread' && styles.activeFilter]}
        onPress={() => setActiveFilter('unread')}
      >
        <Text style={[styles.filterText, activeFilter === 'unread' && styles.activeFilterText]}>
          Непрочитанные
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.filterButton, activeFilter === 'online' && styles.activeFilter]}
        onPress={() => setActiveFilter('online')}
      >
        <Text style={[styles.filterText, activeFilter === 'online' && styles.activeFilterText]}>
          Онлайн
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {renderFilters()}
      <SectionList
        sections={getSections()}
        renderItem={renderChatItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'white',
  },
  activeFilter: {
    backgroundColor: '#8A2BE2',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilterText: {
    color: 'white',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
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
  lastOnline: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
}); 