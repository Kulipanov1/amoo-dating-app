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
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Query,
  CollectionReference,
  Timestamp,
  increment,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Match } from './MatchService';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  type?: 'text' | 'image' | 'video' | 'audio' | 'location';
  mediaUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: Timestamp;
  unreadCount: { [key: string]: number };
}

class ChatService {
  private static instance: ChatService;
  private chatsCollection = collection(db, 'chats');
  private messagesCollection = collection(db, 'messages');

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async createChat(userId1: string, userId2: string): Promise<string> {
    const chatDoc = await addDoc(this.chatsCollection, {
      participants: [userId1, userId2],
      unreadCount: { [userId1]: 0, [userId2]: 0 },
      createdAt: Timestamp.now(),
    });
    return chatDoc.id;
  }

  async getChat(chatId: string): Promise<Chat | null> {
    const chatRef = doc(this.chatsCollection, chatId);
    const chatDoc = await getDoc(chatRef);
    return chatDoc.exists() ? { id: chatDoc.id, ...chatDoc.data() } as Chat : null;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const q = query(
      this.chatsCollection,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTimestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Chat);
  }

  async sendMessage(chatId: string, senderId: string, receiverId: string, content: string, type: Message['type'] = 'text', mediaUrl?: string, location?: Message['location']): Promise<void> {
    const messageData: Omit<Message, 'id'> = {
      chatId,
      senderId,
      receiverId,
      content,
      timestamp: Timestamp.now(),
      type,
      ...(mediaUrl && { mediaUrl }),
      ...(location && { location }),
    };

    await addDoc(this.messagesCollection, messageData);

    const chatRef = doc(this.chatsCollection, chatId);
    await updateDoc(chatRef, {
      lastMessage: content,
      lastMessageTimestamp: Timestamp.now(),
      [`unreadCount.${receiverId}`]: increment(1),
    });
  }

  async getMessages(chatId: string, messageLimit: number = 50, startAfterTimestamp?: Date): Promise<Message[]> {
    let q = query(
      this.messagesCollection,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );

    if (startAfterTimestamp) {
      q = query(q, startAfter(Timestamp.fromDate(startAfterTimestamp)));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Message);
  }

  onNewMessage(chatId: string, callback: (message: Message) => void) {
    const q = query(
      this.messagesCollection,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const message = { id: change.doc.id, ...change.doc.data() } as Message;
          callback(message);
        }
      });
    });
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const chatRef = doc(this.chatsCollection, chatId);
    await updateDoc(chatRef, {
      [`unreadCount.${userId}`]: 0,
    });
  }

  async getChatByMatchId(matchId: string): Promise<Chat | null> {
    const q = query(
      this.chatsCollection,
      where('matchId', '==', matchId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Chat : null;
  }

  async sendMediaMessage(
    chatId: string,
    senderId: string,
    receiverId: string,
    type: 'image' | 'video' | 'audio',
    uri: string,
    caption?: string
  ): Promise<Message> {
    const filename = `chats/${chatId}/${Date.now()}_${type}`;
    const storageRef = ref(storage, filename);
    await uploadString(storageRef, uri, 'data_url');
    const mediaUrl = await getDownloadURL(storageRef);

    const messageData: Omit<Message, 'id'> = {
      chatId,
      senderId,
      receiverId,
      type,
      content: caption || '',
      mediaUrl,
      timestamp: Timestamp.now(),
    };

    const messageRef = await addDoc(this.messagesCollection, messageData);
    const message = { id: messageRef.id, ...messageData };

    await this.updateChatLastMessage(chatId, message, senderId);

    return message;
  }

  async sendLocation(
    chatId: string,
    senderId: string,
    receiverId: string,
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<Message> {
    const messageData: Omit<Message, 'id'> = {
      chatId,
      senderId,
      receiverId,
      type: 'location',
      content: address || 'Поделился местоположением',
      location: { latitude, longitude, address },
      timestamp: Timestamp.now(),
    };

    const messageRef = await addDoc(this.messagesCollection, messageData);
    const message = { id: messageRef.id, ...messageData };

    await this.updateChatLastMessage(chatId, message, senderId);

    return message;
  }

  private async updateChatLastMessage(chatId: string, message: Message, senderId: string): Promise<void> {
    const chatRef = doc(this.chatsCollection, chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) return;

    const chatData = chatDoc.data() as Chat;
    const updates: any = {
      lastMessage: message.content,
      lastMessageTimestamp: message.timestamp,
      updatedAt: message.timestamp,
    };

    chatData.participants.forEach(participantId => {
      if (participantId !== senderId) {
        updates[`unreadCount.${participantId}`] = increment(1);
      }
    });

    await updateDoc(chatRef, updates);
  }
}

export default ChatService.getInstance(); 