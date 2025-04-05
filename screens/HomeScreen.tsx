import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Platform, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hapticFeedback } from '../utils/haptics';
import { SuperLikeIcon, LikeIcon, DislikeIcon, BackArrowIcon } from '../components/Icons';
import AnimatedBackground from '../components/AnimatedBackground';
import { Animated as RNAnimated } from 'react-native';
import type { HomeScreenProps } from '../types/navigation';

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

const DESKTOP_CONTENT_WIDTH = 480;
const DESKTOP_CONTENT_HEIGHT = 700;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [glowColor, setGlowColor] = useState('transparent');
  const [glowIntensity, setGlowIntensity] = useState(0);
  const swiper = useRef<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<User | null>(null);
  const [pan] = useState(new RNAnimated.ValueXY());

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const isDesktop = windowWidth > 768;
  
  const cardWidth = isDesktop ? DESKTOP_CONTENT_WIDTH : Math.min(windowWidth * 0.9, 480);
  const cardHeight = isDesktop ? DESKTOP_CONTENT_HEIGHT - 120 : Math.min(windowHeight - 180, 700);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUsers(dummyUsers);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = (direction: 'left' | 'right') => {
    const xPosition = direction === 'left' ? -500 : 500;
    
    RNAnimated.sequence([
      RNAnimated.spring(pan, {
        toValue: { x: xPosition, y: 0 },
        useNativeDriver: true,
        bounciness: 0,
        speed: 20,
      }),
      RNAnimated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Обновляем индекс текущего профиля
      setCurrentIndex((prevIndex) => (prevIndex + 1) % users.length);
    });
  };

  const handleSwipeUp = (cardIndex: number) => {
    hapticFeedback.light();
    setCurrentProfile(users[cardIndex]);
    setShowProfile(true);
  };

  const handleLike = () => {
    hapticFeedback.light();
    if (swiper.current) {
      swiper.current.swipeRight();
    }
  };

  const handleDislike = () => {
    hapticFeedback.light();
    if (swiper.current) {
      swiper.current.swipeLeft();
    }
  };

  const handleSuperLike = () => {
    hapticFeedback.medium();
    if (swiper.current) {
      swiper.current.swipeTop();
    }
  };

  const handleRewind = useCallback(() => {
    if (currentIndex > 0 && swiper.current) {
      hapticFeedback.medium();
      swiper.current.swipeBack();
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const renderCard = (user: User) => {
    if (!user) return null;
    
    return (
      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: user.images[0] }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={[styles.imageTint, { backgroundColor: glowColor, opacity: glowIntensity }]} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{user.name}, {user.age}</Text>
            <Text style={styles.cardDescription}>{user.bio}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderExpandedProfile = (user: User) => {
    return (
      <View style={styles.expandedProfile}>
        <View style={styles.expandedHeader}>
          <Text style={styles.expandedName}>{user.name}, {user.age}</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowProfile(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <Image
          source={{ uri: user.images[0] }}
          style={styles.expandedImage}
          resizeMode="cover"
        />
        
        <View style={styles.expandedContent}>
          <Text style={styles.expandedBio}>{user.bio}</Text>
          
          {user.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Местоположение:</Text>
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
          )}
          
          {user.occupation && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>💼 Работа:</Text>
              <Text style={styles.infoText}>{user.occupation}</Text>
            </View>
          )}
          
          <Text style={styles.interestsTitle}>Интересы:</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
        <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
          <View style={[styles.mainContent, isDesktop && { width: cardWidth + 40 }]}>
            <View style={styles.header}>
              <Text style={styles.logoText}>Amoo</Text>
            </View>

            <View style={styles.swiperContainer}>
              <Swiper
                ref={swiper}
                cards={users}
                renderCard={renderCard}
                onSwipedAll={() => setUsers(dummyUsers)}
                cardIndex={currentIndex}
                backgroundColor="transparent"
                stackSize={3}
                stackSeparation={15}
                animateCardOpacity
                verticalThreshold={windowHeight * 0.15}
                horizontalThreshold={windowWidth * 0.3}
                onSwipedTop={handleSwipeUp}
                onSwipedLeft={() => handleDislike()}
                onSwipedRight={() => handleLike()}
                disableTopSwipe={false}
                disableBottomSwipe={true}
                overlayLabels={{
                  left: {
                    title: 'НEТЪ',
                    style: {
                      label: {
                        backgroundColor: '#FF4B4B',
                        color: 'white',
                        fontSize: 24
                      },
                      wrapper: {
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        marginTop: 30,
                        marginLeft: 30
                      }
                    }
                  },
                  right: {
                    title: 'ДА',
                    style: {
                      label: {
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontSize: 24
                      },
                      wrapper: {
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        marginTop: 30,
                        marginRight: 30
                      }
                    }
                  },
                  top: {
                    title: 'ПОДРОБНЕЕ',
                    style: {
                      label: {
                        backgroundColor: '#8A2BE2',
                        color: 'white',
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
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.smallButton]}
                onPress={handleRewind}
              >
                <BackArrowIcon size={30} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.largeButton]}
                onPress={handleDislike}
              >
                <DislikeIcon size={30} color="#FF4B4B" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.largeButton]}
                onPress={handleSuperLike}
              >
                <SuperLikeIcon size={30} color="#00E0FF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.largeButton]}
                onPress={handleLike}
              >
                <LikeIcon size={30} color="#FF4B6E" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={showProfile}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {currentProfile && renderExpandedProfile(currentProfile)}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  safeArea: {
    flex: 1,
  },
  desktopSafeArea: {
    backgroundColor: 'transparent',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  desktopWrapper: {
    paddingVertical: 20,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    maxWidth: DESKTOP_CONTENT_WIDTH,
  },
  header: {
    height: 56,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  swiperContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 0.7,
    alignSelf: 'center',
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
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
    height: '100%',
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  cardDescription: {
    fontSize: 18,
    color: '#fff',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    gap: 20,
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
  expandedProfile: {
    backgroundColor: 'transparent',
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#8A2BE2',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  expandedName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  expandedImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
  },
  expandedContent: {
    padding: 15,
  },
  expandedBio: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  interestText: {
    color: '#fff',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8F4FF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
});