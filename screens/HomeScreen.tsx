import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, RefreshControl, ScrollView, Animated as RNAnimated } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hapticFeedback } from '../utils/haptics';
import Skeleton from '../components/Skeleton';

interface User {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
  interests: string[];
  location: string;
  occupation: string;
}

const dummyUsers: User[] = [
  {
    id: 1,
    name: 'Анна',
    age: 25,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Люблю путешествия и фотографию',
    interests: ['Путешествия', 'Фотография', 'Искусство', 'Музыка'],
    location: 'Москва',
    occupation: 'Фотограф'
  },
  {
    id: 2,
    name: 'Михаил',
    age: 28,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    bio: 'Занимаюсь спортом, ищу активную девушку',
    interests: ['Спорт', 'Путешествия', 'Кулинария', 'Кино'],
    location: 'Санкт-Петербург',
    occupation: 'Тренер'
  },
  {
    id: 3,
    name: 'Елена',
    age: 24,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio: 'Обожаю музыку и искусство',
    interests: ['Музыка', 'Искусство', 'Театр', 'Литература'],
    location: 'Москва',
    occupation: 'Дизайнер'
  }
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [lastSwipe, setLastSwipe] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUsers(dummyUsers);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      setUsers(dummyUsers);
      setRefreshing(false);
      setCurrentIndex(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up', cardIndex: number) => {
    hapticFeedback.medium();
    if (direction === 'up') {
      setExpandedCard(prev => prev === cardIndex ? null : cardIndex);
    } else {
      console.log(direction === 'right' ? 'Нравится' : 'Не нравится', cardIndex);
    }
  }, []);

  const handleSwiping = useCallback((x: number, y: number) => {
    setLastSwipe({ x, y });
  }, []);

  const handleSwiped = useCallback((cardIndex: number) => {
    const { x, y } = lastSwipe;
    if (Math.abs(x) < 5 && Math.abs(y) < 5) return;
    const direction = Math.abs(y) > Math.abs(x) ? 'up' : x > 0 ? 'right' : 'left';
    handleSwipe(direction, cardIndex);
    setCurrentIndex(cardIndex + 1);
  }, [lastSwipe, handleSwipe]);

  const renderCard = useCallback((user: User, cardIndex: number) => {
    if (!user) return null;
    
    const isExpanded = expandedCard === cardIndex;
    const cardHeight = isExpanded ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7;
    
    return (
      <View style={[
        styles.card,
        {
          height: cardHeight,
          transform: [
            { translateY: isExpanded ? -20 : 0 }
          ]
        }
      ]}>
        <Image
          source={{ uri: user.image }}
          style={styles.cardImage}
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{user.name}, {user.age}</Text>
          <Text style={styles.cardDescription}>{user.bio}</Text>
          {isExpanded && (
            <View style={styles.expandedContent}>
              <Text style={styles.expandedText}>📍 {user.location}</Text>
              <Text style={styles.expandedText}>💼 {user.occupation}</Text>
              <Text style={styles.interestsTitle}>Интересы:</Text>
              <View style={styles.interestsContainer}>
                {user.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }, [expandedCard]);

  const renderSkeleton = useCallback(() => (
    <View style={styles.cardContainer}>
      <Skeleton width={SCREEN_WIDTH * 0.9} height={SCREEN_HEIGHT * 0.7} borderRadius={20} />
      <View style={styles.skeletonTextContainer}>
        <Skeleton width={200} height={24} style={styles.skeletonTitle} />
        <Skeleton width={150} height={16} style={styles.skeletonDescription} />
      </View>
    </View>
  ), []);

  if (isLoading) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderSkeleton()}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        renderCard={(card) => renderCard(card, users.indexOf(card))}
        onSwipedLeft={(cardIndex: number) => handleSwipe('left', cardIndex)}
        onSwipedRight={(cardIndex: number) => handleSwipe('right', cardIndex)}
        onSwiped={handleSwiped}
        cardIndex={currentIndex}
        backgroundColor={'#F5F5F5'}
        stackSize={3}
        cardStyle={styles.cardContainer}
        animateCardOpacity
        swipeBackCard
        verticalSwipe={true}
        horizontalSwipe={true}
        cardVerticalMargin={0}
        cardHorizontalMargin={0}
        overlayLabels={{
          left: {
            title: '',
            style: {
              container: {
                backgroundColor: 'transparent',
              }
            }
          },
          right: {
            title: '',
            style: {
              container: {
                backgroundColor: 'transparent',
              }
            }
          }
        }}
        onSwiping={handleSwiping}
      />
    </View>
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
    padding: 15,
    flex: 1
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10
  },
  expandedContent: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10
  },
  expandedText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  interestTag: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4
  },
  interestText: {
    color: 'white',
    fontSize: 14
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