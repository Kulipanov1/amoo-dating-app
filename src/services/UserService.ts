import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { AuthUser } from './AuthService';

export interface UserProfile {
  uid: string;
  displayName: string;
  bio: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  interests: string[];
  photos: string[];
  location?: {
    latitude: number;
    longitude: number;
    city: string;
  };
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    distance: number;
    gender: ('male' | 'female' | 'other')[];
  };
  lastActive: Date;
  isOnline: boolean;
  isVerified: boolean;
  matches: string[];
  likes: string[];
  dislikes: string[];
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  private static instance: UserService;
  private readonly usersCollection = collection(db, 'users');

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Создание профиля пользователя
  async createProfile(authUser: AuthUser, profile: Partial<UserProfile>): Promise<UserProfile> {
    const userProfile: UserProfile = {
      uid: authUser.uid,
      displayName: profile.displayName || authUser.displayName || '',
      bio: profile.bio || '',
      age: profile.age || 18,
      gender: profile.gender || 'other',
      interests: profile.interests || [],
      photos: profile.photos || [],
      preferences: profile.preferences || {
        ageRange: { min: 18, max: 100 },
        distance: 50,
        gender: ['male', 'female', 'other'],
      },
      lastActive: new Date(),
      isOnline: true,
      isVerified: false,
      matches: [],
      likes: [],
      dislikes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userRef = doc(this.usersCollection, authUser.uid);
    await setDoc(userRef, userProfile);

    return userProfile;
  }

  // Получение профиля пользователя
  async getProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(this.usersCollection, uid);
    const docSnap = await getDoc(userRef);

    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  }

  // Обновление профиля
  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(this.usersCollection, uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  // Загрузка фотографии
  async uploadPhoto(uid: string, uri: string): Promise<string> {
    const filename = `${uid}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    await uploadString(storageRef, uri, 'data_url');
    const url = await getDownloadURL(storageRef);

    const userRef = doc(this.usersCollection, uid);
    await updateDoc(userRef, {
      photos: arrayUnion(url),
      updatedAt: new Date(),
    });

    return url;
  }

  // Удаление фотографии
  async deletePhoto(uid: string, url: string): Promise<void> {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);

    const userRef = doc(this.usersCollection, uid);
    await updateDoc(userRef, {
      photos: arrayRemove(url),
      updatedAt: new Date(),
    });
  }

  // Поиск пользователей по критериям
  async findUsers(currentUser: UserProfile, limit: number = 20): Promise<UserProfile[]> {
    const { preferences } = currentUser;
    
    const q = query(
      this.usersCollection,
      where('age', '>=', preferences.ageRange.min),
      where('age', '<=', preferences.ageRange.max),
      where('gender', 'in', preferences.gender)
    );

    const snapshot = await getDocs(q);
    const users = snapshot.docs
      .map(doc => doc.data() as UserProfile)
      .filter(user => 
        user.uid !== currentUser.uid &&
        !currentUser.likes.includes(user.uid) &&
        !currentUser.dislikes.includes(user.uid)
      )
      .slice(0, limit);

    // Фильтрация по расстоянию, если есть геолокация
    if (currentUser.location) {
      return users.filter(user => 
        user.location && 
        this.calculateDistance(
          currentUser.location.latitude,
          currentUser.location.longitude,
          user.location.latitude,
          user.location.longitude
        ) <= preferences.distance
      );
    }

    return users;
  }

  // Обработка лайка
  async handleLike(userId: string, likedUserId: string): Promise<boolean> {
    const userRef = doc(this.usersCollection, userId);
    const likedUserRef = doc(this.usersCollection, likedUserId);

    // Добавляем лайк текущему пользователю
    await updateDoc(userRef, {
      likes: arrayUnion(likedUserId),
      updatedAt: new Date(),
    });

    // Проверяем взаимный лайк
    const likedUserDoc = await getDoc(likedUserRef);
    const isMatch = likedUserDoc.exists() && 
      (likedUserDoc.data() as UserProfile).likes.includes(userId);

    if (isMatch) {
      // Создаем матч для обоих пользователей
      await updateDoc(userRef, {
        matches: arrayUnion(likedUserId),
      });
      await updateDoc(likedUserRef, {
        matches: arrayUnion(userId),
      });
    }

    return isMatch;
  }

  // Обработка дизлайка
  async handleDislike(userId: string, dislikedUserId: string): Promise<void> {
    const userRef = doc(this.usersCollection, userId);
    await updateDoc(userRef, {
      dislikes: arrayUnion(dislikedUserId),
      updatedAt: new Date(),
    });
  }

  // Расчет расстояния между двумя точками (в километрах)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Радиус Земли в километрах
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export default UserService.getInstance(); 