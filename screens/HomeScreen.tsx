import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, RefreshControl, ScrollView, Platform, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hapticFeedback } from '../utils/haptics';
import Skeleton from '../components/Skeleton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedBackground from '../components/AnimatedBackground';
import { SuperLikeIcon, LikeIcon, DislikeIcon, BackArrowIcon } from '../components/Icons';

interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  interests: string[];
  location?: string;
  occupation?: string;
}

const dummyUsers: User[] = [
  {
    id: "1",
    name: "Анна",
    age: 25,
    bio: "Люблю путешествия и фотографию",
    images: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330"],
    interests: ["Путешествия", "Фотография", "Искусство", "Музыка"]
  },
  {
    id: "2",
    name: "Михаил",
    age: 28,
    bio: "Занимаюсь спортом, ищу активную девушку",
    images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e"],
    interests: ["Спорт", "Путешествия", "Кулинария", "Кино"]
  },
  {
    id: "3",
    name: "Елена",
    age: 24,
    bio: "Обожаю музыку и искусство",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb"],
    interests: ["Музыка", "Искусство", "Театр", "Литература"]
  }
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Определяем размеры карточки в зависимости от устройства
const isWeb = Platform.OS === 'web';
const isMobile = SCREEN_WIDTH < 768;

// Фиксированные размеры для десктопной версии
const DESKTOP_CONTENT_WIDTH = 480;
const DESKTOP_CONTENT_HEIGHT = 700;

interface CardDimensions {
  width: number;
  height: number;
  expandedHeight: number;
}

const getCardDimensions = (windowWidth: number, windowHeight: number, isDesktop: boolean): CardDimensions => {
  if (isDesktop) {
    return {
      width: DESKTOP_CONTENT_WIDTH * 0.9,
      height: DESKTOP_CONTENT_HEIGHT - 180,
      expandedHeight: DESKTOP_CONTENT_HEIGHT - 150
    };
  }
  return {
    width: windowWidth * 0.9,
    height: windowHeight - 250,
    expandedHeight: windowHeight - 200
  };
};

const getDesktopStyles = (width: number, height: number) => ({
  width,
  height,
  backgroundColor: '#F8F4FF',
  borderRadius: 20,
  overflow: 'hidden' as const,
  ...(Platform.OS === 'web' ? {
    // @ts-ignore
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  } : {}),
});

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [lastSwipe, setLastSwipe] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [glowColor, setGlowColor] = useState('transparent');
  const [glowIntensity, setGlowIntensity] = useState(0);
  const swiper = useRef<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<User | null>(null);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [dimensions, setDimensions] = useState<CardDimensions>(
    getCardDimensions(Dimensions.get('window').width, Dimensions.get('window').height, Dimensions.get('window').width > 768)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUsers(dummyUsers);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const isDesktop = windowWidth > 768;
    setDimensions(getCardDimensions(windowWidth, windowHeight, isDesktop));
  }, [windowWidth, windowHeight]);

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
      // Только расширяем карточку для показа доп. информации
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
    // Определяем основное направление свайпа
    const isHorizontal = Math.abs(x) > Math.abs(y);
    const isVertical = Math.abs(y) > Math.abs(x);

    if (isHorizontal) {
      // Для горизонтального свайпа
      const color = x > 0 ? '#FF4B6E' : x < 0 ? '#FF4B4B' : 'transparent';
      setGlowColor(color);
      setGlowIntensity(0.3);
    } else if (isVertical && y < 0) {
      // Для вертикального свайпа вверх
      if (Math.abs(y) > 20) { // Уменьшаем порог для более легкого срабатывания
        setExpandedCard(currentIndex);
        setGlowColor('#4CAF50');
        setGlowIntensity(0.2);
      }
    } else {
      setGlowColor('transparent');
      setGlowIntensity(0);
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
      setGlowColor('#00E0FF');
      setGlowIntensity(0.3);
      // Просто делаем суперлайк без открытия карточки
      console.log('Суперлайк');
      swiper.current.swipeRight();
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

  const handleSwipedUp = (index: number) => {
    setCurrentProfile(users[index]);
    setShowProfile(true);
  };

  const renderDetailedInfo = (user: User) => (
    <ScrollView style={styles.detailedInfo}>
      <Text style={styles.detailedName}>{user.name}, {user.age}</Text>
      <Text style={styles.detailedBio}>{user.bio}</Text>
      {user.location && (
        <Text style={styles.detailedLocation}>📍 {user.location}</Text>
      )}
      {user.occupation && (
        <Text style={styles.detailedOccupation}>💼 {user.occupation}</Text>
      )}
      <Text style={styles.interestsTitle}>Интересы:</Text>
      <View style={styles.interestsContainer}>
        {user.interests.map((interest, index) => (
          <View key={index} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const isDesktop = windowWidth > 768;
  const contentWidth = isDesktop ? DESKTOP_CONTENT_WIDTH : windowWidth;
  const contentHeight = isDesktop ? DESKTOP_CONTENT_HEIGHT : windowHeight;

  const renderCard = useCallback((user: User, cardIndex: number) => {
    if (!user) return null;
    
    const isExpanded = expandedCard === cardIndex;
    
    return (
      <View style={[styles.card, { 
        width: dimensions.width,
        height: dimensions.height 
      }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: user.images[0] }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={[
            styles.imageTint,
            {
              backgroundColor: glowColor,
              opacity: glowIntensity,
            }
          ]} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{user.name}, {user.age}</Text>
            <Text style={styles.cardDescription}>{user.bio}</Text>
            
            {isExpanded && (
              <View style={styles.expandedContent}>
                {user.location && (
                  <Text style={styles.expandedText}>📍 {user.location}</Text>
                )}
                {user.occupation && (
                  <Text style={styles.expandedText}>💼 {user.occupation}</Text>
                )}
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
      </View>
    );
  }, [glowColor, glowIntensity, expandedCard, dimensions]);

  const renderSkeleton = useCallback(() => (
    <View style={[styles.cardContainer, { width: dimensions.width }]}>
      <Skeleton width={dimensions.width} height={dimensions.height} borderRadius={20} />
      <View style={styles.skeletonTextContainer}>
        <Skeleton width={200} height={24} style={styles.skeletonTitle} />
        <Skeleton width={150} height={16} style={styles.skeletonDescription} />
      </View>
    </View>
  ), [dimensions]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
        <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
          <View style={[
            styles.mainContent,
            isDesktop && {
              width: contentWidth,
              height: contentHeight,
            }
          ]}>
            <View style={styles.header}>
              <Text style={styles.logoText}>Amoo</Text>
            </View>

            <View style={styles.cardContainer}>
              {renderSkeleton()}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.rewindButton]}>
                <Ionicons name="arrow-undo" size={24} color="#8A2BE2" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]}>
                <Ionicons name="close" size={32} color="#FF4B4B" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
                <Ionicons name="heart" size={32} color="#8A2BE2" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.boostButton]}>
                <Ionicons name="flash" size={24} color="#8A2BE2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
        <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
          <View style={[
            styles.mainContent,
            isDesktop && getDesktopStyles(contentWidth, contentHeight)
          ]}>
            <View style={styles.header}>
              <Text style={styles.logoText}>Amoo</Text>
            </View>

            <View style={styles.swiperWrapper}>
              <Swiper
                ref={swiper}
                cards={users}
                renderCard={(card) => renderCard(card, users.indexOf(card))}
                onSwipedLeft={(cardIndex: number) => handleSwipe('left', cardIndex)}
                onSwipedRight={(cardIndex: number) => handleSwipe('right', cardIndex)}
                onSwipedTop={(cardIndex: number) => handleSwipe('up', cardIndex)}
                onSwiping={handleSwiping}
                cardIndex={currentIndex}
                backgroundColor={'transparent'}
                stackSize={2}
                cardStyle={styles.cardContainer}
                animateCardOpacity
                swipeBackCard
                verticalSwipe={true}
                horizontalSwipe={true}
                cardVerticalMargin={20}
                cardHorizontalMargin={10}
                disableBottomSwipe={true}
                swipeAnimationDuration={150}
                horizontalThreshold={50}
                verticalThreshold={25}
                outputRotationRange={['-0deg', '0deg', '0deg']}
                stackSeparation={15}
                overlayLabels={{}}
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.smallButton]} onPress={handleRewind}>
                <BackArrowIcon size={30} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.largeButton]} onPress={handleDislike}>
                <DislikeIcon size={30} color="#FF4B4B" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.largeButton]} onPress={handleSuperLike}>
                <SuperLikeIcon size={30} color="#00E0FF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.largeButton]} onPress={handleLike}>
                <LikeIcon size={30} color="#FF4B6E" />
              </TouchableOpacity>
            </View>

            <Modal
              visible={showProfile}
              animationType="slide"
              onRequestClose={() => setShowProfile(false)}
            >
              {currentProfile && (
                <View style={styles.modalContainer}>
                  {renderDetailedInfo(currentProfile)}
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowProfile(false)}
                  >
                    <Ionicons name="close" size={30} color="#8A2BE2" />
                  </TouchableOpacity>
                </View>
              )}
            </Modal>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  safeArea: {
    flex: 1,
  },
  desktopSafeArea: {
    backgroundColor: '#8A2BE2',
  },
  wrapper: {
    flex: 1,
  },
  desktopWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  header: {
    height: 56,
    backgroundColor: '#8A2BE2',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  swiperWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    backgroundColor: 'transparent',
  },
  card: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
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
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  cardDescription: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3
  },
  expandedContent: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 10,
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
    marginTop: 10,
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  interestText: {
    color: '#fff',
    fontSize: 14,
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
    maxWidth: dimensions?.width || SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallButton: {
    width: 45,
    height: 45,
  },
  largeButton: {
    width: 60,
    height: 60,
  },
  expandedText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
  detailedName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailedBio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  detailedLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  detailedOccupation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F4FF',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F8F4FF',
    width: '100%',
  },
  rewindButton: {
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: '#FF4B4B',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  boostButton: {
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  swipeUpIndicator: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.8,
  },
}); 