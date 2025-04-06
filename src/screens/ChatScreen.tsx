import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { ChatStackParamList } from '../types/navigation';
import type { Message } from '../services/ChatService';
import ChatService from '../services/ChatService';
import { auth } from '../config/firebase';

type ChatScreenNavigationProp = NavigationProp<ChatStackParamList, 'Chat'>;

interface ChatScreenProps {
  route: {
    params: {
      chatId: string;
      otherUserId: string;
      userName: string;
    };
  };
  navigation: ChatScreenNavigationProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { chatId, otherUserId, userName } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const chatService = useMemo(() => {
    return ChatService.getInstance();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chatMessages = await chatService.getMessages(chatId);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();

    const unsubscribe = chatService.onNewMessage(chatId, (newMessage: Message) => {
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    return () => unsubscribe();
  }, [chatId, chatService]);

  const handleSend = async () => {
    if (newMessage.trim() && auth.currentUser) {
      try {
        await chatService.sendMessage(chatId, auth.currentUser.uid, otherUserId, newMessage);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userName}</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => navigation.navigate('ChatList')}
        >
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.messageContainer,
              item.senderId === auth.currentUser?.uid ? styles.sentMessage : styles.receivedMessage
            ]}>
              <Text style={[
                styles.messageText,
                item.senderId === auth.currentUser?.uid ? styles.sentMessageText : styles.receivedMessageText
              ]}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Написать сообщение..."
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!newMessage.trim()}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={newMessage.trim() ? '#8A2BE2' : '#999'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  messageList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8A2BE2',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatScreen; 