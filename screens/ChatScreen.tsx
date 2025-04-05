import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { StackScreenProps } from '@react-navigation/stack';
import ScreenWrapper from '../components/ScreenWrapper';
import { SendIcon, CameraIcon, MicrophoneIcon } from '../components/Icons';
import Message from '../components/Message';
import AnimatedBackground from '../components/AnimatedBackground';
import { ChatStackParamList } from '../types/navigation';
import { ChatScreenProps } from '../types/navigation';

type Props = StackScreenProps<ChatStackParamList, 'Chat'>;

interface Message {
  id: string;
  text?: string;
  image?: string;
  audio?: string;
  timestamp: Date;
  isRead: boolean;
  isSent: boolean;
  isDelivered: boolean;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
}

const dummyMessages: Message[] = [
  {
    id: '1',
    text: 'Привет! Как дела?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: true,
    isSent: true,
    isDelivered: true,
    sender: {
      id: '2',
      name: 'Анна Иванова',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
    },
  },
  {
    id: '2',
    text: 'Привет! Все хорошо, спасибо! У тебя как?',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    isRead: true,
    isSent: true,
    isDelivered: true,
    sender: {
      id: '1',
      name: 'Я',
      avatar: 'https://example.com/my-avatar.jpg',
    },
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    isRead: true,
    isSent: true,
    isDelivered: true,
    sender: {
      id: '2',
      name: 'Анна Иванова',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
    },
  },
];

type AttachmentType = 'media' | 'documents' | 'links';

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentType, setAttachmentType] = useState<AttachmentType>('media');
  
  const { width: windowWidth } = Dimensions.get('window');
  const isDesktop = Platform.OS === 'web' && windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const userId = '1'; // Текущий пользователь
  const otherUser = {
    id: route.params.userId,
    name: route.params.userName,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3',
  };

  useEffect(() => {
    navigation.setOptions({
      title: otherUser.name,
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Profile', { userId: otherUser.id })}
        >
          <Image source={{ uri: otherUser.avatar }} style={styles.headerAvatar} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, otherUser]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        timestamp: new Date(),
        isRead: false,
        isSent: true,
        isDelivered: false,
        sender: {
          id: userId,
          name: 'Я',
          avatar: 'https://example.com/my-avatar.jpg',
        },
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage: Message = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        timestamp: new Date(),
        isRead: false,
        isSent: true,
        isDelivered: false,
        sender: {
          id: userId,
          name: 'Я',
          avatar: 'https://example.com/my-avatar.jpg',
        },
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        const newMessage: Message = {
          id: Date.now().toString(),
          audio: uri,
          timestamp: new Date(),
          isRead: false,
          isSent: true,
          isDelivered: false,
          sender: {
            id: userId,
            name: 'Я',
            avatar: 'https://example.com/my-avatar.jpg',
          },
        };
        
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }

    setRecording(null);
    setIsRecording(false);
  };

  const handleUserPress = () => {
    navigation.navigate('UserProfile', { userId: route.params.userId });
  };

  const renderAttachments = () => {
    switch (attachmentType) {
      case 'media':
        return (
          <FlatList
            data={[]}
            renderItem={() => null}
            numColumns={3}
            style={styles.attachmentsList}
          />
        );
      case 'documents':
        return (
          <FlatList
            data={[]}
            renderItem={() => null}
            style={styles.attachmentsList}
          />
        );
      case 'links':
        return (
          <FlatList
            data={[]}
            renderItem={() => null}
            style={styles.attachmentsList}
          />
        );
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.sender.id === userId;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <Image source={{ uri: item.sender.avatar }} style={styles.messageAvatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble
        ]}>
          {item.text && (
            <Text style={[
              styles.messageText,
              isOwnMessage && styles.ownMessageText
            ]}>
              {item.text}
            </Text>
          )}
          
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}
          
          {item.audio && (
            <TouchableOpacity style={styles.audioContainer}>
              <Ionicons
                name="play"
                size={24}
                color={isOwnMessage ? 'white' : '#8A2BE2'}
              />
              <View style={[
                styles.audioWaveform,
                isOwnMessage && styles.ownAudioWaveform
              ]}>
                {/* Здесь можно добавить визуализацию аудио */}
              </View>
            </TouchableOpacity>
          )}
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              isOwnMessage && styles.ownMessageTime
            ]}>
              {formatTime(item.timestamp)}
            </Text>
            {isOwnMessage && (
              <View style={styles.messageStatus}>
                {item.isDelivered && (
                  <Ionicons
                    name={item.isRead ? "checkmark-done" : "checkmark"}
                    size={16}
                    color={item.isRead ? "#4CAF50" : "#666"}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper isDesktop={isDesktop} contentWidth={contentWidth}>
      <View style={styles.container}>
        <AnimatedBackground />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUserPress} style={styles.userInfo}>
              <Image
                source={{ uri: route.params.userAvatar }}
                style={styles.avatar}
              />
              <View style={styles.userTextInfo}>
                <Text style={styles.userName}>{route.params.userName}</Text>
                <Text style={styles.userStatus}>В сети</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.button} onPress={handleImagePick}>
              <CameraIcon size={24} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Введите сообщение..."
              placeholderTextColor="#999"
              multiline
            />
            {inputText.trim() ? (
              <TouchableOpacity style={styles.button} onPress={handleSend}>
                <SendIcon size={24} color="#FF4B6E" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPressIn={startRecording}
                onPressOut={stopRecording}
              >
                <MicrophoneIcon size={24} color={isRecording ? "#f44336" : "#666"} />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
      <Modal
        visible={showAttachments}
        animationType="slide"
        onRequestClose={() => setShowAttachments(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAttachments(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Вложения</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, attachmentType === 'media' && styles.activeTab]}
              onPress={() => setAttachmentType('media')}
            >
              <Text style={[styles.tabText, attachmentType === 'media' && styles.activeTabText]}>
                Медиа
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, attachmentType === 'documents' && styles.activeTab]}
              onPress={() => setAttachmentType('documents')}
            >
              <Text style={[styles.tabText, attachmentType === 'documents' && styles.activeTabText]}>
                Документы
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, attachmentType === 'links' && styles.activeTab]}
              onPress={() => setAttachmentType('links')}
            >
              <Text style={[styles.tabText, attachmentType === 'links' && styles.activeTabText]}>
                Ссылки
              </Text>
            </TouchableOpacity>
          </View>
          {renderAttachments()}
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userTextInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userStatus: {
    fontSize: 12,
    color: '#666',
  },
  menuButton: {
    padding: 8,
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    backgroundColor: '#F0E6FF',
    borderRadius: 20,
    padding: 12,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: '#8A2BE2',
  },
  otherBubble: {
    backgroundColor: '#F0E6FF',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  ownMessageText: {
    color: 'white',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 4,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  audioWaveform: {
    flex: 1,
    height: 32,
    backgroundColor: '#E3D3FF',
    borderRadius: 16,
    marginLeft: 8,
  },
  ownAudioWaveform: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E3D3FF',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    maxHeight: 100,
    color: '#333',
  },
  button: {
    padding: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#8A2BE2',
    fontWeight: '600',
  },
  attachmentsList: {
    flex: 1,
    padding: 16,
  },
});

export default ChatScreen; 