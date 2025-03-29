import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container}>
      <FlatList
        data={DUMMY_STREAMS}
        renderItem={renderStreamItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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