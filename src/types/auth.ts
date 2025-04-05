export interface UserData {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  isBlocked: boolean;
  blockedReason?: string;
  verificationStatus: 'NONE' | 'PENDING' | 'VERIFIED';
  preferences: UserPreferences;
  settings: UserSettings;
}

export interface UserPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  distance: number;
  gender: 'male' | 'female' | 'other';
  showMe: 'male' | 'female' | 'all';
  language: string;
}

export interface UserSettings {
  notifications: {
    matches: boolean;
    messages: boolean;
    likes: boolean;
    system: boolean;
  };
  privacy: {
    showOnline: boolean;
    showDistance: boolean;
    showLastActive: boolean;
  };
}

export interface AuthResponse {
  user: UserData;
  token: string;
  refreshToken: string;
}

export interface SocialAuthData {
  provider: 'google' | 'facebook' | 'apple';
  token: string;
  userData?: Partial<UserData>;
} 