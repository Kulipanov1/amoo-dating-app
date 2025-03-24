import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import WebMapView from './WebMapView';

interface NearbyUser {
  id: number;
  name: string;
  age: number;
  distance: string;
  latitude: number;
  longitude: number;
  image: string;
  isOnline: boolean;
  lastActive: string;
}

const nearbyUsers: NearbyUser[] = [
  {
    id: 1,
    name: 'Анна',
    age: 25,
    distance: '2 км',
    latitude: 55.751244,
    longitude: 37.618423,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    isOnline: true,
    lastActive: 'Онлайн',
  },
  {
    id: 2,
    name: 'Мария',
    age: 28,
    distance: '3 км',
    latitude: 55.753544,
    longitude: 37.621202,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    isOnline: false,
    lastActive: '5 минут назад',
  },
  {
    id: 3,
    name: 'Екатерина',
    age: 24,
    distance: '1.5 км',
    latitude: 55.749844,
    longitude: 37.615202,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
    isOnline: true,
    lastActive: 'Онлайн',
  },
];

const MapScreen = () => {
  const [location, setLocation] = useState({
    latitude: 55.751244,
    longitude: 37.618423,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<number>(10);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Для работы приложения необходим доступ к геолокации');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Не удалось получить местоположение');
      }
    })();
  }, []);

  if (Platform.OS === 'web') {
    return <WebMapView location={location} users={nearbyUsers} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {nearbyUsers.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <Image 
                source={{ uri: user.image }} 
                style={styles.markerImage}
              />
              <View
                style={[
                  styles.onlineIndicator,
                  { backgroundColor: user.isOnline ? '#4CAF50' : '#FFA000' },
                ]}
              />
            </View>
            <Callout style={styles.callout}>
              <View style={styles.calloutContainer}>
                <Image 
                  source={{ uri: user.image }} 
                  style={styles.calloutImage}
                />
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutName}>{user.name}, {user.age}</Text>
                  <Text style={styles.calloutDistance}>{user.distance}</Text>
                  <Text style={styles.calloutStatus}>
                    {user.isOnline ? (
                      <Text style={styles.onlineText}>● Онлайн</Text>
                    ) : (
                      user.lastActive
                    )}
                  </Text>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Расстояние: {selectedDistance} км</Text>
        <View style={styles.filterButtons}>
          {[1, 2, 5, 10, 25, 50].map((distance) => (
            <TouchableOpacity
              key={distance}
              style={[
                styles.filterButton,
                selectedDistance === distance && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedDistance(distance)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedDistance === distance && styles.filterButtonTextActive,
                ]}
              >
                {distance}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    position: 'relative',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calloutImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  calloutContent: {
    flex: 1,
  },
  calloutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calloutDistance: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  calloutStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  onlineText: {
    color: '#4CAF50',
  },
  filterContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    margin: 5,
  },
  filterButtonActive: {
    backgroundColor: '#8A2BE2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 15,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default MapScreen; 