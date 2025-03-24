import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreen = () => {
  const userProfile = {
    name: 'Анна',
    age: 25,
    location: 'Москва',
    bio: 'Люблю путешествия, фотографию и хорошую музыку. В поисках интересных знакомств и новых впечатлений.',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
    ],
    interests: ['Путешествия', 'Фотография', 'Музыка', 'Спорт', 'Искусство']
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={{ uri: userProfile.photos[0] }}
        style={styles.mainPhoto}
      />
      <View style={styles.headerInfo}>
        <Text style={styles.name}>{userProfile.name}, {userProfile.age}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.location}>{userProfile.location}</Text>
        </View>
      </View>
    </View>
  );

  const renderBio = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>О себе</Text>
      <Text style={styles.bio}>{userProfile.bio}</Text>
    </View>
  );

  const renderPhotos = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Фотографии</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
        {userProfile.photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.photo}
          />
        ))}
        <TouchableOpacity style={styles.addPhotoButton}>
          <Ionicons name="add" size={32} color="#8A2BE2" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderInterests = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Интересы</Text>
      <View style={styles.interestsContainer}>
        {userProfile.interests.map((interest, index) => (
          <View key={index} style={styles.interestTag}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addInterestButton}>
          <Ionicons name="add" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Настройки</Text>
      {[
        { icon: 'person-outline', title: 'Редактировать профиль' },
        { icon: 'notifications-outline', title: 'Уведомления' },
        { icon: 'shield-outline', title: 'Конфиденциальность' },
        { icon: 'help-circle-outline', title: 'Помощь' },
        { icon: 'log-out-outline', title: 'Выйти' }
      ].map((item, index) => (
        <TouchableOpacity key={index} style={styles.settingItem}>
          <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={24} color="#666" />
          <Text style={styles.settingText}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderBio()}
      {renderPhotos()}
      {renderInterests()}
      {renderSettings()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mainPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  headerInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  photosContainer: {
    flexDirection: 'row',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8A2BE2',
    borderStyle: 'dashed',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  interestText: {
    color: '#333',
    fontSize: 14,
  },
  addInterestButton: {
    backgroundColor: '#f0f0f0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default ProfileScreen; 