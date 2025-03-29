import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Location {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

const DUMMY_LOCATIONS: Location[] = [
  {
    id: '1',
    title: 'Анна',
    description: '25 лет, 2 км от вас',
    coordinate: {
      latitude: 55.7558,
      longitude: 37.6173,
    },
  },
  {
    id: '2',
    title: 'Мария',
    description: '23 года, 3 км от вас',
    coordinate: {
      latitude: 55.7517,
      longitude: 37.6178,
    },
  },
];

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 55.7558,
          longitude: 37.6173,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {DUMMY_LOCATIONS.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinate}
            title={location.title}
            description={location.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  map: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
});

export default MapScreen; 