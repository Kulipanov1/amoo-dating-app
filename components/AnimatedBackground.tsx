import React, { useEffect, useRef } from 'react';
import { View, Dimensions, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const gradientSize = Math.max(width, height) * 2;

export default function AnimatedBackground() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const orb1Anim = useRef(new Animated.Value(0)).current;
  const orb2Anim = useRef(new Animated.Value(0)).current;
  const orb3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Основная анимация фона
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 30000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 30000,
            useNativeDriver: true,
          }),
        ])
      ),
      // Пульсация
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Анимации орбов
    const orbAnimations = [orb1Anim, orb2Anim, orb3Anim].map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 12000 + index * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 12000 + index * 2000,
            useNativeDriver: true,
          }),
        ])
      )
    );

    orbAnimations.forEach(animation => animation.start());

    return () => {
      [fadeAnim, moveAnim, rotateAnim, scaleAnim, orb1Anim, orb2Anim, orb3Anim].forEach(anim => {
        anim.stopAnimation();
      });
    };
  }, []);

  const translateX = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-gradientSize / 3, gradientSize / 3],
  });

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-gradientSize / 3, gradientSize / 3],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderOrb = (anim: Animated.Value, size: number, color: string, delay: number) => {
    const orbRotate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [
              { rotate: orbRotate },
              { translateX: size },
              { scale: scaleAnim },
            ],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.gradientContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateX },
              { translateY },
              { rotate },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#9932CC', '#8A2BE2', '#9400D3', '#8A2BE2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { width: gradientSize, height: gradientSize }]}
        />
      </Animated.View>

      <View style={styles.orbsContainer}>
        {renderOrb(orb1Anim, 100, 'rgba(255, 255, 255, 0.1)', 0)}
        {renderOrb(orb2Anim, 150, 'rgba(255, 255, 255, 0.08)', 2000)}
        {renderOrb(orb3Anim, 200, 'rgba(255, 255, 255, 0.05)', 4000)}
      </View>

      <View style={styles.glowContainer}>
        <View style={styles.glow} />
      </View>

      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  gradientContainer: {
    position: 'absolute',
    left: -gradientSize / 2,
    top: -gradientSize / 2,
  },
  gradient: {
    opacity: 0.4,
  },
  orbsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    borderRadius: 1000,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 50,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
  },
}); 