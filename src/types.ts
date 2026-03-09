import { v4 as uuidv4 } from 'uuid';

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color?: string;
}

export interface Route {
  id: string;
  fromId: string;
  toId: string;
  color?: string;
}

export interface AppState {
  places: Place[];
  routes: Route[];
  globeColor: string;
  waterColor: string;
  isPlaying: boolean;
}

export const defaultState: AppState = {
  places: [
    { id: 'p1', name: 'New York', lat: 40.7128, lng: -74.0060, color: '#ff0000' },
    { id: 'p2', name: 'London', lat: 51.5074, lng: -0.1278, color: '#00ff00' },
    { id: 'p3', name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#0000ff' },
    { id: 'p4', name: 'Sydney', lat: -33.8688, lng: 151.2093, color: '#ff00ff' },
    { id: 'p5', name: 'Cape Town', lat: -33.9249, lng: 18.4241, color: '#ffff00' },
  ],
  routes: [
    { id: 'r1', fromId: 'p1', toId: 'p2', color: '#ff5555' },
    { id: 'r2', fromId: 'p2', toId: 'p3', color: '#55ff55' },
    { id: 'r3', fromId: 'p3', toId: 'p4', color: '#5555ff' },
    { id: 'r4', fromId: 'p4', toId: 'p5', color: '#ff55ff' },
    { id: 'r5', fromId: 'p5', toId: 'p1', color: '#ffff55' },
  ],
  globeColor: '#1a1a1a',
  waterColor: '#000000',
  isPlaying: true,
};
