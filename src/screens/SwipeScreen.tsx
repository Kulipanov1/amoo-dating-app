import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swiper from 'react-native-deck-swiper';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Card {
  id: string;
  name: string;
  age: number;
  image: string;
  bio: string;
}

const DUMMY_DATA: Card[] = [
  {
    id: '1',
    name: 'Анна',
    age: 25,
    image: 'https://picsum.photos/400/600',
    bio: 'Люблю путешествия и фотографию'
  },
  {
    id: '2',
    name: 'Мария',
    age: 23,
    image: 'https://picsum.photos/400/601',
    bio: 'Обожаю музыку и искусство'
  },
  {
    id: '3',
    name: 'Елена',
    age: 27,
    image: 'https://picsum.photos/400/602',
    bio: 'Спорт и здоровый образ жизни'
  }
];

const SwipeScreen = () => {
  const renderCard = (card: Card) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: card.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{card.name}, {card.age}</Text>
          <Text style={styles.bio}>{card.bio}</Text>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Swiper
        cards={DUMMY_DATA}
        renderCard={renderCard}
        onSwipedLeft={() => console.log('Пропущено')}
        onSwipedRight={() => console.log('Нравится')}
        cardIndex={0}
        backgroundColor={'#F5F5F5'}
        stackSize={3}
        cardStyle={styles.cardContainer}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.4
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
    elevation: 5
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  textContainer: {
    padding: 20
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginTop: 8
  }
});

export default SwipeScreen; 