import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LiveStream {
  id: number;
  hostName: string;
  hostImage: string;
  title: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
}

const dummyStreams: LiveStream[] = [
  {
    id: 1,
    hostName: 'Анна',
    hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    title: 'Давайте познакомимся! 💫',
    viewers: 128,
    thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
    isLive: true,
  },
  {
    id: 2,
    hostName: 'Михаил',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    title: 'Вечерний стрим 🌙',
    viewers: 256,
    thumbnail: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
    isLive: true,
  },
  {
    id: 3,
    hostName: 'Елена',
    hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    title: 'Общаемся на разные темы ✨',
    viewers: 64,
    thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
    isLive: true,
  },
];

export default function LiveScreen() {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [showStartStreamModal, setShowStartStreamModal] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');

  const handleStreamPress = (stream: LiveStream) => {
    setSelectedStream(stream);
    setShowModal(true);
  };

  const handleStartStream = () => {
    // Здесь будет логика начала стрима
    setShowStartStreamModal(false);
    setStreamTitle('');
  };

  const renderStreamCard = (stream: LiveStream) => (
    <TouchableOpacity
      key={stream.id}
      style={styles.streamCard}
      onPress={() => handleStreamPress(stream)}
    >
      <Image source={{ uri: stream.thumbnail }} style={styles.thumbnail} />
      <View style={styles.streamInfo}>
        <Image source={{ uri: stream.hostImage }} style={styles.hostImage} />
        <View style={styles.textContainer}>
          <Text style={styles.streamTitle}>{stream.title}</Text>
          <Text style={styles.hostName}>{stream.hostName}</Text>
          <View style={styles.viewersContainer}>
            <Ionicons name="eye-outline" size={16} color="#666" />
            <Text style={styles.viewersCount}>{stream.viewers}</Text>
          </View>
        </View>
      </View>
      {stream.isLive && <View style={styles.liveIndicator}><Text style={styles.liveText}>LIVE</Text></View>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.startStreamButton}
        onPress={() => setShowStartStreamModal(true)}
      >
        <Ionicons name="videocam" size={24} color="white" />
        <Text style={styles.startStreamText}>Начать трансляцию</Text>
      </TouchableOpacity>

      <ScrollView style={styles.streamList}>
        {dummyStreams.map(renderStreamCard)}
      </ScrollView>

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        {selectedStream && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedStream.title}</Text>
              <View style={styles.modalViewers}>
                <Ionicons name="eye-outline" size={16} color="#666" />
                <Text style={styles.viewersCount}>{selectedStream.viewers}</Text>
              </View>
            </View>

            <View style={styles.streamContent}>
              <Image source={{ uri: selectedStream.thumbnail }} style={styles.modalThumbnail} />
            </View>

            <View style={styles.commentSection}>
              <TextInput
                style={styles.commentInput}
                placeholder="Написать комментарий..."
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={24} color="#8A2BE2" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      <Modal
        visible={showStartStreamModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStartStreamModal(false)}
      >
        <View style={styles.startStreamModalContainer}>
          <View style={styles.startStreamModalContent}>
            <Text style={styles.startStreamModalTitle}>Начать трансляцию</Text>
            <TextInput
              style={styles.streamTitleInput}
              placeholder="Название трансляции"
              value={streamTitle}
              onChangeText={setStreamTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowStartStreamModal(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.startButton]}
                onPress={handleStartStream}
              >
                <Text style={styles.startButtonText}>Начать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  startStreamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
    padding: 15,
    margin: 15,
    borderRadius: 25,
    justifyContent: 'center',
  },
  startStreamText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  streamList: {
    flex: 1,
  },
  streamCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  streamInfo: {
    flexDirection: 'row',
    padding: 10,
  },
  hostImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  streamTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hostName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  viewersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  viewersCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  liveIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  liveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  modalViewers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streamContent: {
    flex: 1,
  },
  modalThumbnail: {
    width: '100%',
    height: '100%',
  },
  commentSection: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
  },
  startStreamModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startStreamModalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  startStreamModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  streamTitleInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  startButton: {
    backgroundColor: '#8A2BE2',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  startButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
}); 