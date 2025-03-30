import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, RefreshControl, ScrollView, Platform, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hapticFeedback } from '../utils/haptics';
import Skeleton from '../components/Skeleton';
import { Ionicons } from '@expo/vector-icons';

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

// Определяем размеры карточки в зависимости от устройства
const isWeb = Platform.OS === 'web';
const isMobile = SCREEN_WIDTH < 768;

const CARD_DIMENSIONS = {
  width: isMobile ? SCREEN_WIDTH : Math.min(SCREEN_WIDTH * 0.7, 600),
  height: isMobile ? SCREEN_HEIGHT * 0.8 : Math.min(SCREEN_HEIGHT * 0.8, 800),
  expandedHeight: isMobile ? SCREEN_HEIGHT * 0.9 : Math.min(SCREEN_HEIGHT * 0.9, 900)
};

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [lastSwipe, setLastSwipe] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [borderColor, setBorderColor] = useState('#E8E8E8');
  const [borderWidth, setBorderWidth] = useState(2);
  const [glowColor, setGlowColor] = useState('transparent');
  const [glowIntensity, setGlowIntensity] = useState(0);

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
    if (Math.abs(x) > Math.abs(y)) {
      const color = x > 0 ? '#8A2BE2' : x < 0 ? '#FF4B4B' : 'transparent';
      setGlowColor(color);
      setGlowIntensity(0.3);
    } else if (y < 0) { // Свайп вверх
      setGlowColor('#4CAF50');
      setGlowIntensity(0.3);
    }
  }, []);

  const handleSwiped = useCallback((cardIndex: number) => {
    const { x, y } = lastSwipe;
    if (Math.abs(x) < 5 && Math.abs(y) < 5) return;
    const direction = Math.abs(y) > Math.abs(x) ? 'up' : x > 0 ? 'right' : 'left';
    handleSwipe(direction, cardIndex);
    setCurrentIndex(cardIndex + 1);
    setGlowColor('transparent');
    setGlowIntensity(0);
    setBorderColor('#E8E8E8');
    setBorderWidth(2);
  }, [lastSwipe, handleSwipe]);

  const handleLike = useCallback(() => {
    if (currentIndex < users.length) {
      hapticFeedback.medium();
      setGlowColor('#8A2BE2');
      setGlowIntensity(0.3);
      setTimeout(() => {
        handleSwipe('right', currentIndex);
      }, 200);
    }
  }, [currentIndex, users.length, handleSwipe]);

  const handleDislike = useCallback(() => {
    if (currentIndex < users.length) {
      hapticFeedback.medium();
      setGlowColor('#FF4B4B');
      setGlowIntensity(0.3);
      setTimeout(() => {
        handleSwipe('left', currentIndex);
      }, 200);
    }
  }, [currentIndex, users.length, handleSwipe]);

  const handleSuperLike = useCallback(() => {
    if (currentIndex < users.length) {
      hapticFeedback.medium();
      setGlowColor('#4CAF50');
      setGlowIntensity(0.3);
      setTimeout(() => {
        handleSwipe('up', currentIndex);
      }, 200);
    }
  }, [currentIndex, users.length, handleSwipe]);

  const handleRewind = useCallback(() => {
    if (currentIndex > 0) {
      hapticFeedback.medium();
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const renderCard = useCallback((user: User, cardIndex: number) => {
    if (!user) return null;
    
    const isExpanded = expandedCard === cardIndex;
    const cardHeight = isExpanded ? CARD_DIMENSIONS.expandedHeight : CARD_DIMENSIONS.height;
    
    return (
      <View style={[
        styles.card,
        {
          height: cardHeight,
          width: CARD_DIMENSIONS.width,
          transform: [
            { translateY: isExpanded ? -20 : 0 }
          ],
        }
      ]}>
        <View style={[styles.imageContainer, { height: cardHeight * 0.7 }]}>
          <Image
            source={{ uri: user.image }}
            style={styles.cardImage}
          />
          <View style={[
            styles.imageTint,
            {
              backgroundColor: glowColor,
              opacity: glowIntensity,
            }
          ]} />
        </View>
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
  }, [expandedCard, glowColor, glowIntensity]);

  const renderSkeleton = useCallback(() => (
    <View style={[styles.cardContainer, { width: CARD_DIMENSIONS.width }]}>
      <Skeleton width={CARD_DIMENSIONS.width} height={CARD_DIMENSIONS.height} borderRadius={20} />
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
        contentContainerStyle={styles.scrollContent}
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
      <View style={styles.swiperWrapper}>
        <Swiper
          cards={users}
          renderCard={(card) => renderCard(card, users.indexOf(card))}
          onSwipedLeft={(cardIndex: number) => handleSwipe('left', cardIndex)}
          onSwipedRight={(cardIndex: number) => handleSwipe('right', cardIndex)}
          onSwipedTop={(cardIndex: number) => handleSwipe('up', cardIndex)}
          onSwiped={handleSwiped}
          cardIndex={currentIndex}
          backgroundColor={'#F5F5F5'}
          stackSize={3}
          cardStyle={[styles.cardContainer, { width: CARD_DIMENSIONS.width }]}
          animateCardOpacity
          swipeBackCard
          verticalSwipe={true}
          horizontalSwipe={true}
          cardVerticalMargin={10}
          cardHorizontalMargin={0}
          disableBottomSwipe={true}
          swipeAnimationDuration={350}
          horizontalThreshold={80}
          verticalThreshold={80}
          outputRotationRange={['0deg', '0deg', '0deg']}
          overlayLabels={{}}
          onSwiping={handleSwiping}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(138, 43, 226, 0.1)' }]} 
            onPress={handleRewind}
          >
            <Ionicons name="arrow-undo" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(138, 43, 226, 0.1)' }]} 
            onPress={handleDislike}
          >
            <Ionicons name="close" size={28} color="#FF4B4B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(138, 43, 226, 0.1)' }]} 
            onPress={handleLike}
          >
            <Ionicons name="heart" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(138, 43, 226, 0.1)' }]} 
            onPress={handleSuperLike}
          >
            <Ionicons name="flame" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  swiperWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80, // Место для кнопок
  },
  cardContainer: {
    alignSelf: 'center',
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageContainer: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardText: {
    padding: isMobile ? 15 : 20,
    flex: 1
  },
  cardTitle: {
    fontSize: isMobile ? 24 : 28,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardDescription: {
    fontSize: isMobile ? 16 : 18,
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
    fontSize: isMobile ? 16 : 18,
    color: '#666',
    marginBottom: 5
  },
  interestsTitle: {
    fontSize: isMobile ? 18 : 20,
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
    fontSize: isMobile ? 14 : 16
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
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15,
  },
  actionButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8A2BE2',
    elevation: 5,
    shadowColor: '#8A2BE2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
}); 