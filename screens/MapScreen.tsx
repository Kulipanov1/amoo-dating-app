import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface User {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  distance: number;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Анна',
    location: {
      latitude: 55.751244,
      longitude: 37.618423,
    },
    distance: 1.2,
  },
  {
    id: '2',
    name: 'Мария',
    location: {
      latitude: 55.753215,
      longitude: 37.622504,
    },
    distance: 2.5,
  },
  {
    id: '3',
    name: 'Елена',
    location: {
      latitude: 55.749008,
      longitude: 37.619620,
    },
    distance: 0.8,
  },
];

export default function MapScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    latitude: location?.coords.latitude || 55.751244,
    longitude: location?.coords.longitude || 37.618423,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : (
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton
        >
          {MOCK_USERS.map((user) => (
            <Marker
              key={user.id}
              coordinate={user.location}
              title={user.name}
              description={`${user.distance} км от вас`}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker}>
                  <Ionicons name="person" size={20} color="#8A2BE2" />
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4B4B',
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8A2BE2',
  },
}); 