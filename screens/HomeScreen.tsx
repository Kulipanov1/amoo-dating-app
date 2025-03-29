import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, RefreshControl, ScrollView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hapticFeedback } from '../utils/haptics';
import Skeleton from '../components/Skeleton';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface User {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
}

const dummyUsers: User[] = [
  {
    id: 1,
    name: 'Анна',
    age: 25,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Люблю путешествия и фотографию'
  },
  {
    id: 2,
    name: 'Михаил',
    age: 28,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    bio: 'Занимаюсь спортом, ищу активную девушку'
  },
  {
    id: 3,
    name: 'Елена',
    age: 24,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio: 'Обожаю музыку и искусство'
  }
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setIsLoading(false);
      setUsers(dummyUsers);
    }, 2000);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Имитация обновления данных
    setTimeout(() => {
      setUsers(dummyUsers);
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSwipe = (direction: 'left' | 'right', cardIndex: number) => {
    hapticFeedback.medium();
    if (direction === 'right') {
      console.log('Нравится', cardIndex);
    } else {
      console.log('Не нравится', cardIndex);
    }
  };

  const renderCard = (user: User) => {
    return (
      <Animated.View 
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.card}
      >
        <Image
          source={{ uri: user.image }}
          style={styles.cardImage}
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{user.name}, {user.age}</Text>
          <Text style={styles.cardDescription}>{user.bio}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.cardContainer}>
      <Skeleton width={SCREEN_WIDTH * 0.9} height={SCREEN_HEIGHT * 0.7} borderRadius={20} />
      <View style={styles.skeletonTextContainer}>
        <Skeleton width={200} height={24} style={styles.skeletonTitle} />
        <Skeleton width={150} height={16} style={styles.skeletonDescription} />
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {isLoading ? (
        renderSkeleton()
      ) : (
        <View style={styles.swiperContainer}>
          <Swiper
            cards={users}
            renderCard={renderCard}
            onSwipedLeft={(cardIndex) => handleSwipe('left', cardIndex)}
            onSwipedRight={(cardIndex) => handleSwipe('right', cardIndex)}
            cardIndex={0}
            backgroundColor={'#F5F5F5'}
            stackSize={3}
            cardStyle={styles.cardContainer}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            overlayLabels={{
              left: {
                title: 'НЕТ',
                style: {
                  label: {
                    backgroundColor: '#FF4B4B',
                    color: '#fff',
                    fontSize: 24,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }
                }
              },
              right: {
                title: 'ДА',
                style: {
                  label: {
                    backgroundColor: '#8A2BE2',
                    color: '#fff',
                    fontSize: 24,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }
                }
              }
            }}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  swiperContainer: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.8,
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    marginTop: 20,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  cardImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover'
  },
  cardText: {
    padding: 15
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardDescription: {
    fontSize: 16,
    color: '#666'
  },
  skeletonTextContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 10,
  },
  skeletonTitle: {
    marginBottom: 10,
  },
  skeletonDescription: {
    opacity: 0.7,
  }
}); 