declare module 'react-native-web-maps' {
  import { Component } from 'react';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface Coordinate {
    latitude: number;
    longitude: number;
  }

  export interface MarkerProps {
    coordinate: Coordinate;
    title?: string;
    description?: string;
    key?: string | number;
  }

  export class Marker extends Component<MarkerProps> {}

  export interface MapViewProps {
    style?: any;
    initialRegion?: Region;
    region?: Region;
    onRegionChange?: (region: Region) => void;
    children?: React.ReactNode;
  }

  export default class MapView extends Component<MapViewProps> {}
} 