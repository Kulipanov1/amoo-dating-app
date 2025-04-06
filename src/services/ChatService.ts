import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { UserProfile } from './UserService';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    text: string;
    timestamp: Date;
    senderId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

class ChatService {
  private static instance: ChatService;
  private readonly chatsCollection = 'chats';
  private readonly messagesCollection = 'messages';

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Создание нового чата
  async createChat(user1Id: string, user2Id: string): Promise<Chat> {
    const chatRef = firestore().collection(this.chatsCollection).doc();
    const chat: Chat = {
      id: chatRef.id,
      participants: [user1Id, user2Id],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await chatRef.set(chat);
    return chat;
  }

  // Получение чата по ID
  async getChat(chatId: string): Promise<Chat | null> {
    const doc = await firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .get();

    return doc.exists ? (doc.data() as Chat) : null;
  }

  // Получение всех чатов пользователя
  async getUserChats(userId: string): Promise<Chat[]> {
    const snapshot = await firestore()
      .collection(this.chatsCollection)
      .where('participants', 'array-contains', userId)
      .orderBy('updatedAt', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as Chat);
  }

  // Отправка текстового сообщения
  async sendMessage(chatId: string, senderId: string, text: string): Promise<Message> {
    const messageRef = firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .collection(this.messagesCollection)
      .doc();

    const message: Message = {
      id: messageRef.id,
      chatId,
      senderId,
      text,
      timestamp: new Date(),
      read: false,
      type: 'text',
    };

    const batch = firestore().batch();
    
    // Сохраняем сообщение
    batch.set(messageRef, message);
    
    // Обновляем последнее сообщение в чате
    batch.update(firestore().collection(this.chatsCollection).doc(chatId), {
      lastMessage: {
        text,
        timestamp: message.timestamp,
        senderId,
      },
      updatedAt: message.timestamp,
    });

    await batch.commit();
    return message;
  }

  // Отправка медиа-сообщения
  async sendMediaMessage(
    chatId: string,
    senderId: string,
    uri: string,
    type: 'image' | 'video' | 'audio'
  ): Promise<Message> {
    // Загружаем медиафайл
    const filename = `chats/${chatId}/${Date.now()}_${type}`;
    const reference = storage().ref(filename);
    await reference.putFile(uri);
    const mediaUrl = await reference.getDownloadURL();

    const messageRef = firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .collection(this.messagesCollection)
      .doc();

    const message: Message = {
      id: messageRef.id,
      chatId,
      senderId,
      text: `${type} message`,
      timestamp: new Date(),
      read: false,
      type,
      mediaUrl,
    };

    const batch = firestore().batch();
    
    batch.set(messageRef, message);
    batch.update(firestore().collection(this.chatsCollection).doc(chatId), {
      lastMessage: {
        text: message.text,
        timestamp: message.timestamp,
        senderId,
      },
      updatedAt: message.timestamp,
    });

    await batch.commit();
    return message;
  }

  // Получение сообщений чата
  async getMessages(chatId: string, limit: number = 50): Promise<Message[]> {
    const snapshot = await firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .collection(this.messagesCollection)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data() as Message);
  }

  // Отметка сообщений как прочитанных
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const batch = firestore().batch();
    const messages = await firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .collection(this.messagesCollection)
      .where('read', '==', false)
      .where('senderId', '!=', userId)
      .get();

    messages.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  }

  // Подписка на новые сообщения
  onNewMessage(chatId: string, callback: (message: Message) => void): () => void {
    return firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .collection(this.messagesCollection)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            callback(change.doc.data() as Message);
          }
        });
      });
  }

  // Подписка на обновления чата
  onChatUpdated(chatId: string, callback: (chat: Chat) => void): () => void {
    return firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          callback(snapshot.data() as Chat);
        }
      });
  }
}

export default ChatService.getInstance(); 