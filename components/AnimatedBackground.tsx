import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AnimatedBackground() {
  const { width, height } = Dimensions.get('window');
  const isDesktop = Platform.OS === 'web' && width > 768;

  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(animation1, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(animation1, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animation2, {
            toValue: 1,
            duration: 25000,
            useNativeDriver: true,
          }),
          Animated.timing(animation2, {
            toValue: 0,
            duration: 25000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(animation3, {
            toValue: 1,
            duration: 30000,
            useNativeDriver: true,
          }),
          Animated.timing(animation3, {
            toValue: 0,
            duration: 30000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, [animation1, animation2, animation3]);

  const translateX1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.7],
  });

  const translateY1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.4],
  });

  const rotate1 = animation1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const translateX2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.5, -width * 0.3],
  });

  const translateY2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.6, height * 0.2],
  });

  const rotate2 = animation2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const translateX3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.2, width * 0.4],
  });

  const translateY3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: [height * 0.3, height * 0.7],
  });

  const rotate3 = animation3.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '540deg'],
  });

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <LinearGradient
        colors={['#8A2BE2', '#9400D3', '#8A2BE2']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Animated.View
        style={[
          styles.shape,
          {
            transform: [
              { translateX: translateX1 },
              { translateY: translateY1 },
              { rotate: rotate1 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      <Animated.View
        style={[
          styles.shape,
          styles.shape2,
          {
            transform: [
              { translateX: translateX2 },
              { translateY: translateY2 },
              { rotate: rotate2 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.02)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.shape,
          styles.shape3,
          {
            transform: [
              { translateX: translateX3 },
              { translateY: translateY3 },
              { rotate: rotate3 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.03)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  desktopContainer: {
    borderRadius: 20,
  },
  shape: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    overflow: 'hidden',
  },
  shape2: {
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  shape3: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  gradient: {
    flex: 1,
  },
}); 