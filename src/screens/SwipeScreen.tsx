import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 400);
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  distance: string;
  images: string[];
}

const profiles: Profile[] = [
  {
    id: 1,
    name: 'Анна',
    age: 25,
    bio: 'Люблю путешествия и фотографию 📸✈️',
    distance: '2 км',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    ],
  },
  {
    id: 2,
    name: 'Мария',
    age: 28,
    bio: 'Обожаю спорт и активный отдых 🏃‍♀️🎾',
    distance: '5 км',
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
    ],
  },
];

const SwipeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardRotate = useSharedValue(0);

  const nextCard = () => {
    setCurrentIndex((prev) => prev + 1);
    setCurrentImageIndex(0);
    translateX.value = 0;
    translateY.value = 0;
    cardRotate.value = 0;
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const xValue = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    translateX.value = withSpring(xValue, {}, () => {
      runOnJS(nextCard)();
    });
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      cardRotate.value = event.translationX / SCREEN_WIDTH * 0.3;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        handleSwipe(event.translationX > 0 ? 'right' : 'left');
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        cardRotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${cardRotate.value}rad` },
      ] as const,
    };
  });

  const nextImage = () => {
    if (currentIndex < profiles.length && currentImageIndex < profiles[currentIndex].images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const previousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noMoreCards}>Больше нет анкет поблизости 😢</Text>
      </View>
    );
  }

  const profile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: profile.images[currentImageIndex] }}
              style={styles.image}
            />
            <View style={styles.imageNavigation}>
              <TouchableOpacity
                style={[styles.imageNavButton, styles.leftButton]}
                onPress={previousImage}
              >
                <View style={styles.imageNavButtonInner} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imageNavButton, styles.rightButton]}
                onPress={nextImage}
              >
                <View style={styles.imageNavButtonInner} />
              </TouchableOpacity>
            </View>
            <View style={styles.imageDots}>
              {profile.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.imageDot,
                    index === currentImageIndex && styles.activeImageDot,
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            <Text style={styles.distance}>
              <Ionicons name="location-outline" size={16} color="#666" /> {profile.distance}
            </Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.dislikeButton]}
          onPress={() => handleSwipe('left')}
        >
          <Ionicons name="close" size={30} color="#FF4B4B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.likeButton]}
          onPress={() => handleSwipe('right')}
        >
          <Ionicons name="heart" size={30} color="#4BD0FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: CARD_WIDTH,
    height: Platform.OS === 'web' ? 600 : SCREEN_WIDTH * 1.4,
    backgroundColor: 'white',
    borderRadius: 20,
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
    height: '70%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  imageNavButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNavButtonInner: {
    width: '100%',
    height: '100%',
  },
  leftButton: {
    alignItems: 'flex-start',
  },
  rightButton: {
    alignItems: 'flex-end',
  },
  imageDots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeImageDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardContent: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  distance: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  bio: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  likeButton: {
    backgroundColor: '#E3F9FF',
  },
  dislikeButton: {
    backgroundColor: '#FFE3E3',
  },
  noMoreCards: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default SwipeScreen; 