import React, { useState } from 'react';
import GlobeView from './components/GlobeView';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import { AppState, defaultState, Place } from './types';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [activeTool, setActiveTool] = useState<'pointer' | 'add-place'>('pointer');

  const handleMapClick = (lat: number, lng: number) => {
    if (activeTool === 'add-place') {
      const newPlaceName = prompt('Enter place name:');
      if (newPlaceName) {
        const newPlace: Place = {
          id: uuidv4(),
          name: newPlaceName,
          lat,
          lng,
          color: '#ff0000',
        };
        setState(s => ({ ...s, places: [...s.places, newPlace] }));
        setActiveTool('pointer');
      }
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden font-sans">
      <Sidebar
        state={state}
        setState={setState}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />
      <div className="flex-1 relative">
        <GlobeView
          places={state.places}
          routes={state.routes}
          globeColor={state.globeColor}
          waterColor={state.waterColor}
          isPlaying={state.isPlaying}
          onMapClick={handleMapClick}
        />
        {activeTool === 'add-place' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg font-medium animate-pulse pointer-events-none">
            Click anywhere on the globe to add a place
          </div>
        )}
        <Timeline state={state} setState={setState} />
      </div>
    </div>
  );
}
