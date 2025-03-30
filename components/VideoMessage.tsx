import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Video from 'react-native-video';

interface VideoMessageProps {
  uri: string;
  isCircular?: boolean;
}

export default function VideoMessage({ uri, isCircular = false }: VideoMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const containerStyle = isCircular ? styles.circularContainer : styles.container;
  const videoStyle = isCircular ? styles.circularVideo : styles.video;

  return (
    <View style={containerStyle}>
      <Video
        source={{ uri }}
        style={videoStyle}
        resizeMode="cover"
        repeat
        paused={!isPlaying}
        onError={(error) => console.error('Video error:', error)}
      />
      <TouchableOpacity 
        style={styles.playButton}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Ionicons 
          name={isPlaying ? "pause" : "play"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  circularContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  circularVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 