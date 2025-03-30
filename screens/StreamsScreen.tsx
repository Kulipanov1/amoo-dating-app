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

interface Stream {
  id: string;
  title: string;
  streamer: {
    id: string;
    name: string;
    avatar: string;
  };
  thumbnail: string;
  viewers: number;
  isLive: boolean;
  tags: string[];
}

const dummyStreams: Stream[] = [
  {
    id: '1',
    title: 'Утренняя йога для начинающих',
    streamer: {
      id: '1',
      name: 'Анна',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    viewers: 156,
    isLive: true,
    tags: ['Йога', 'Фитнес', 'Здоровье'],
  },
  {
    id: '2',
    title: 'Готовим вместе: итальянская кухня',
    streamer: {
      id: '2',
      name: 'Михаил',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
    thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
    viewers: 89,
    isLive: true,
    tags: ['Кулинария', 'Италия', 'Еда'],
  },
];

export default function StreamsScreen() {
  const navigation = useNavigation();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });

    // Имитация загрузки стримов
    const timer = setTimeout(() => {
      setStreams(dummyStreams);
    }, 1000);

    return () => {
      subscription?.remove();
      clearTimeout(timer);
    };
  }, []);

  const handleStreamPress = (stream: Stream) => {
    hapticFeedback.light();
    // Навигация к стриму
    console.log('Opening stream:', stream.id);
  };

  const isDesktop = windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderStreamItem = ({ item }: { item: Stream }) => (
    <TouchableOpacity
      style={styles.streamItem}
      onPress={() => handleStreamPress(item)}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        {item.isLive && (
          <View style={styles.liveIndicator}>
            <Text style={styles.liveText}>LIVE</Text>
            <Text style={styles.viewersText}>
              <Ionicons name="eye" size={12} color="white" />
              {' '}
              {formatViewers(item.viewers)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.streamInfo}>
        <View style={styles.streamerInfo}>
          <Image source={{ uri: item.streamer.avatar }} style={styles.streamerAvatar} />
          <Text style={styles.streamerName}>{item.streamer.name}</Text>
        </View>

        <Text style={styles.streamTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
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
            data={streams}
            renderItem={renderStreamItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.streamsList}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity style={styles.startStreamButton}>
            <Ionicons name="videocam" size={24} color="white" />
            <Text style={styles.startStreamText}>Начать стрим</Text>
          </TouchableOpacity>
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
  streamsList: {
    padding: 16,
  },
  streamItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 8,
  },
  viewersText: {
    color: 'white',
    fontSize: 12,
  },
  streamInfo: {
    padding: 12,
  },
  streamerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streamerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  streamerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#8A2BE2',
    fontSize: 12,
  },
  startStreamButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startStreamText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 