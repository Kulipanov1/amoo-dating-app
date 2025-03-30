import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { hapticFeedback } from '../utils/haptics';
import AnimatedBackground from '../components/AnimatedBackground';

interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  date: string;
}

interface UserStats {
  followers: number;
  following: number;
  likes: number;
  matches: number;
}

interface UserProfile {
  id: string;
  name: string;
  status: string;
  avatar: string;
  photos: string[];
  interests: string[];
  achievements: Achievement[];
  stats: UserStats;
  isVerified: boolean;
  isPremium: boolean;
}

interface StatModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  type: 'followers' | 'following' | 'likes' | 'matches';
}

const StatModal = ({ visible, onClose, title, data, type }: StatModalProps) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userListItem}>
      <Image source={{ uri: item.avatar }} style={styles.userListAvatar} />
      <View style={styles.userListInfo}>
        <Text style={styles.userListName}>{item.name}</Text>
        <Text style={styles.userListStatus}>{item.status}</Text>
      </View>
      {type === 'matches' && (
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      )}
      {type === 'likes' && !item.isMatched && (
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={20} color="#8A2BE2" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.userList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

export default function ProfileScreen() {
  const { width: windowWidth } = Dimensions.get('window');
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowHeight(window.height);
    });

    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Александр Петров',
    status: 'Ищу интересные знакомства',
    avatar: 'https://example.com/avatar.jpg',
    photos: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
      'https://example.com/photo3.jpg',
    ],
    interests: ['Путешествия', 'Спорт', 'Музыка', 'Кино', 'Искусство'],
    achievements: [
      {
        id: '1',
        title: 'Популярный профиль',
        icon: 'star',
        description: '1000+ лайков',
        date: '2024-03-20',
      },
      {
        id: '2',
        title: 'Верифицирован',
        icon: 'checkmark-circle',
        description: 'Подтвержденный профиль',
        date: '2024-03-15',
      },
    ],
    stats: {
      followers: 1234,
      following: 567,
      likes: 890,
      matches: 123,
    },
    isVerified: true,
    isPremium: true,
  });

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'followers' | 'following' | 'likes' | 'matches' | null>(null);

  const handleEditPhoto = async () => {
    hapticFeedback.light();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile(prev => ({
        ...prev,
        avatar: result.assets[0].uri,
      }));
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <View style={styles.achievementCard}>
      <Ionicons name={item.icon as any} size={24} color="#8A2BE2" />
      <Text style={styles.achievementTitle}>{item.title}</Text>
      <Text style={styles.achievementDescription}>{item.description}</Text>
    </View>
  );

  const renderPhoto = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.galleryPhoto} />
  );

  const renderInterest = ({ item }: { item: string }) => (
    <View style={styles.interestTag}>
      <Text style={styles.interestText}>{item}</Text>
    </View>
  );

  const dummyData = {
    followers: [
      { id: '1', name: 'Анна', status: 'Онлайн', avatar: 'https://example.com/avatar1.jpg' },
      { id: '2', name: 'Мария', status: '2 часа назад', avatar: 'https://example.com/avatar2.jpg' },
    ],
    following: [
      { id: '3', name: 'Петр', status: 'Онлайн', avatar: 'https://example.com/avatar3.jpg' },
      { id: '4', name: 'Иван', status: '1 час назад', avatar: 'https://example.com/avatar4.jpg' },
    ],
    likes: [
      { id: '5', name: 'София', status: 'Онлайн', avatar: 'https://example.com/avatar5.jpg', isMatched: true },
      { id: '6', name: 'Алиса', status: '30 минут назад', avatar: 'https://example.com/avatar6.jpg', isMatched: false },
    ],
    matches: [
      { id: '7', name: 'Елена', status: 'Онлайн', avatar: 'https://example.com/avatar7.jpg' },
      { id: '8', name: 'Ольга', status: '5 минут назад', avatar: 'https://example.com/avatar8.jpg' },
    ],
  };

  const getModalTitle = (type: 'followers' | 'following' | 'likes' | 'matches') => {
    switch (type) {
      case 'followers': return 'Подписчики';
      case 'following': return 'Подписки';
      case 'likes': return 'Лайки';
      case 'matches': return 'Совпадения';
    }
  };

  const photoSize = (windowWidth - 64) / 3;

  return (
    <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
      <AnimatedBackground />
      <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
        <View style={[styles.mainContent, isDesktop && { width: contentWidth }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Amoo</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setShowSettingsModal(true)}
            >
              <Ionicons name="settings-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileHeader}>
              <TouchableOpacity 
                style={styles.avatarContainer}
                onPress={handleEditPhoto}
              >
                <View style={styles.avatarFrame}>
                  <Image 
                    source={{ uri: profile.avatar }} 
                    style={styles.avatar}
                  />
                  <View style={styles.editAvatarButton}>
                    <Ionicons name="camera" size={18} color="white" />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.userInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{profile.name}</Text>
                  <View style={styles.badgesContainer}>
                    {profile.isVerified && (
                      <View style={styles.badge}>
                        <Ionicons name="checkmark-circle" size={18} color="#8A2BE2" />
                      </View>
                    )}
                    {profile.isPremium && (
                      <View style={[styles.badge, styles.premiumBadge]}>
                        <Ionicons name="star" size={18} color="#FFD700" />
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.status}>{profile.status}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => setActiveModal('followers')}
              >
                <Text style={styles.statNumber}>{formatNumber(profile.stats.followers)}</Text>
                <Text style={styles.statLabel}>Подписчики</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => setActiveModal('following')}
              >
                <Text style={styles.statNumber}>{formatNumber(profile.stats.following)}</Text>
                <Text style={styles.statLabel}>Подписки</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => setActiveModal('likes')}
              >
                <Text style={styles.statNumber}>{formatNumber(profile.stats.likes)}</Text>
                <Text style={styles.statLabel}>Лайки</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity 
                style={styles.statItem}
                onPress={() => setActiveModal('matches')}
              >
                <Text style={styles.statNumber}>{formatNumber(profile.stats.matches)}</Text>
                <Text style={styles.statLabel}>Совпадения</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Интересы</Text>
              <FlatList
                data={profile.interests}
                renderItem={renderInterest}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.interestsList}
              />
            </View>

            <View style={styles.galleryContainer}>
              <Text style={styles.sectionTitle}>Фотографии</Text>
              <View style={styles.galleryGrid}>
                {profile.photos.map((photo, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.photoContainer, { width: photoSize, height: photoSize }]}
                    onPress={() => handleEditPhoto()}
                  >
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <View style={styles.photoOverlay}>
                      <Ionicons name="expand" size={24} color="white" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Достижения</Text>
              <View style={styles.achievementsGrid}>
                {profile.achievements.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementCard}>
                    <View style={styles.achievementIcon}>
                      <Ionicons name={achievement.icon as any} size={24} color="#8A2BE2" />
                    </View>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {activeModal && (
        <StatModal
          visible={true}
          onClose={() => setActiveModal(null)}
          title={getModalTitle(activeModal)}
          data={dummyData[activeModal]}
          type={activeModal}
        />
      )}

      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Настройки</Text>
              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.settingsItem}>
              <Ionicons name="lock-closed-outline" size={24} color="#8A2BE2" />
              <Text style={styles.settingsText}>Приватность</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <Ionicons name="notifications-outline" size={24} color="#8A2BE2" />
              <Text style={styles.settingsText}>Уведомления</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <Ionicons name="shield-outline" size={24} color="#8A2BE2" />
              <Text style={styles.settingsText}>Безопасность</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsItem}>
              <Ionicons name="language-outline" size={24} color="#8A2BE2" />
              <Text style={styles.settingsText}>Язык приложения</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  desktopSafeArea: {
    backgroundColor: '#8A2BE2',
  },
  wrapper: {
    flex: 1,
  },
  desktopWrapper: {
    alignItems: 'center',
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...(Platform.OS === 'web' ? {
      borderRadius: 20,
      overflow: 'hidden' as const,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
    } : {}),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    height: 56,
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    padding: 8,
  },
  profileHeader: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarFrame: {
    position: 'relative',
    padding: 3,
    borderRadius: 50,
    backgroundColor: '#8A2BE2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#8A2BE2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    backgroundColor: '#F0E6FF',
    padding: 4,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: '#FFF8E0',
  },
  status: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E3D3FF',
    marginVertical: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  interestsList: {
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  interestText: {
    color: '#8A2BE2',
    fontSize: 15,
    fontWeight: '500',
  },
  galleryContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginTop: 12,
  },
  photoContainer: {
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#F0E6FF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '48%',
  },
  achievementIcon: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...(Platform.OS === 'web' ? {
      width: 480,
      alignSelf: 'center',
      borderRadius: 20,
      marginTop: '10%',
      maxHeight: '80%',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    } : {
      maxHeight: '80%',
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  userList: {
    paddingBottom: 20,
  },
  userListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  userListAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userListInfo: {
    flex: 1,
  },
  userListName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userListStatus: {
    fontSize: 14,
    color: '#666',
  },
  chatButton: {
    padding: 8,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderRadius: 20,
  },
  likeButton: {
    padding: 8,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderRadius: 20,
  },
}); 