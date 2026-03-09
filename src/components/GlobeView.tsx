import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import { Place, Route } from '../types';

interface GlobeViewProps {
  places: Place[];
  routes: Route[];
  globeColor: string;
  waterColor: string;
  isPlaying: boolean;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function GlobeView({ places, routes, globeColor, waterColor, isPlaying, onMapClick }: GlobeViewProps) {
  const globeRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = isPlaying;
      globeRef.current.controls().autoRotateSpeed = 1;
    }
  }, [isPlaying]);

  // Prepare arcs data
  const arcsData = routes.map(route => {
    const from = places.find(p => p.id === route.fromId);
    const to = places.find(p => p.id === route.toId);
    if (!from || !to) return null;
    return {
      startLat: from.lat,
      startLng: from.lng,
      endLat: to.lat,
      endLng: to.lng,
      color: route.color || '#ff0000',
    };
  }).filter(Boolean);

  return (
    <div ref={containerRef} className="w-full h-full bg-black">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor={waterColor}
        labelsData={places}
        labelLat={d => (d as Place).lat}
        labelLng={d => (d as Place).lng}
        labelText={d => (d as Place).name}
        labelSize={1.5}
        labelDotRadius={0.5}
        labelColor={() => 'rgba(255, 255, 255, 0.75)'}
        labelResolution={2}
        ringsData={places}
        ringLat={d => (d as Place).lat}
        ringLng={d => (d as Place).lng}
        ringColor={d => (d as Place).color || '#ff0000'}
        ringMaxRadius={5}
        ringPropagationSpeed={2}
        ringRepeatPeriod={1000}
        arcsData={arcsData}
        arcColor={(d: any) => d.color}
        arcDashLength={isPlaying ? 0.4 : 1}
        arcDashGap={isPlaying ? 0.2 : 0}
        arcDashAnimateTime={isPlaying ? 1500 : 0}
        onGlobeClick={({ lat, lng }) => {
          if (onMapClick) onMapClick(lat, lng);
        }}
      />
    </div>
  );
}
