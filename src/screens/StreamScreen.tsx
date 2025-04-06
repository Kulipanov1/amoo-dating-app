import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StreamsStackParamList } from '../types/navigation';

type StreamScreenNavigationProp = StackNavigationProp<StreamsStackParamList, 'Streams'>;

const StreamScreen = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const navigation = useNavigation<StreamScreenNavigationProp>();

  const handleStartStream = () => {
    setIsStreaming(true);
    // Здесь будет логика начала стрима
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    // Здесь будет логика остановки стрима
  };

  const handleViewStreams = () => {
    navigation.navigate('Live');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Стримы</Text>
        <TouchableOpacity 
          style={styles.viewStreamsButton}
          onPress={handleViewStreams}
        >
          <MaterialIcons name="live-tv" size={24} color="#8A2BE2" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {isStreaming ? (
          <View style={styles.streamContainer}>
            <Text style={styles.streamText}>Стрим идет...</Text>
            <TouchableOpacity
              style={[styles.button, styles.stopButton]}
              onPress={handleStopStream}
            >
              <MaterialIcons name="stop" size={24} color="#fff" />
              <Text style={styles.buttonText}>Остановить стрим</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={handleStartStream}
          >
            <MaterialIcons name="videocam" size={24} color="#fff" />
            <Text style={styles.buttonText}>Начать стрим</Text>
          </TouchableOpacity>
        )}
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  viewStreamsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  streamContainer: {
    alignItems: 'center',
  },
  streamText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default StreamScreen; 