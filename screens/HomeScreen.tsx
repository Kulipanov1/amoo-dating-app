import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface User {
  id: string;
  name: string;
  age: number;
  image: string;
  bio: string;
}

const dummyUsers: User[] = [
  {
    id: '1',
    name: 'Анна',
    age: 25,
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Люблю путешествия и фотографию 📸',
  },
  {
    id: '2',
    name: 'Михаил',
    age: 28,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Музыкант, играю на гитаре 🎸',
  },
  {
    id: '3',
    name: 'Елена',
    age: 24,
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Обожаю спорт и активный отдых 🏃‍♀️',
  },
];

export default function HomeScreen() {
  const [users] = useState(dummyUsers);

  const renderCard = (user: User) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: user.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{user.name}, {user.age}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        renderCard={renderCard}
        onSwipedLeft={(cardIndex) => console.log('Отказ', cardIndex)}
        onSwipedRight={(cardIndex) => console.log('Лайк', cardIndex)}
        cardIndex={0}
        backgroundColor={'#fff'}
        stackSize={3}
        cardStyle={styles.cardContainer}
        overlayLabels={{
          left: {
            title: 'НEТЬ',
            style: {
              label: {
                backgroundColor: '#ff0000',
                color: '#fff',
                fontSize: 24
              }
            }
          },
          right: {
            title: 'ДА',
            style: {
              label: {
                backgroundColor: '#00ff00',
                color: '#fff',
                fontSize: 24
              }
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.3,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
  },
  textContainer: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#363636',
  },
  bio: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
  },
}); 