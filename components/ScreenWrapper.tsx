import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import AnimatedBackground from './AnimatedBackground';

interface Props {
  children: React.ReactNode;
  isDesktop?: boolean;
  contentWidth?: number;
}

export default function ScreenWrapper({ children, isDesktop, contentWidth }: Props) {
  const contentStyle: ViewStyle[] = [
    styles.content,
    isDesktop && styles.desktopContent,
    contentWidth ? { width: contentWidth } : undefined,
  ].filter(Boolean) as ViewStyle[];

  return (
    <View style={[styles.container, isDesktop && styles.desktopContainer]}>
      <AnimatedBackground />
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8A2BE2',
  },
  desktopContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    ...(Platform.OS === 'web' ? {
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    } : {}),
  },
  desktopContent: {
    maxWidth: 480,
  },
}); 