import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs, limit, startAfter, orderBy, DocumentData, QueryDocumentSnapshot, Query, CollectionReference } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../config/firebase';

const firestore = getFirestore(app);
const storage = getStorage(app);

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  bio?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  interests: string[];
  photos: string[];
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    distance: number;
    gender: ('male' | 'female' | 'other')[];
    showMe: boolean;
  };
  isOnline: boolean;
  lastSeen: Date;
  isVerified: boolean;
}

interface FindUsersOptions {
  page: number;
  limit: number;
  userId: string;
  filters?: {
    ageRange?: { min: number; max: number };
    distance?: number;
    gender?: ('male' | 'female' | 'other')[];
    interests?: string[];
  };
}

class UserProfileService {
  private static instance: UserProfileService;
  private usersCollection: CollectionReference<DocumentData>;
  private likesCollection: CollectionReference<DocumentData>;

  private constructor() {
    this.usersCollection = collection(firestore, 'users');
    this.likesCollection = collection(firestore, 'likes');
  }

  static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  async createProfile(profile: UserProfile): Promise<void> {
    const userRef = doc(this.usersCollection, profile.uid);
    await setDoc(userRef, {
      ...profile,
      birthDate: profile.birthDate.toISOString(),
      lastSeen: profile.lastSeen.toISOString(),
    });
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(this.usersCollection, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    return {
      ...data,
      birthDate: new Date(data.birthDate),
      lastSeen: new Date(data.lastSeen),
    } as UserProfile;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(this.usersCollection, userId);
    await updateDoc(userRef, updates);
  }

  async uploadPhoto(userId: string, file: File): Promise<string> {
    const photoRef = ref(storage, `users/${userId}/photos/${Date.now()}_${file.name}`);
    await uploadBytes(photoRef, file);
    return getDownloadURL(photoRef);
  }

  async deletePhoto(photoUrl: string): Promise<void> {
    const photoRef = ref(storage, photoUrl);
    await deleteObject(photoRef);
  }

  async findUsers({ page, limit: pageLimit, userId, filters }: FindUsersOptions): Promise<UserProfile[]> {
    const userProfile = await this.getProfile(userId);
    if (!userProfile) {
      throw new Error('Профиль пользователя не найден');
    }

    let baseQuery = query(
      this.usersCollection,
      where('uid', '!=', userId),
      where('preferences.showMe', '==', true)
    );

    if (filters?.gender && filters.gender.length > 0) {
      baseQuery = query(baseQuery, where('gender', 'in', filters.gender));
    }

    // Применяем пагинацию
    baseQuery = query(baseQuery, orderBy('lastSeen', 'desc'), limit(pageLimit));
    if (page > 1) {
      const lastDoc = await this.getLastDocumentFromPreviousPage(baseQuery, page, pageLimit);
      if (lastDoc) {
        baseQuery = query(baseQuery, startAfter(lastDoc));
      }
    }

    const snapshot = await getDocs(baseQuery);
    const users = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      ...doc.data(),
      birthDate: new Date(doc.data().birthDate),
      lastSeen: new Date(doc.data().lastSeen),
    })) as UserProfile[];

    // Фильтруем результаты по возрасту и расстоянию на стороне клиента
    return users.filter(user => {
      if (filters?.ageRange) {
        const age = this.calculateAge(user.birthDate);
        if (age < filters.ageRange.min || age > filters.ageRange.max) {
          return false;
        }
      }

      if (filters?.distance) {
        const distance = this.calculateDistance(
          userProfile.location.latitude,
          userProfile.location.longitude,
          user.location.latitude,
          user.location.longitude
        );
        if (distance > filters.distance) {
          return false;
        }
      }

      return true;
    });
  }

  async likeUser(userId: string, targetUserId: string): Promise<boolean> {
    const likeRef = doc(this.likesCollection, `${userId}_${targetUserId}`);
    await setDoc(likeRef, {
      userId,
      targetUserId,
      timestamp: new Date().toISOString(),
    });

    // Проверяем взаимный лайк
    const mutualLikeRef = doc(this.likesCollection, `${targetUserId}_${userId}`);
    const mutualLikeDoc = await getDoc(mutualLikeRef);

    return mutualLikeDoc.exists();
  }

  private async getLastDocumentFromPreviousPage(
    q: Query<DocumentData>,
    page: number,
    pageLimit: number
  ): Promise<QueryDocumentSnapshot<DocumentData> | null> {
    if (page <= 1) return null;
    const prevPageQuery = query(q, limit((page - 1) * pageLimit));
    const snapshot = await getDocs(prevPageQuery);
    return snapshot.docs[snapshot.docs.length - 1];
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export default UserProfileService.getInstance(); 