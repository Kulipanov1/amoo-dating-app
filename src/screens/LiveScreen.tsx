import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StreamsStackParamList } from '../types/navigation';

type LiveScreenNavigationProp = StackNavigationProp<StreamsStackParamList, 'Live'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = (SCREEN_WIDTH - 30) / 2;

interface LiveStream {
  id: string;
  username: string;
  title: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
}

const DUMMY_STREAMS: LiveStream[] = [
  {
    id: '1',
    username: 'Анна',
    title: 'Утренняя йога 🧘‍♀️',
    viewers: 128,
    thumbnail: 'https://picsum.photos/400/300',
    isLive: true,
  },
  {
    id: '2',
    username: 'Мария',
    title: 'Готовим вместе 🍳',
    viewers: 256,
    thumbnail: 'https://picsum.photos/400/301',
    isLive: true,
  },
  {
    id: '3',
    username: 'Елена',
    title: 'Танцевальный фитнес 💃',
    viewers: 512,
    thumbnail: 'https://picsum.photos/400/302',
    isLive: true,
  },
  {
    id: '4',
    username: 'София',
    title: 'Вечерний стрим 🌙',
    viewers: 64,
    thumbnail: 'https://picsum.photos/400/303',
    isLive: true,
  },
];

const LiveScreen = () => {
  const navigation = useNavigation<LiveScreenNavigationProp>();

  const renderStreamItem = ({ item }: { item: LiveStream }) => (
    <TouchableOpacity style={styles.streamItem}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.liveIndicator}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.viewersContainer}>
          <Ionicons name="eye-outline" size={16} color="#fff" />
          <Text style={styles.viewersText}>{item.viewers}</Text>
        </View>
      </View>
      <View style={styles.streamInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Прямые эфиры</Text>
        <TouchableOpacity 
          style={styles.startStreamButton}
          onPress={() => {/* Здесь будет логика начала стрима */}}
        >
          <Ionicons name="videocam" size={24} color="#8A2BE2" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={DUMMY_STREAMS}
        renderItem={renderStreamItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  startStreamButton: {
    padding: 8,
  },
  listContainer: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  streamItem: {
    width: ITEM_WIDTH,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: ITEM_WIDTH * 0.75,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  liveIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewersContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewersText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  streamInfo: {
    padding: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#666',
  },
});

export default LiveScreen; 