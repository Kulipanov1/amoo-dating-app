import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [glowColor, setGlowColor] = useState('transparent');
  const [glowIntensity, setGlowIntensity] = useState(0);
  const swiper = useRef<any>(null);

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
      setExpandedCard(cardIndex);
    } else {
      console.log(direction === 'right' ? 'Нравится' : 'Не нравится', cardIndex);
      setCurrentIndex(cardIndex + 1);
      setExpandedCard(null);
    }
    setGlowColor('transparent');
    setGlowIntensity(0);
  }, []);

  const handleSwiping = useCallback((x: number, y: number) => {
    setLastSwipe({ x, y });
    if (Math.abs(x) > Math.abs(y)) {
      const color = x > 0 ? '#8A2BE2' : x < 0 ? '#FF4B4B' : 'transparent';
      setGlowColor(color);
      setGlowIntensity(0.3);
    } else if (y < 0) {
      setGlowColor('#4CAF50');
      setGlowIntensity(0.3);
      if (Math.abs(y) > 30) {
        setExpandedCard(currentIndex);
      }
    }
  }, [currentIndex]);

  const handleLike = useCallback(() => {
    if (swiper.current && currentIndex < users.length) {
      hapticFeedback.medium();
      setGlowColor('#8A2BE2');
      setGlowIntensity(0.3);
      swiper.current.swipeRight();
    }
  }, [currentIndex, users.length]);

  const handleDislike = useCallback(() => {
    if (swiper.current && currentIndex < users.length) {
      hapticFeedback.medium();
      setGlowColor('#FF4B4B');
      setGlowIntensity(0.3);
      swiper.current.swipeLeft();
    }
  }, [currentIndex, users.length]);

  const handleSuperLike = useCallback(() => {
    if (swiper.current && currentIndex < users.length) {
      hapticFeedback.medium();
      setGlowColor('#4CAF50');
      setGlowIntensity(0.3);
      swiper.current.swipeTop();
    }
  }, [currentIndex, users.length]);

  const handleRewind = useCallback(() => {
    if (currentIndex > 0 && swiper.current) {
      hapticFeedback.medium();
      swiper.current.swipeBack();
      setCurrentIndex(currentIndex - 1);
      setGlowColor('transparent');
      setGlowIntensity(0);
    }
  }, [currentIndex]);

  const renderDetailedInfo = (user: User) => (
    <View style={styles.detailedInfo}>
      <View style={styles.detailedHeader}>
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#8A2BE2" />
          <Text style={styles.verifiedText}>Проверенный профиль</Text>
        </View>
      </View>
      <View style={styles.userMainInfo}>
        <Text style={styles.userName}>{user.name}, {user.age}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.locationText}>{user.location}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.occupationRow}>
        <Ionicons name="briefcase-outline" size={18} color="#666" />
        <Text style={styles.occupationText}>{user.occupation}</Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.bioTitle}>О себе</Text>
      <Text style={styles.bioText}>{user.bio}</Text>
      <View style={styles.divider} />
      <Text style={styles.interestsTitle}>Интересы</Text>
      <View style={styles.interestsContainer}>
        {user.interests.map((interest, index) => (
          <View key={index} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCard = useCallback((user: User, cardIndex: number) => {
    if (!user) return null;
    
    return (
      <View style={[styles.card, { height: CARD_DIMENSIONS.height }]}>
        <View style={[styles.imageContainer, { height: CARD_DIMENSIONS.height * 0.8 }]}>
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
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{user.name}, {user.age}</Text>
          <Text style={styles.cardDescription}>{user.bio}</Text>
        </View>
      </View>
    );
  }, [glowColor, glowIntensity]);

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
          ref={swiper}
          cards={users}
          renderCard={(card) => renderCard(card, users.indexOf(card))}
          onSwipedLeft={(cardIndex: number) => handleSwipe('left', cardIndex)}
          onSwipedRight={(cardIndex: number) => handleSwipe('right', cardIndex)}
          onSwipedTop={(cardIndex: number) => handleSwipe('up', cardIndex)}
          cardIndex={currentIndex}
          backgroundColor={'transparent'}
          stackSize={3}
          cardStyle={styles.cardContainer}
          animateCardOpacity
          swipeBackCard
          verticalSwipe={true}
          horizontalSwipe={true}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          disableBottomSwipe={true}
          swipeAnimationDuration={200}
          horizontalThreshold={60}
          verticalThreshold={30}
          outputRotationRange={['0deg', '0deg', '0deg']}
          stackSeparation={0}
          stackScale={0}
          inputRotationRange={[-1, 0, 1]}
          overlayLabels={{}}
          onSwiping={handleSwiping}
          containerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 100,
          }}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(138, 43, 226, 0.1)' }]} 
            onPress={handleRewind}
          >
            <Ionicons name="arrow-undo" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(255, 75, 75, 0.1)' }]} 
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
            style={[styles.actionButton, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]} 
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
    position: 'relative',
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
  cardContainer: {
    width: CARD_DIMENSIONS.width,
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'white',
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'relative',
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
    height: '80%',
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
    flex: 1,
  },
  expandedCardText: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
  },
  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  interestsTitle: {
    fontSize: isMobile ? 18 : 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5
  },
  interestTag: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    margin: 4,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  interestText: {
    color: '#8A2BE2',
    fontSize: isMobile ? 14 : 16,
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
    maxWidth: CARD_DIMENSIONS.width,
    alignSelf: 'center',
    backgroundColor: 'transparent',
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
  },
  expandedText: {
    fontSize: isMobile ? 16 : 18,
    color: '#666',
    flex: 1,
  },
  detailedInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    zIndex: 1000,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  verifiedText: {
    color: '#8A2BE2',
    fontSize: 12,
    fontWeight: '500',
  },
  userMainInfo: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#666',
  },
  occupationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 10,
  },
  occupationText: {
    fontSize: 16,
    color: '#666',
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  cardContent: {
    padding: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
}); 