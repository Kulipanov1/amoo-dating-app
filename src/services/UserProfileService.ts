import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  location: {
    latitude: number;
    longitude: number;
    city?: string;
    country?: string;
  };
  interests: string[];
  preferences: {
    ageRange: { min: number; max: number };
    distance: number; // в километрах
    gender: ('male' | 'female' | 'other')[];
    showMe: boolean;
  };
  photos: string[];
  isOnline: boolean;
  lastSeen: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class UserProfileService {
  private static instance: UserProfileService;
  private readonly usersCollection = 'users';

  private constructor() {}

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  // Создание профиля
  async createProfile(profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const now = new Date();
    const fullProfile: UserProfile = {
      ...profile,
      createdAt: now,
      updatedAt: now,
    };

    await firestore()
      .collection(this.usersCollection)
      .doc(profile.uid)
      .set(fullProfile);

    return fullProfile;
  }

  // Получение профиля
  async getProfile(uid: string): Promise<UserProfile | null> {
    const doc = await firestore()
      .collection(this.usersCollection)
      .doc(uid)
      .get();

    return doc.exists ? (doc.data() as UserProfile) : null;
  }

  // Обновление профиля
  async updateProfile(uid: string, data: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await firestore()
      .collection(this.usersCollection)
      .doc(uid)
      .update({
        ...data,
        updatedAt: new Date(),
      });
  }

  // Загрузка фотографии
  async uploadPhoto(uid: string, uri: string): Promise<string> {
    const filename = `${uid}/${Date.now()}.jpg`;
    const reference = storage().ref(`photos/${filename}`);
    
    await reference.putFile(uri);
    const url = await reference.getDownloadURL();

    const userRef = firestore().collection(this.usersCollection).doc(uid);
    await userRef.update({
      photos: firestore.FieldValue.arrayUnion(url),
      updatedAt: new Date(),
    });

    return url;
  }

  // Удаление фотографии
  async deletePhoto(uid: string, photoURL: string): Promise<void> {
    const userRef = firestore().collection(this.usersCollection).doc(uid);
    
    // Удаляем URL из массива photos
    await userRef.update({
      photos: firestore.FieldValue.arrayRemove(photoURL),
      updatedAt: new Date(),
    });

    // Удаляем файл из Storage
    if (photoURL.startsWith('https://firebasestorage.googleapis.com')) {
      const photoRef = storage().refFromURL(photoURL);
      await photoRef.delete();
    }
  }

  // Обновление местоположения
  async updateLocation(uid: string, latitude: number, longitude: number): Promise<void> {
    const userRef = firestore().collection(this.usersCollection).doc(uid);
    
    await userRef.update({
      'location.latitude': latitude,
      'location.longitude': longitude,
      updatedAt: new Date(),
    });
  }

  // Расширенные фильтры поиска
  async findUsersWithFilters(
    currentUser: UserProfile,
    filters: {
      interests?: string[];
      verified?: boolean;
      hasPhoto?: boolean;
      onlineOnly?: boolean;
      lastActive?: number; // в часах
      excludeBlocked?: boolean;
      excludeLiked?: boolean;
      minPhotos?: number;
      maxDistance?: number;
      sortBy?: 'distance' | 'lastActive' | 'newest';
    } = {},
    limit: number = 20
  ): Promise<UserProfile[]> {
    let query = firestore()
      .collection(this.usersCollection)
      .where('preferences.showMe', '==', true)
      .where('gender', 'in', currentUser.preferences.gender);

    // Применяем базовые фильтры
    if (filters.verified) {
      query = query.where('isVerified', '==', true);
    }

    if (filters.hasPhoto) {
      query = query.where('photos', '!=', []);
    }

    if (filters.onlineOnly) {
      query = query.where('isOnline', '==', true);
    }

    if (filters.lastActive) {
      const lastActiveTime = new Date();
      lastActiveTime.setHours(lastActiveTime.getHours() - filters.lastActive);
      query = query.where('lastSeen', '>=', lastActiveTime);
    }

    if (filters.minPhotos) {
      // Firestore не поддерживает where по размеру массива,
      // поэтому фильтруем после получения данных
      query = query.where('photos', '!=', []);
    }

    // Получаем результаты
    const snapshot = await query.limit(limit * 2).get(); // Увеличиваем лимит для компенсации пост-фильтрации
    
    let profiles = snapshot.docs
      .map(doc => doc.data() as UserProfile)
      .filter(profile => {
        // Исключаем текущего пользователя
        if (profile.uid === currentUser.uid) return false;

        // Проверяем возраст
        const age = this.calculateAge(profile.birthDate);
        if (age < currentUser.preferences.ageRange.min || age > currentUser.preferences.ageRange.max) return false;

        // Проверяем минимальное количество фото
        if (filters.minPhotos && profile.photos.length < filters.minPhotos) return false;

        // Проверяем интересы
        if (filters.interests && filters.interests.length > 0) {
          const hasMatchingInterests = profile.interests.some(interest => 
            filters.interests!.includes(interest)
          );
          if (!hasMatchingInterests) return false;
        }

        // Проверяем расстояние
        const distance = this.calculateDistance(
          currentUser.location.latitude,
          currentUser.location.longitude,
          profile.location.latitude,
          profile.location.longitude
        );

        const maxDistance = filters.maxDistance || currentUser.preferences.distance;
        if (distance > maxDistance) return false;

        return true;
      });

    // Сортировка результатов
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'distance':
          profiles.sort((a, b) => {
            const distanceA = this.calculateDistance(
              currentUser.location.latitude,
              currentUser.location.longitude,
              a.location.latitude,
              a.location.longitude
            );
            const distanceB = this.calculateDistance(
              currentUser.location.latitude,
              currentUser.location.longitude,
              b.location.latitude,
              b.location.longitude
            );
            return distanceA - distanceB;
          });
          break;
        case 'lastActive':
          profiles.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
          break;
        case 'newest':
          profiles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
      }
    }

    // Ограничиваем количество результатов
    return profiles.slice(0, limit);
  }

  // Получение рекомендаций на основе интересов и активности
  async getRecommendations(userId: string, limit: number = 20): Promise<UserProfile[]> {
    const userProfile = await this.getProfile(userId);
    if (!userProfile) throw new Error('User not found');

    // Получаем пользователей с похожими интересами
    const snapshot = await firestore()
      .collection(this.usersCollection)
      .where('preferences.showMe', '==', true)
      .where('gender', 'in', userProfile.preferences.gender)
      .where('interests', 'array-contains-any', userProfile.interests)
      .limit(limit * 2)
      .get();

    const profiles = snapshot.docs
      .map(doc => doc.data() as UserProfile)
      .filter(profile => {
        if (profile.uid === userId) return false;

        const age = this.calculateAge(profile.birthDate);
        if (age < userProfile.preferences.ageRange.min || age > userProfile.preferences.ageRange.max) return false;

        const distance = this.calculateDistance(
          userProfile.location.latitude,
          userProfile.location.longitude,
          profile.location.latitude,
          profile.location.longitude
        );
        return distance <= userProfile.preferences.distance;
      });

    // Сортируем по количеству общих интересов
    profiles.sort((a, b) => {
      const commonInterestsA = a.interests.filter(interest => userProfile.interests.includes(interest)).length;
      const commonInterestsB = b.interests.filter(interest => userProfile.interests.includes(interest)).length;
      return commonInterestsB - commonInterestsA;
    });

    return profiles.slice(0, limit);
  }

  // Вычисление возраста
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Вычисление расстояния между двумя точками (формула гаверсинусов)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Радиус Земли в километрах
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default UserProfileService.getInstance(); 