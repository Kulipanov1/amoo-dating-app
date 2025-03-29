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
import { Ionicons } from '@expo/vector-icons';

interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  action: () => void;
}

const PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: '1',
    title: 'Редактировать профиль',
    icon: 'person-outline',
    action: () => console.log('Edit profile'),
  },
  {
    id: '2',
    title: 'Настройки приватности',
    icon: 'lock-closed-outline',
    action: () => console.log('Privacy settings'),
  },
  {
    id: '3',
    title: 'Уведомления',
    icon: 'notifications-outline',
    action: () => console.log('Notifications'),
  },
  {
    id: '4',
    title: 'Помощь и поддержка',
    icon: 'help-circle-outline',
    action: () => console.log('Help'),
  },
  {
    id: '5',
    title: 'О приложении',
    icon: 'information-circle-outline',
    action: () => console.log('About'),
  },
];

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
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: userProfile.photos[0] }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editImageButton}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{userProfile.name}, {userProfile.age}</Text>
      <Text style={styles.bio}>{userProfile.bio}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>248</Text>
          <Text style={styles.statLabel}>Подписчики</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>186</Text>
          <Text style={styles.statLabel}>Подписки</Text>
        </View>
      </View>
    </View>
  );

  const renderSections = () => (
    <View style={styles.sections}>
      {PROFILE_SECTIONS.map((section) => (
        <TouchableOpacity
          key={section.id}
          style={styles.sectionItem}
          onPress={section.action}
        >
          <View style={styles.sectionIcon}>
            <Ionicons name={section.icon} size={24} color="#8A2BE2" />
          </View>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLogoutButton = () => (
    <TouchableOpacity style={styles.logoutButton}>
      <Text style={styles.logoutText}>Выйти</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderSections()}
      {renderLogoutButton()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#8A2BE2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  sections: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 