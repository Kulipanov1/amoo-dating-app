import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Platform, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { hapticFeedback } from '../utils/haptics';
import { SuperLikeIcon, LikeIcon, DislikeIcon, BackArrowIcon } from '../components/Icons';
import AnimatedBackground from '../components/AnimatedBackground';

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

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [glowColor, setGlowColor] = useState('transparent');
  const [glowIntensity, setGlowIntensity] = useState(0);
  const swiper = useRef<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<User | null>(null);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const isDesktop = windowWidth > 768;
  
  const cardWidth = isDesktop ? DESKTOP_CONTENT_WIDTH * 0.9 : windowWidth * 0.9;
  const cardHeight = isDesktop ? DESKTOP_CONTENT_HEIGHT - 180 : windowHeight - 250;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setUsers(dummyUsers);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSwipe = useCallback((direction: string, cardIndex: number) => {
    if (direction === 'top') {
      setCurrentProfile(users[cardIndex]);
      setShowProfile(true);
    }
  }, [users]);

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
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{user.name}, {user.age}</Text>
          <Text style={styles.cardDescription}>{user.bio}</Text>
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
          <View style={[styles.mainContent, isDesktop && { width: DESKTOP_CONTENT_WIDTH, height: DESKTOP_CONTENT_HEIGHT }]}>
            <View style={styles.header}>
              <Text style={styles.logoText}>Amoo</Text>
            </View>

            <View style={styles.swiperContainer}>
              <Swiper
                ref={swiper}
                cards={users}
                renderCard={renderCard}
                cardIndex={currentIndex}
                backgroundColor="transparent"
                stackSize={3}
                cardStyle={styles.cardContainer}
                animateCardOpacity
                verticalSwipe={true}
                horizontalSwipe={true}
                stackSeparation={15}
                cardVerticalMargin={20}
                cardHorizontalMargin={10}
                disableBottomSwipe={true}
                inputRotationRange={[-15, 0, 15]}
                outputRotationRange={['-5deg', '0deg', '5deg']}
                swipeAnimationDuration={350}
                onSwipedTop={(cardIndex) => handleSwipe('top', cardIndex)}
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.smallButton]}>
                <BackArrowIcon size={30} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.largeButton]}>
                <DislikeIcon size={30} color="#FF4B4B" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.largeButton]}>
                <SuperLikeIcon size={30} color="#00E0FF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.largeButton]}>
                <LikeIcon size={30} color="#FF4B6E" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <Modal
        visible={showProfile}
        animationType="slide"
        onRequestClose={() => setShowProfile(false)}
      >
        {currentProfile && renderExpandedProfile(currentProfile)}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
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
    maxWidth: DESKTOP_CONTENT_WIDTH,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
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
  swiperContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
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
    flex: 1,
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
    borderRadius: 20,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardDescription: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#F8F4FF',
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
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  expandedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#8A2BE2',
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
    height: 300,
    objectFit: 'cover',
  },
  expandedContent: {
    padding: 20,
  },
  expandedBio: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    color: '#fff',
    fontSize: 14,
  },
});