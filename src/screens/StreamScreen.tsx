import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StreamScreen = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStartStream = () => {
    setIsStreaming(true);
    // Здесь будет логика начала стрима
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    // Здесь будет логика остановки стрима
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Стримы</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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