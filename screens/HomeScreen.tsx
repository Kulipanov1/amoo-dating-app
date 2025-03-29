import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';

interface User {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
}

const dummyUsers: User[] = [
  {
    id: 1,
    name: 'Анна',
    age: 25,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Люблю путешествия и фотографию'
  },
  {
    id: 2,
    name: 'Михаил',
    age: 28,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    bio: 'Занимаюсь спортом, ищу активную девушку'
  },
  {
    id: 3,
    name: 'Елена',
    age: 24,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio: 'Обожаю музыку и искусство'
  }
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function HomeScreen() {
  const renderCard = (user: User) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: user.image }}
          style={styles.cardImage}
        />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{user.name}, {user.age}</Text>
          <Text style={styles.cardDescription}>{user.bio}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={dummyUsers}
        renderCard={renderCard}
        onSwipedLeft={(cardIndex) => {console.log('Не нравится', cardIndex)}}
        onSwipedRight={(cardIndex) => {console.log('Нравится', cardIndex)}}
        cardIndex={0}
        backgroundColor={'#F5F5F5'}
        stackSize={3}
        cardStyle={styles.cardContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7
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
    padding: 15
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardDescription: {
    fontSize: 16,
    color: '#666'
  }
}); 