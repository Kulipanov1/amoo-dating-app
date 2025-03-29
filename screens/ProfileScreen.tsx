import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserProfile {
  name: string;
  age: number;
  bio: string;
  interests: string[];
  image: string;
}

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Александр',
    age: 27,
    bio: 'Привет! Я разработчик и люблю путешествовать.',
    interests: ['Программирование', 'Путешествия', 'Фотография', 'Спорт'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
  });

  const [editableProfile, setEditableProfile] = useState(profile);

  const handleEdit = () => {
    if (isEditing) {
      setProfile(editableProfile);
    } else {
      setEditableProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile.image }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name={isEditing ? "checkmark-outline" : "pencil-outline"} size={24} color="#8A2BE2" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editableProfile.name}
              onChangeText={(text) => setEditableProfile({...editableProfile, name: text})}
              placeholder="Имя"
            />
            <TextInput
              style={styles.input}
              value={String(editableProfile.age)}
              onChangeText={(text) => setEditableProfile({...editableProfile, age: parseInt(text) || 0})}
              keyboardType="numeric"
              placeholder="Возраст"
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editableProfile.bio}
              onChangeText={(text) => setEditableProfile({...editableProfile, bio: text})}
              multiline
              placeholder="О себе"
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </>
        )}

        <Text style={styles.sectionTitle}>Интересы</Text>
        <View style={styles.interestsContainer}>
          {profile.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  interestTag: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  interestText: {
    color: 'white',
    fontSize: 14,
  },
}); 