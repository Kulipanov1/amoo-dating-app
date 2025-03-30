import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AnimatedBackground() {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, height],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8A2BE2', '#9370DB', '#8A2BE2']}
        style={styles.gradient}
      />
      <Animated.View
        style={[
          styles.animatedShape,
          {
            transform: [
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
            transform: [
              { translateX: translateX.interpolate({
                inputRange: [0, 1],
                outputRange: [width, -width],
              })},
              { translateY: translateY.interpolate({
                inputRange: [0, 1],
                outputRange: [height, -height],
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
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -width * 0.75,
    left: -width * 0.75,
  },
  animatedShape2: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -width * 0.6,
    right: -width * 0.6,
  },
}); 