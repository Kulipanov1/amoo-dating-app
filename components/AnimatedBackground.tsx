import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedBackground = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    const move = Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: true,
        }),
      ])
    );

    fadeIn.start();
    move.start();

    return () => {
      move.stop();
    };
  }, []);

  const { width, height } = Dimensions.get('window');
  const gradientSize = Math.max(width, height) * 1.5;

  const translateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-gradientSize / 4, gradientSize / 4],
  });

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-gradientSize / 4, gradientSize / 4],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.gradientContainer,
          {
            transform: [{ translateX }, { translateY }],
            opacity: fadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={['#8A2BE2', '#4CAF50', '#8A2BE2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { width: gradientSize, height: gradientSize }]}
        />
      </Animated.View>
      <View style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradientContainer: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
  },
  gradient: {
    borderRadius: 1000,
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default AnimatedBackground; 