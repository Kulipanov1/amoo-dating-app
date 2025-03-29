import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserProfile {
  name: string;
  age: string;
  bio: string;
  interests: string[];
  image: string;
}

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Александр',
    age: '27',
    bio: 'Разработчик, люблю путешествовать и пробовать новое 🌍',
    interests: ['Программирование', 'Путешествия', 'Фотография', 'Спорт'],
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  });

  const [editableProfile, setEditableProfile] = useState(profile);

  const handleEdit = () => {
    if (isEditing) {
      setProfile(editableProfile);
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile.image }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons 
            name={isEditing ? "checkmark-outline" : "pencil-outline"} 
            size={24} 
            color="#fff" 
          />
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
              value={editableProfile.age}
              onChangeText={(text) => setEditableProfile({...editableProfile, age: text})}
              placeholder="Возраст"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editableProfile.bio}
              onChangeText={(text) => setEditableProfile({...editableProfile, bio: text})}
              placeholder="О себе"
              multiline
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
            
            <Text style={styles.sectionTitle}>Интересы</Text>
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    right: 20,
    top: 20,
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 20,
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#363636',
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#363636',
    marginTop: 20,
    marginBottom: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
  },
  interestText: {
    color: '#666',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 