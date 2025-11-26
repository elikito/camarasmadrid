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

const createUserIcon = () => {
  const svgIcon = `
    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="14" fill="#3b82f6" opacity="0.3"/>
      <circle cx="15" cy="15" r="8" fill="#3b82f6"/>
      <circle cx="15" cy="15" r="4" fill="white"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'user-location-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('No se pudo obtener tu ubicación');
        setIsLocating(false);
      }
    );
  };
  
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Cargando mapa...</div>
      </div>
    );
  }
  
  const filteredCameras = cameras.filter(camera => filters[camera.source]);
  
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userLocation || [40.4168, -3.7038]} // Centro de Madrid o ubicación del usuario
        zoom={userLocation ? 14 : 12}
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
        
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createUserIcon()}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm">📍 Tu ubicación</h3>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      <button
        onClick={handleGeolocate}
        disabled={isLocating}
        className="absolute bottom-6 right-4 z-[1000] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        title="Mi ubicación"
      >
        {isLocating ? (
          <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}
