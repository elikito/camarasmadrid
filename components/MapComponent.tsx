'use client';

import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayerGroup } from 'react-leaflet';
import { Camera, FilterState } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados por tipo con memoización
const iconCache = new Map<string, L.DivIcon>();

const getCustomIcon = (source: string, type: string): L.DivIcon => {
  const cacheKey = `${source}-${type}`;
  
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!;
  }
  
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
  
  const icon = L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  
  iconCache.set(cacheKey, icon);
  return icon;
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

// Memoizar el componente de marcador individual
const CameraMarker = memo(({ 
  camera, 
  onClick 
}: { 
  camera: Camera; 
  onClick: (camera: Camera) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick(camera);
  }, [camera, onClick]);

  return (
    <Marker
      position={[camera.latitude, camera.longitude]}
      icon={getCustomIcon(camera.source, camera.type)}
      eventHandlers={{
        click: handleClick,
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
  );
}, (prevProps, nextProps) => {
  // Solo re-renderizar si la cámara o el onClick cambian
  return prevProps.camera.id === nextProps.camera.id;
});

CameraMarker.displayName = 'CameraMarker';

function MapComponent({ cameras, filters, onCameraClick }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleGeolocate = useCallback(() => {
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
  }, []);
  
  // Memoizar el filtrado para evitar re-renders innecesarios
  // IMPORTANTE: Los hooks deben ejecutarse antes de cualquier return condicional
  const filteredCameras = useMemo(() => {
    return cameras.filter(camera => filters[camera.source]);
  }, [cameras, filters]);

  // Estadísticas para mostrar al usuario
  const stats = useMemo(() => {
    const total = filteredCameras.length;
    const urbanas = filteredCameras.filter(c => c.source === 'urbanas').length;
    const m30 = filteredCameras.filter(c => c.source === 'm30').length;
    const radares = filteredCameras.filter(c => c.source === 'radares').length;
    const dgt = filteredCameras.filter(c => c.source === 'dgt').length;
    
    return { total, urbanas, m30, radares, dgt };
  }, [filteredCameras]);
  
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Cargando mapa...</div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userLocation || [40.4168, -3.7038]} // Centro de Madrid o ubicación del usuario
        zoom={userLocation ? 14 : 12}
        className="w-full h-full z-0"
        zoomControl={true}
        preferCanvas={true} // Usar Canvas para mejor rendimiento con muchos marcadores
      >
        <MapEvents />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          updateWhenIdle={true} // Cargar tiles solo cuando el mapa esté quieto
          keepBuffer={2} // Reducir el buffer de tiles
        />
        
        <LayerGroup>
          {filteredCameras.map((camera) => (
            <CameraMarker
              key={camera.id}
              camera={camera}
              onClick={onCameraClick}
            />
          ))}
        </LayerGroup>
        
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
      
      {/* Contador de cámaras visibles */}
      <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          📹 {stats.total} cámaras
        </div>
        {stats.total > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
            {stats.urbanas > 0 && <div>🟢 Urbanas: {stats.urbanas}</div>}
            {stats.m30 > 0 && <div>🟠 M-30: {stats.m30}</div>}
            {stats.radares > 0 && <div>🔴 Radares: {stats.radares}</div>}
            {stats.dgt > 0 && <div>🔵 DGT: {stats.dgt}</div>}
          </div>
        )}
      </div>
      
      <button
        onClick={handleGeolocate}
        disabled={isLocating}
        className="absolute bottom-24 right-4 z-[1000] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
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

export default memo(MapComponent);
