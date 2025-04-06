import { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
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
  async registerWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await this.sendEmailVerification();
      return this.transformFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Вход по email
  async loginWithEmail(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return this.transformFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Вход через Google
  async loginWithGoogle(): Promise<AuthUser> {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      return this.transformFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Отправка письма для подтверждения email
  async sendEmailVerification(): Promise<void> {
    const user = auth().currentUser;
    if (user) {
      await user.sendEmailVerification();
    }
  }

  // Сброс пароля
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Выход
  async logout(): Promise<void> {
    try {
      await auth().signOut();
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.signOut();
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Получение текущего пользователя
  getCurrentUser(): AuthUser | null {
    const user = auth().currentUser;
    return user ? this.transformFirebaseUser(user) : null;
  }

  // Подписка на изменение состояния аутентификации
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return auth().onAuthStateChanged((user) => {
      callback(user ? this.transformFirebaseUser(user) : null);
    });
  }

  // Преобразование Firebase User в AuthUser
  private transformFirebaseUser(firebaseUser: any): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber,
      emailVerified: firebaseUser.emailVerified,
    };
  }

  // Обработка ошибок аутентификации
  private handleAuthError(error: any): Error {
    let message = 'Произошла ошибка при аутентификации';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Этот email уже используется';
        break;
      case 'auth/invalid-email':
        message = 'Неверный формат email';
        break;
      case 'auth/operation-not-allowed':
        message = 'Операция не разрешена';
        break;
      case 'auth/weak-password':
        message = 'Слишком слабый пароль';
        break;
      case 'auth/user-disabled':
        message = 'Аккаунт отключен';
        break;
      case 'auth/user-not-found':
        message = 'Пользователь не найден';
        break;
      case 'auth/wrong-password':
        message = 'Неверный пароль';
        break;
    }

    return new Error(message);
  }
}

export default AuthService.getInstance(); 