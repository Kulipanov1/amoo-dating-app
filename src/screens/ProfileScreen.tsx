import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { UserProfile } from '../services/UserProfileService';

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
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await UserProfile.getProfile(
        auth.currentUser?.uid || ''
      );
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowersPress = () => {
    navigation.navigate('UserList', {
      title: 'Подписчики',
      userIds: profile?.followers || [],
    });
  };

  const handleFollowingPress = () => {
    navigation.navigate('UserList', {
      title: 'Подписки',
      userIds: profile?.following || [],
    });
  };

  const renderStatItem = (
    count: number,
    label: string,
    onPress: () => void,
    icon: string
  ) => (
    <TouchableOpacity style={styles.statItem} onPress={onPress}>
      <MaterialIcons name={icon} size={24} color="#666" />
      <Text style={styles.statCount}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Профиль не найден</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Профиль</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <MaterialIcons name="edit" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profile.photos[0] }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.name}>{profile.displayName}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
        <View style={styles.statsContainer}>
          {renderStatItem(
            profile.followers.length,
            'Подписчики',
            handleFollowersPress,
            'people'
          )}
          {renderStatItem(
            profile.following.length,
            'Подписки',
            handleFollowingPress,
            'person-add'
          )}
          {renderStatItem(profile.likes, 'Лайки', () => {}, 'favorite')}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ProfileScreen; 