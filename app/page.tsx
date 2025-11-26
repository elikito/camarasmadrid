'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Camera, FilterState } from '@/types';
import Navbar from '@/components/Navbar';
import ImageModal from '@/components/ImageModal';
import CameraList from '@/components/CameraList';

// Importar MapComponent dinámicamente para evitar problemas con SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    urbanas: true,
    m30: true,
    radares: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showList, setShowList] = useState(false);

  // Cargar tema guardado
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Aplicar tema
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Cargar cámaras
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        
        // En desarrollo local, usar localhost; en producción Vercel usará la URL correcta
        const baseUrl = typeof window !== 'undefined' 
          ? window.location.origin 
          : '';
        
        const response = await fetch(`${baseUrl}/api/cameras/all`);
        
        if (!response.ok) {
          throw new Error('Error al cargar las cámaras');
        }
        
        const data = await response.json();
        setCameras(data);
      } catch (err) {
        console.error('Error fetching cameras:', err);
        setError('No se pudieron cargar las cámaras. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Cargando cámaras de Madrid...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar
        filters={filters}
        onFilterChange={setFilters}
        darkMode={darkMode}
        onDarkModeToggle={handleDarkModeToggle}
        onShowList={() => setShowList(true)}
      />
      
      <div className="flex-1 relative">
        <MapComponent
          cameras={cameras}
          filters={filters}
          onCameraClick={setSelectedCamera}
        />
      </div>

      {/* Modal de imagen */}
      {selectedCamera && (
        <ImageModal
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
        />
      )}

      {/* Listado de cámaras */}
      {showList && (
        <CameraList
          cameras={cameras}
          onClose={() => setShowList(false)}
          onCameraSelect={setSelectedCamera}
        />
      )}

      {/* Footer info */}
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          <p>📊 Total: {cameras.length} puntos</p>
          <p className="text-xs">
            🟢 {cameras.filter(c => c.source === 'urbanas' && filters.urbanas).length} urbanas •{' '}
            🟠 {cameras.filter(c => c.source === 'm30' && filters.m30).length} M-30 •{' '}
            🔴 {cameras.filter(c => c.source === 'radares' && filters.radares).length} radares
          </p>
        </div>
      </div>
    </div>
  );
}
