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
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserProfile } from '../services/UserProfileService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        if (gesture.dy < -50) {
          Animated.spring(detailsOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
          setShowDetails(true);
        } else {
          Animated.spring(detailsOpacity, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          setShowDetails(false);
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
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'right' | 'left') => {
    direction === 'right' ? onSwipeRight() : onSwipeLeft();
    position.setValue({ x: 0, y: 0 });
  };

  const handleSuperLike = () => {
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
          <MaterialIcons name="close" size={30} color="#FF4B4B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.superLikeButton]}
          onPress={handleSuperLike}
        >
          <MaterialIcons name="star" size={30} color="#4CAF50" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.likeButton]}
          onPress={() => forceSwipe('right')}
        >
          <MaterialIcons name="favorite" size={30} color="#FF4081" />
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
        <Animated.View style={[styles.detailsContainer, { opacity: detailsOpacity }]}>
          <Text style={styles.bio}>{profile.bio}</Text>
          <Text style={styles.interests}>
            Интересы: {profile.interests.join(', ')}
          </Text>
          {profile.location && (
            <Text style={styles.location}>Местоположение: {profile.location}</Text>
          )}
          {profile.gender && (
            <Text style={styles.gender}>Пол: {profile.gender}</Text>
          )}
        </Animated.View>
      </View>
      {renderButtons()}
    </Animated.View>
  );
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
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
  detailsContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
  interests: {
    fontSize: 14,
    color: 'white',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  gender: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
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
    width: 60,
    height: 60,
    borderRadius: 30,
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
});

export default SwipeCard; 