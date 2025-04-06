import firestore from '@react-native-firebase/firestore';
import { UserProfile } from './UserProfileService';

export interface Match {
  id: string;
  users: [string, string]; // ID пользователей
  createdAt: Date;
  lastInteractionAt: Date;
  isActive: boolean;
}

export interface Like {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: Date;
  isSuper: boolean;
}

class MatchService {
  private static instance: MatchService;
  private readonly matchesCollection = 'matches';
  private readonly likesCollection = 'likes';

  private constructor() {}

  public static getInstance(): MatchService {
    if (!MatchService.instance) {
      MatchService.instance = new MatchService();
    }
    return MatchService.instance;
  }

  // Создание лайка
  async createLike(fromUserId: string, toUserId: string, isSuper: boolean = false): Promise<{ isMatch: boolean; matchId?: string }> {
    // Проверяем, не лайкнул ли уже пользователь
    const existingLike = await this.checkExistingLike(fromUserId, toUserId);
    if (existingLike) {
      return { isMatch: false };
    }

    // Создаем новый лайк
    const likeRef = firestore().collection(this.likesCollection).doc();
    const like: Like = {
      id: likeRef.id,
      fromUserId,
      toUserId,
      createdAt: new Date(),
      isSuper,
    };

    await likeRef.set(like);

    // Проверяем взаимный лайк
    const mutualLike = await this.checkExistingLike(toUserId, fromUserId);
    if (mutualLike) {
      // Создаем мэтч
      const matchId = await this.createMatch(fromUserId, toUserId);
      return { isMatch: true, matchId };
    }

    return { isMatch: false };
  }

  // Проверка существующего лайка
  private async checkExistingLike(fromUserId: string, toUserId: string): Promise<boolean> {
    const likes = await firestore()
      .collection(this.likesCollection)
      .where('fromUserId', '==', fromUserId)
      .where('toUserId', '==', toUserId)
      .limit(1)
      .get();

    return !likes.empty;
  }

  // Создание мэтча
  private async createMatch(user1Id: string, user2Id: string): Promise<string> {
    const matchRef = firestore().collection(this.matchesCollection).doc();
    const match: Match = {
      id: matchRef.id,
      users: [user1Id, user2Id],
      createdAt: new Date(),
      lastInteractionAt: new Date(),
      isActive: true,
    };

    await matchRef.set(match);
    return match.id;
  }

  // Получение мэтчей пользователя
  async getUserMatches(userId: string): Promise<Match[]> {
    const matches = await firestore()
      .collection(this.matchesCollection)
      .where('users', 'array-contains', userId)
      .where('isActive', '==', true)
      .orderBy('lastInteractionAt', 'desc')
      .get();

    return matches.docs.map(doc => doc.data() as Match);
  }

  // Отмена мэтча
  async unmatch(matchId: string): Promise<void> {
    await firestore()
      .collection(this.matchesCollection)
      .doc(matchId)
      .update({
        isActive: false,
        lastInteractionAt: new Date(),
      });
  }

  // Получение списка лайков пользователя
  async getUserLikes(userId: string): Promise<Like[]> {
    const likes = await firestore()
      .collection(this.likesCollection)
      .where('toUserId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return likes.docs.map(doc => doc.data() as Like);
  }

  // Обновление времени последнего взаимодействия
  async updateLastInteraction(matchId: string): Promise<void> {
    await firestore()
      .collection(this.matchesCollection)
      .doc(matchId)
      .update({
        lastInteractionAt: new Date(),
      });
  }

  // Проверка существования мэтча между пользователями
  async checkMatchExists(user1Id: string, user2Id: string): Promise<boolean> {
    const matches = await firestore()
      .collection(this.matchesCollection)
      .where('users', 'array-contains', user1Id)
      .where('isActive', '==', true)
      .get();

    return matches.docs.some(doc => {
      const match = doc.data() as Match;
      return match.users.includes(user2Id);
    });
  }
}

export default MatchService.getInstance(); 