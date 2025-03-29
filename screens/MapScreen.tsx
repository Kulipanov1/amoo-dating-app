import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

interface NearbyUser {
  id: string;
  name: string;
  age: number;
  image: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

const INITIAL_REGION = {
  latitude: 55.7558,
  longitude: 37.6173,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const [location, setLocation] = useState(INITIAL_REGION);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyUsers] = useState<NearbyUser[]>([
    {
      id: '1',
      name: 'Анна',
      age: 25,
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      coordinate: {
        latitude: 55.7558 + Math.random() * 0.01,
        longitude: 37.6173 + Math.random() * 0.01,
      },
    },
    {
      id: '2',
      name: 'Михаил',
      age: 28,
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      coordinate: {
        latitude: 55.7558 + Math.random() * 0.01,
        longitude: 37.6173 + Math.random() * 0.01,
      },
    },
    {
      id: '3',
      name: 'Елена',
      age: 24,
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      coordinate: {
        latitude: 55.7558 + Math.random() * 0.01,
        longitude: 37.6173 + Math.random() * 0.01,
      },
    },
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        ...INITIAL_REGION,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        showsUserLocation
        showsMyLocationButton
      >
        {nearbyUsers.map((user) => (
          <Marker
            key={user.id}
            coordinate={user.coordinate}
          >
            <View style={styles.markerContainer}>
              <Image
                source={{ uri: user.image }}
                style={styles.markerImage}
              />
            </View>
            <Callout>
              <View style={styles.calloutContainer}>
                <Image
                  source={{ uri: user.image }}
                  style={styles.calloutImage}
                />
                <Text style={styles.calloutName}>{user.name}, {user.age}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    backgroundColor: '#fff',
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
    width: 150,
    padding: 10,
    alignItems: 'center',
  },
  calloutImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  calloutName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
}); 