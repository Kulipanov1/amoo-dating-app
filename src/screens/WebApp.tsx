import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  distance: string;
  photos: string[];
  interests: string[];
}

const DUMMY_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Анна',
    age: 25,
    bio: 'Люблю путешествия и фотографию 📸✈️',
    distance: '2 км',
    photos: [
      'https://picsum.photos/400/600',
      'https://picsum.photos/400/601',
    ],
    interests: ['Путешествия', 'Фотография', 'Йога'],
  },
  {
    id: '2',
    name: 'Мария',
    age: 23,
    bio: 'Обожаю музыку и искусство 🎨🎵',
    distance: '3 км',
    photos: [
      'https://picsum.photos/400/602',
      'https://picsum.photos/400/603',
    ],
    interests: ['Музыка', 'Искусство', 'Танцы'],
  },
];

const WebApp = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Amoo</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>Войти</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>Регистрация</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Найдите свою любовь</Text>
          <Text style={styles.heroSubtitle}>
            Присоединяйтесь к миллионам пользователей и начните свою историю любви сегодня
          </Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Начать знакомства</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuredProfiles}>
          <Text style={styles.sectionTitle}>Популярные анкеты</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DUMMY_PROFILES.map((profile) => (
              <View key={profile.id} style={styles.profileCard}>
                <Image source={{ uri: profile.photos[0] }} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
                  <Text style={styles.profileDistance}>{profile.distance}</Text>
                  <Text style={styles.profileBio} numberOfLines={2}>{profile.bio}</Text>
                  <View style={styles.interests}>
                    {profile.interests.map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestText}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.features}>
          <Text style={styles.sectionTitle}>Почему Amoo?</Text>
          <View style={styles.featureGrid}>
            {[
              { title: 'Умный подбор', description: 'Находите людей со схожими интересами' },
              { title: 'Безопасность', description: 'Ваши данные под надежной защитой' },
              { title: 'Удобство', description: 'Простой и понятный интерфейс' },
              { title: 'Поддержка', description: '24/7 служба поддержки' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Amoo. Все права защищены.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  headerButtonText: {
    color: '#666',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#8A2BE2',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  hero: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 600,
  },
  startButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuredProfiles: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  profileCard: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImage: {
    width: '100%',
    height: 400,
  },
  profileInfo: {
    padding: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  profileBio: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  interestTag: {
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#8A2BE2',
    fontSize: 12,
  },
  features: {
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  featureCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});

export default WebApp; 