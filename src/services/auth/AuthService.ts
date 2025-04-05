import { auth, db } from '../../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UserData, AuthResponse } from '../../types/auth';

export class AuthService {
  async register(email: string, password: string, userData: Partial<UserData>): Promise<AuthResponse> {
    try {
      // Создание пользователя в Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Обновление профиля пользователя
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL
      });

      // Создание документа пользователя в Firestore
      const userDoc = doc(db, 'users', user.uid);
      const newUserData: UserData = {
        id: user.uid,
        email: user.email!,
        displayName: userData.displayName!,
        photoURL: userData.photoURL,
        emailVerified: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isBlocked: false,
        verificationStatus: 'NONE',
        preferences: {
          ageRange: { min: 18, max: 35 },
          distance: 50,
          gender: 'other',
          showMe: 'all',
          language: 'ru'
        },
        settings: {
          notifications: {
            matches: true,
            messages: true,
            likes: true,
            system: true
          },
          privacy: {
            showOnline: true,
            showDistance: true,
            showLastActive: true
          }
        }
      };

      await setDoc(userDoc, newUserData);

      // Отправка верификационного email
      await sendEmailVerification(user);

      // Получение токена
      const token = await user.getIdToken();

      return {
        user: newUserData,
        token,
        refreshToken: user.refreshToken
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Проверка блокировки
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data() as UserData;

      if (userData.isBlocked) {
        throw new Error('USER_BLOCKED');
      }

      // Обновление времени последнего входа
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: serverTimestamp()
      });

      // Получение токена
      const token = await user.getIdToken();

      return {
        user: userData,
        token,
        refreshToken: user.refreshToken
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserData>): Promise<void> {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, updates);

      // Обновление профиля в Firebase Auth если необходимо
      if (updates.displayName || updates.photoURL) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateProfile(currentUser, {
            displayName: updates.displayName,
            photoURL: updates.photoURL
          });
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
} 