import { auth, db } from '../../config/firebase';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { AuthResponse, SocialAuthData, UserData } from '../../types/auth';

export class SocialAuthService {
  private providers = {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider(),
    apple: new OAuthProvider('apple.com')
  };

  async socialLogin(providerName: 'google' | 'facebook' | 'apple'): Promise<AuthResponse> {
    try {
      const provider = this.providers[providerName];
      
      // Добавляем необходимые scope
      if (providerName === 'google') {
        provider.addScope('profile');
        provider.addScope('email');
      } else if (providerName === 'facebook') {
        provider.addScope('email');
        provider.addScope('public_profile');
      }

      // Авторизация через попап
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Проверяем существование пользователя в базе
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Создаем нового пользователя
        const newUserData: UserData = {
          id: user.uid,
          email: user.email!,
          displayName: user.displayName!,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
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

        await setDoc(doc(db, 'users', user.uid), newUserData);
        
        const token = await user.getIdToken();
        return {
          user: newUserData,
          token,
          refreshToken: user.refreshToken
        };
      } else {
        // Обновляем время последнего входа
        const userData = userDoc.data() as UserData;
        
        if (userData.isBlocked) {
          throw new Error('USER_BLOCKED');
        }

        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: serverTimestamp()
        }, { merge: true });

        const token = await user.getIdToken();
        return {
          user: userData,
          token,
          refreshToken: user.refreshToken
        };
      }
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    }
  }

  async socialLoginWithToken(data: SocialAuthData): Promise<AuthResponse> {
    try {
      let credential;
      
      switch (data.provider) {
        case 'google':
          credential = GoogleAuthProvider.credential(data.token);
          break;
        case 'facebook':
          credential = FacebookAuthProvider.credential(data.token);
          break;
        case 'apple':
          credential = OAuthProvider.credential(data.token);
          break;
        default:
          throw new Error('UNSUPPORTED_PROVIDER');
      }

      const result = await signInWithCredential(auth, credential);
      const user = result.user;

      // Остальная логика аналогична socialLogin
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        const newUserData: UserData = {
          id: user.uid,
          email: user.email!,
          displayName: user.displayName || data.userData?.displayName || '',
          photoURL: user.photoURL || data.userData?.photoURL,
          emailVerified: user.emailVerified,
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

        await setDoc(doc(db, 'users', user.uid), newUserData);
        
        const token = await user.getIdToken();
        return {
          user: newUserData,
          token,
          refreshToken: user.refreshToken
        };
      } else {
        const userData = userDoc.data() as UserData;
        
        if (userData.isBlocked) {
          throw new Error('USER_BLOCKED');
        }

        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: serverTimestamp()
        }, { merge: true });

        const token = await user.getIdToken();
        return {
          user: userData,
          token,
          refreshToken: user.refreshToken
        };
      }
    } catch (error) {
      console.error('Social login with token error:', error);
      throw error;
    }
  }
} 