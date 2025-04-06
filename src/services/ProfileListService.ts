import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from './UserProfileService';
import ImageCacheService from './ImageCacheService';

class ProfileListService {
  private static instance: ProfileListService;
  private lastDoc: any = null;
  private isLoading: boolean = false;
  private hasMore: boolean = true;
  private readonly BATCH_SIZE = 10;
  private cachedProfiles: UserProfile[] = [];
  private preloadedProfiles: UserProfile[] = [];

  private constructor() {}

  public static getInstance(): ProfileListService {
    if (!ProfileListService.instance) {
      ProfileListService.instance = new ProfileListService();
    }
    return ProfileListService.instance;
  }

  private async preloadImages(profiles: UserProfile[]): Promise<void> {
    const imageCacheService = ImageCacheService.getInstance();
    await Promise.all(
      profiles.map(profile => 
        profile.photoURL ? imageCacheService.getImage(profile.photoURL) : Promise.resolve()
      )
    );
  }

  public async loadInitialProfiles(): Promise<UserProfile[]> {
    try {
      this.lastDoc = null;
      this.hasMore = true;
      this.cachedProfiles = [];
      this.preloadedProfiles = [];

      const profiles = await this.loadMoreProfiles();
      await this.preloadNextBatch(); // Предзагружаем следующую партию
      return profiles;
    } catch (error) {
      console.error('Error loading initial profiles:', error);
      throw error;
    }
  }

  public async loadMoreProfiles(): Promise<UserProfile[]> {
    if (this.isLoading || !this.hasMore) {
      return [];
    }

    try {
      this.isLoading = true;

      // Сначала используем предзагруженные профили, если они есть
      if (this.preloadedProfiles.length > 0) {
        const profiles = [...this.preloadedProfiles];
        this.preloadedProfiles = [];
        this.cachedProfiles.push(...profiles);
        await this.preloadNextBatch(); // Предзагружаем следующую партию
        return profiles;
      }

      const q = this.lastDoc
        ? query(
            collection(db, 'users'),
            orderBy('createdAt', 'desc'),
            startAfter(this.lastDoc),
            limit(this.BATCH_SIZE)
          )
        : query(
            collection(db, 'users'),
            orderBy('createdAt', 'desc'),
            limit(this.BATCH_SIZE)
          );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        this.hasMore = false;
        return [];
      }

      this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      const profiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];

      // Предзагружаем изображения для текущей партии
      await this.preloadImages(profiles);

      this.cachedProfiles.push(...profiles);
      return profiles;
    } catch (error) {
      console.error('Error loading more profiles:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private async preloadNextBatch(): Promise<void> {
    if (!this.hasMore || this.preloadedProfiles.length > 0) {
      return;
    }

    try {
      const q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        startAfter(this.lastDoc),
        limit(this.BATCH_SIZE)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        this.hasMore = false;
        return;
      }

      this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      this.preloadedProfiles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];

      // Предзагружаем изображения для следующей партии
      await this.preloadImages(this.preloadedProfiles);

    } catch (error) {
      console.error('Error preloading profiles:', error);
    }
  }

  public getCachedProfiles(): UserProfile[] {
    return this.cachedProfiles;
  }

  public hasMoreProfiles(): boolean {
    return this.hasMore;
  }

  public isLoadingProfiles(): boolean {
    return this.isLoading;
  }

  public clearCache(): void {
    this.cachedProfiles = [];
    this.preloadedProfiles = [];
    this.lastDoc = null;
    this.hasMore = true;
    this.isLoading = false;
  }
}

export default ProfileListService; 