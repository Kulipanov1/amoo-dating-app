import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, RefreshControl, ScrollView, Platform, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hapticFeedback } from '../utils/haptics';
import Skeleton from '../components/Skeleton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

const CARD_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT - 180, // Оставляем место для кнопок и отступов
  expandedHeight: SCREEN_HEIGHT - 100
};

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
    // Определяем основное направление свайпа
    const isHorizontal = Math.abs(x) > Math.abs(y);
    const isVertical = Math.abs(y) > Math.abs(x);

    if (isHorizontal) {
      // Для горизонтального свайпа игнорируем вертикальное смещение
      const color = x > 0 ? '#8A2BE2' : x < 0 ? '#FF4B4B' : 'transparent';
      setGlowColor(color);
      setGlowIntensity(0.3);
    } else if (isVertical && y < 0) {
      // Для вертикального свайпа вверх игнорируем горизонтальное смещение
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

  const renderCard = useCallback((user: User, cardIndex: number) => {
    if (!user) return null;
    
    return (
      <View style={[styles.card, { height: CARD_DIMENSIONS.height }]}>
        <View style={[styles.imageContainer, { height: CARD_DIMENSIONS.height * 0.8 }]}>
          <Image
            source={{ uri: user.images[0] }}
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

  const isDesktop = windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;
  const contentHeight = isDesktop ? Math.min(700, windowHeight - 40) : windowHeight;

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

          <View style={styles.swiperWrapper}>
            <Swiper
              ref={swiper}
              cards={users}
              renderCard={(card) => renderCard(card, users.indexOf(card))}
              onSwipedLeft={(cardIndex: number) => handleSwipe('left', cardIndex)}
              onSwipedRight={(cardIndex: number) => handleSwipe('right', cardIndex)}
              onSwipedTop={handleSwipedUp}
              cardIndex={currentIndex}
              backgroundColor={'transparent'}
              stackSize={2}
              cardStyle={styles.cardContainer}
              animateCardOpacity
              swipeBackCard
              verticalSwipe={true}
              horizontalSwipe={true}
              cardVerticalMargin={0}
              cardHorizontalMargin={0}
              disableBottomSwipe={true}
              swipeAnimationDuration={150}
              horizontalThreshold={50}
              verticalThreshold={30}
              outputRotationRange={['-0deg', '0deg', '0deg']}
              stackSeparation={-30}
              animateOverlayLabelsOpacity
              overlayLabels={{
                left: {
                  title: 'NOPE',
                  style: {
                    label: {
                      backgroundColor: '#FF0000',
                      color: '#fff',
                      fontSize: 24
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 20,
                      marginLeft: -20
                    }
                  }
                },
                right: {
                  title: 'LIKE',
                  style: {
                    label: {
                      backgroundColor: '#4CCC93',
                      color: '#fff',
                      fontSize: 24
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 20,
                      marginLeft: 20
                    }
                  }
                },
                top: {
                  title: 'SUPER LIKE',
                  style: {
                    label: {
                      backgroundColor: '#8A2BE2',
                      color: '#fff',
                      fontSize: 24
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                }
              }}
              onSwiping={handleSwiping}
              containerStyle={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
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
    justifyContent: 'center',
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
    width: '100%',
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E3D3FF',
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
}); 