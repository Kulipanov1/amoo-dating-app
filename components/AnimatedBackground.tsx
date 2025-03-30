import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 15000,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 15000,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ])
      ).start();
    };

    startAnimation();
    return () => {
      animatedValue.stopAnimation();
    };
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width/2, width/2],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-height/2, height/2],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8A2BE2', '#9370DB', '#8A2BE2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Animated.View
        style={[
          styles.animatedShape,
          {
            transform: Platform.OS === 'web' ? [
              { translateX: translateX },
              { translateY: translateY },
              { rotate: '45deg' },
            ] : [
              { translateX },
              { translateY },
              { rotate: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              })},
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.animatedShape2,
          {
            transform: Platform.OS === 'web' ? [
              { translateX: translateX },
              { translateY: translateY },
              { rotate: '-45deg' },
            ] : [
              { translateX: translateX.interpolate({
                inputRange: [0, 1],
                outputRange: [width/2, -width/2],
              })},
              { translateY: translateY.interpolate({
                inputRange: [0, 1],
                outputRange: [height/2, -height/2],
              })},
              { rotate: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['360deg', '0deg'],
              })},
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  animatedShape: {
    position: 'absolute',
    width: Math.max(width, height),
    height: Math.max(width, height),
    borderRadius: Math.max(width, height) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -Math.max(width, height) / 4,
    left: -Math.max(width, height) / 4,
  },
  animatedShape2: {
    position: 'absolute',
    width: Math.max(width, height) * 0.8,
    height: Math.max(width, height) * 0.8,
    borderRadius: Math.max(width, height) * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -Math.max(width, height) / 4,
    right: -Math.max(width, height) / 4,
  },
}); 