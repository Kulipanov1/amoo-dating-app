import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface AuthUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {
    // Инициализация Google Sign-In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // Получите в Firebase Console
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Регистрация по email
  async registerWithEmail(email: string, password: string, displayName: string): Promise<AuthUser> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName });
      
      // Создаем документ пользователя в Firestore
      await firestore().collection('users').doc(userCredential.user.uid).set({
        email,
        displayName,
        createdAt: new Date(),
        emailVerified: false,
        photoURL: null,
        isOnline: true,
        lastSeen: new Date(),
      });

      // Отправляем email для верификации
      await userCredential.user.sendEmailVerification();

      return this.transformUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Вход по email
  async loginWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      
      // Обновляем статус онлайн
      await firestore().collection('users').doc(userCredential.user.uid).update({
        isOnline: true,
        lastSeen: new Date(),
      });

      return this.transformUser(userCredential.user);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Вход через Google
  async loginWithGoogle(): Promise<AuthUser> {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      return this.transformUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Выход
  async logout(): Promise<void> {
    try {
      const user = auth().currentUser;
      if (user) {
        // Обновляем статус оффлайн
        await firestore().collection('users').doc(user.uid).update({
          isOnline: false,
          lastSeen: new Date(),
        });
      }
      await auth().signOut();
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Сброс пароля
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Обновление профиля
  async updateProfile(data: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const user = auth().currentUser;
      if (!user) throw new Error('User not authenticated');

      await user.updateProfile(data);
      await firestore().collection('users').doc(user.uid).update(data);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Получение текущего пользователя
  getCurrentUser(): AuthUser | null {
    const user = auth().currentUser;
    return user ? this.transformUser(user) : null;
  }

  // Подписка на изменения состояния аутентификации
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return auth().onAuthStateChanged((user) => {
      callback(user ? this.transformUser(user) : null);
    });
  }

  // Трансформация пользователя Firebase в AuthUser
  private transformUser(user: FirebaseAuthTypes.User): AuthUser {
    return {
      uid: user.uid,
      email: user.email!,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }

  // Обработка ошибок аутентификации
  private handleAuthError(error: any): Error {
    let message = 'Произошла ошибка аутентификации';
    
    if (error.code === 'auth/email-already-in-use') {
      message = 'Этот email уже используется';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Неверный формат email';
    } else if (error.code === 'auth/weak-password') {
      message = 'Слишком слабый пароль';
    } else if (error.code === 'auth/user-not-found') {
      message = 'Пользователь не найден';
    } else if (error.code === 'auth/wrong-password') {
      message = 'Неверный пароль';
    }

    return new Error(message);
  }
}

export default AuthService.getInstance(); 