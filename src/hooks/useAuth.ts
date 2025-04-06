import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../config/firebase';
import { User } from 'firebase/auth';
import { useNotification } from '../components/NotificationProvider';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      showNotification('Успешный вход в систему', 'success');
    } catch (error: any) {
      showNotification(error.message, 'error');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      showNotification('Аккаунт успешно создан', 'success');
    } catch (error: any) {
      showNotification(error.message, 'error');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      showNotification('Вы успешно вышли из системы', 'success');
    } catch (error: any) {
      showNotification(error.message, 'error');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await auth.sendPasswordResetEmail(email);
      showNotification('Инструкции по сбросу пароля отправлены на email', 'success');
    } catch (error: any) {
      showNotification(error.message, 'error');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 