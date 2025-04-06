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
import { app } from '../config/firebase';
import storage from '@react-native-firebase/storage';
import { Match } from './MatchService';

const firestore = getFirestore(app);

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
  private chatsCollection = collection(firestore, 'chats');
  private messagesCollection = collection(firestore, 'messages');

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
    const chatQuery = query(this.chatsCollection, where('id', '==', chatId));
    const snapshot = await getDocs(chatQuery);
    if (snapshot.empty) return null;
    const chatDoc = snapshot.docs[0];
    return { id: chatDoc.id, ...chatDoc.data() } as Chat;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const chatsQuery = query(
      this.chatsCollection,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTimestamp', 'desc')
    );
    const snapshot = await getDocs(chatsQuery);
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

  async getMessages(chatId: string): Promise<Message[]> {
    const messagesQuery = query(
      this.messagesCollection,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Message);
  }

  onNewMessage(chatId: string, callback: (message: Message) => void) {
    const messagesQuery = query(
      this.messagesCollection,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(messagesQuery, (snapshot) => {
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

  // Получение чата по ID мэтча
  async getChatByMatchId(matchId: string): Promise<Chat | null> {
    const chats = await getDocs(
      query(
        this.chatsCollection,
        where('matchId', '==', matchId)
      )
    );

    return !chats.empty ? (chats.docs[0].data() as Chat) : null;
  }

  // Отправка медиа-сообщения (изображение, видео, аудио)
  async sendMediaMessage(
    chatId: string,
    senderId: string,
    type: 'image' | 'video' | 'audio',
    uri: string,
    caption?: string
  ): Promise<Message> {
    // Загружаем медиафайл
    const filename = `chats/${chatId}/${Date.now()}_${type}`;
    const reference = storage().ref(filename);
    await reference.putFile(uri);
    const mediaUrl = await reference.getDownloadURL();

    const messageRef = firestore().collection(this.messagesCollection).doc();
    const now = new Date();

    const message: Message = {
      id: messageRef.id,
      chatId,
      senderId,
      type,
      content: caption || '',
      mediaUrl,
      timestamp: Timestamp.fromDate(now),
    };

    await messageRef.set(message);
    await this.updateChatLastMessage(chatId, message, senderId);

    return message;
  }

  // Отправка локации
  async sendLocation(
    chatId: string,
    senderId: string,
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<Message> {
    const messageRef = firestore().collection(this.messagesCollection).doc();
    const now = new Date();

    const message: Message = {
      id: messageRef.id,
      chatId,
      senderId,
      type: 'location',
      content: address || 'Поделился местоположением',
      location: { latitude, longitude, address },
      timestamp: Timestamp.fromDate(now),
    };

    await messageRef.set(message);
    await this.updateChatLastMessage(chatId, message, senderId);

    return message;
  }

  // Получение сообщений чата
  async getMessages(chatId: string, limit: number = 50, startAfter?: Date): Promise<Message[]> {
    let query = firestore()
      .collection(this.messagesCollection)
      .where('chatId', '==', chatId)
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as Message);
  }

  // Обновление последнего сообщения в чате
  private async updateChatLastMessage(chatId: string, message: Message, senderId: string): Promise<void> {
    const chatRef = firestore().collection(this.chatsCollection).doc(chatId);
    const chat = await chatRef.get();
    
    if (!chat.exists) return;

    const chatData = chat.data() as Chat;
    const updates: any = {
      lastMessage: message.content,
      lastMessageTimestamp: message.timestamp,
      updatedAt: message.timestamp.toDate(),
    };

    // Увеличиваем счетчик непрочитанных сообщений для всех участников, кроме отправителя
    chatData.participants.forEach(participantId => {
      if (participantId !== senderId) {
        updates[`unreadCount.${participantId}`] = firestore.FieldValue.increment(1);
      }
    });

    await chatRef.update(updates);
  }
}

export default ChatService.getInstance(); 