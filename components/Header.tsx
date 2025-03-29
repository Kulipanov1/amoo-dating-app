import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.header}>
      <Ionicons name="heart" size={24} color="#8A2BE2" />
      <Text style={styles.title}>Amoo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginLeft: 10,
  },
}); 