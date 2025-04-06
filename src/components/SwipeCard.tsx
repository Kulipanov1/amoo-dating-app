import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserProfile } from '../services/UserProfileService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;
const SWIPE_UP_THRESHOLD = 50;

interface SwipeCardProps {
  profile: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSuperLike: () => void;
  isFirst: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSuperLike,
  isFirst,
}) => {
  const navigation = useNavigation();
  const [showDetails, setShowDetails] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const detailsOpacity = useRef(new Animated.Value(0)).current;
  const [isSuperLiking, setIsSuperLiking] = useState(false);

  const hideDetails = () => {
    setShowDetails(false);
    Animated.spring(detailsOpacity, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const showDetailsIfAllowed = () => {
    if (!isSuperLiking) {
      setShowDetails(true);
      Animated.spring(detailsOpacity, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        
        // Показываем детали только при свайпе вверх и не во время суперлайка
        if (gesture.dy < -SWIPE_UP_THRESHOLD && !showDetails && Math.abs(gesture.dx) < SWIPE_THRESHOLD && !isSuperLiking) {
          showDetailsIfAllowed();
        } else if ((gesture.dy >= -SWIPE_UP_THRESHOLD || Math.abs(gesture.dx) >= SWIPE_THRESHOLD) && showDetails) {
          hideDetails();
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    hideDetails(); // Всегда скрываем детали при свайпе
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    direction === 'right' ? onSwipeRight() : onSwipeLeft();
    position.setValue({ x: 0, y: 0 });
    setIsSuperLiking(false); // Сбрасываем флаг суперлайка
  };

  const handleSuperLike = () => {
    setIsSuperLiking(true); // Устанавливаем флаг суперлайка
    hideDetails(); // Принудительно скрываем детали
    onSuperLike();
    forceSwipe('right');
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderButtons = () => {
    if (!isFirst) return null;

    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.dislikeButton]}
          onPress={() => forceSwipe('left')}
        >
          <Entypo name="cross" size={40} color="#FF4B4B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.superLikeButton]}
          onPress={handleSuperLike}
        >
          <FontAwesome name="star" size={35} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.likeButton]}
          onPress={() => forceSwipe('right')}
        >
          <AntDesign name="heart" size={35} color="#FF4081" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animated.View
      style={[styles.card, getCardStyle()]}
      {...panResponder.panHandlers}
    >
      <Image
        source={{ uri: profile.photos[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{profile.displayName}</Text>
        <Text style={styles.age}>{profile.birthDate ? calculateAge(profile.birthDate) : ''} лет</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
        
        <Animated.View style={[styles.detailsContainer, { opacity: detailsOpacity }]}>
          {profile.interests && profile.interests.length > 0 && (
            <Text style={styles.interests}>
              <MaterialCommunityIcons name="heart-multiple" size={16} color="#fff" /> Интересы: {profile.interests.join(', ')}
            </Text>
          )}
          {profile.location && (
            <Text style={styles.location}>
              <Ionicons name="location-sharp" size={16} color="#fff" /> {profile.location}
            </Text>
          )}
          {profile.education && (
            <Text style={styles.education}>
              <Ionicons name="school" size={16} color="#fff" /> {profile.education}
            </Text>
          )}
          {profile.work && (
            <Text style={styles.work}>
              <MaterialCommunityIcons name="briefcase" size={16} color="#fff" /> {profile.work}
            </Text>
          )}
        </Animated.View>
      </View>
      {renderButtons()}
      
      {isFirst && (
        <View style={styles.swipeHint}>
          <Entypo name="chevron-up" size={30} color="#fff" />
          <Text style={styles.swipeHintText}>Свайп вверх для подробностей</Text>
        </View>
      )}
    </Animated.View>
  );
};

const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 20,
    height: '80%',
    margin: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    borderRadius: 20,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  age: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  interests: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  education: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  work: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dislikeButton: {
    backgroundColor: 'white',
  },
  superLikeButton: {
    backgroundColor: 'white',
  },
  likeButton: {
    backgroundColor: 'white',
  },
  swipeHint: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'center',
  },
  swipeHintText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default SwipeCard; 