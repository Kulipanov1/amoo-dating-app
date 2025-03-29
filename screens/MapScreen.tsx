import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

interface NearbyUser {
  id: number;
  name: string;
  age: number;
  image: string;
  distance: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

const dummyNearbyUsers: NearbyUser[] = [
  {
    id: 1,
    name: 'Анна',
    age: 25,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    distance: '2.5 км',
    coordinate: {
      latitude: 55.753215,
      longitude: 37.622504
    }
  },
  {
    id: 2,
    name: 'Михаил',
    age: 28,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    distance: '1.8 км',
    coordinate: {
      latitude: 55.754215,
      longitude: 37.623504
    }
  },
  {
    id: 3,
    name: 'Елена',
    age: 24,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    distance: '3.2 км',
    coordinate: {
      latitude: 55.752215,
      longitude: 37.621504
    }
  }
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<NearbyUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Для работы приложения необходим доступ к геолокации');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const initialRegion = {
    latitude: 55.753215,
    longitude: 37.622504,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleMarkerPress = (user: NearbyUser) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
          >
            {dummyNearbyUsers.map((user) => (
              <Marker
                key={user.id}
                coordinate={user.coordinate}
                onPress={() => handleMarkerPress(user)}
              >
                <View style={styles.markerContainer}>
                  <Image source={{ uri: user.image }} style={styles.markerImage} />
                </View>
                <Callout>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{user.name}, {user.age}</Text>
                    <Text style={styles.calloutDistance}>{user.distance}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <Modal
            visible={showModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowModal(false)}
          >
            {selectedUser && (
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                  
                  <Image source={{ uri: selectedUser.image }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>
                    {selectedUser.name}, {selectedUser.age}
                  </Text>
                  <Text style={styles.modalDistance}>
                    <Ionicons name="location" size={16} color="#8A2BE2" /> {selectedUser.distance}
                  </Text>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
                      <Ionicons name="chatbubble" size={20} color="white" />
                      <Text style={styles.buttonText}>Сообщение</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
                      <Ionicons name="heart" size={20} color="white" />
                      <Text style={styles.buttonText}>Лайк</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
  markerImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  calloutContainer: {
    padding: 5,
    minWidth: 120,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calloutDistance: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    margin: 20,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalDistance: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 25,
    width: '45%',
    justifyContent: 'center',
  },
  messageButton: {
    backgroundColor: '#8A2BE2',
  },
  likeButton: {
    backgroundColor: '#FF4B4B',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16,
  },
}); 