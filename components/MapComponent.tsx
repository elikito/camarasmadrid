'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Camera, FilterState } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados por tipo
const createCustomIcon = (source: string, type: string) => {
  let color = '#3b82f6'; // blue por defecto
  
  if (source === 'urbanas') color = '#10b981'; // green
  if (source === 'm30') color = '#f59e0b'; // orange
  if (source === 'radares') color = '#ef4444'; // red
  if (source === 'dgt') color = '#3b82f6'; // blue
  
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.125 12.5 28.125S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      ${type === 'radar' ? '<text x="12.5" y="15" text-anchor="middle" fill="' + color + '" font-size="10" font-weight="bold">R</text>' : ''}
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

interface MapComponentProps {
  cameras: Camera[];
  filters: FilterState;
  onCameraClick: (camera: Camera) => void;
}

function MapEvents() {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  
  return null;
}

export default function MapComponent({ cameras, filters, onCameraClick }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Cargando mapa...</div>
      </div>
    );
  }
  
  const filteredCameras = cameras.filter(camera => filters[camera.source]);
  
  return (
    <MapContainer
      center={[40.4168, -3.7038]} // Centro de Madrid
      zoom={12}
      className="w-full h-full z-0"
      zoomControl={true}
    >
      <MapEvents />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {filteredCameras.map((camera) => (
        <Marker
          key={camera.id}
          position={[camera.latitude, camera.longitude]}
          icon={createCustomIcon(camera.source, camera.type)}
          eventHandlers={{
            click: () => onCameraClick(camera),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-sm">{camera.name}</h3>
              <p className="text-xs text-gray-600">{camera.description}</p>
              <p className="text-xs text-blue-600 mt-1 capitalize">Fuente: {camera.source}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
