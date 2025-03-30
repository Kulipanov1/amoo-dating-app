import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import AnimatedBackground from './AnimatedBackground';

interface ScreenWrapperProps {
  children: React.ReactNode;
  isDesktop?: boolean;
  contentWidth?: number;
}

export default function ScreenWrapper({ children, isDesktop, contentWidth }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
      <AnimatedBackground />
      <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
        <View style={[
          styles.mainContent,
          isDesktop && { width: contentWidth, maxHeight: 700 }
        ]}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  desktopSafeArea: {
    backgroundColor: '#8A2BE2',
  },
  wrapper: {
    flex: 1,
  },
  desktopWrapper: {
    alignItems: 'center',
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    overflow: 'hidden',
  },
}); 