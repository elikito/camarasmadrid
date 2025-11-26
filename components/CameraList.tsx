'use client';

import { Camera } from '@/types';
import { useState, useMemo } from 'react';

interface CameraListProps {
  cameras: Camera[];
  onClose: () => void;
  onCameraSelect: (camera: Camera) => void;
}

type SortField = 'name' | 'source' | 'type';
type SortOrder = 'asc' | 'desc';

export default function CameraList({ cameras, onClose, onCameraSelect }: CameraListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const filteredAndSortedCameras = useMemo(() => {
    let filtered = cameras.filter(camera => 
      camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [cameras, searchTerm, sortField, sortOrder]);
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const getSourceColor = (source: string) => {
    if (source === 'urbanas') return 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300';
    if (source === 'm30') return 'text-orange-600 bg-orange-50 dark:bg-orange-900 dark:text-orange-300';
    if (source === 'radares') return 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300';
    return 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Listado de Cámaras
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Search and controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
          {/* Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o fuente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Ordenación */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 self-center">
              Ordenar por:
            </span>
            <button
              onClick={() => toggleSort('name')}
              className={`px-3 py-1 rounded text-sm ${
                sortField === 'name'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Nombre {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('source')}
              className={`px-3 py-1 rounded text-sm ${
                sortField === 'source'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Fuente {sortField === 'source' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('type')}
              className={`px-3 py-1 rounded text-sm ${
                sortField === 'type'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Tipo {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          
          {/* Resultados count */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredAndSortedCameras.length} de {cameras.length} cámaras
          </p>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAndSortedCameras.map((camera) => (
              <div
                key={camera.id}
                onClick={() => {
                  onCameraSelect(camera);
                  onClose();
                }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {camera.name}
                  </h3>
                  <span className="text-xl">
                    {camera.type === 'radar' ? '🚨' : '📹'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {camera.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getSourceColor(camera.source)}`}>
                    {camera.source}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 capitalize">
                    {camera.type === 'radar' ? 'Radar' : 'Cámara'}
                  </span>
                  {camera.type === 'radar' && camera.radarType && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 capitalize">
                      {camera.radarType}
                    </span>
                  )}
                </div>
                
                {camera.type === 'radar' && camera.maxSpeed && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Velocidad máxima: {camera.maxSpeed} km/h
                  </p>
                )}
                
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  📍 {camera.latitude.toFixed(4)}, {camera.longitude.toFixed(4)}
                </p>
              </div>
            ))}
          </div>
          
          {filteredAndSortedCameras.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No se encontraron cámaras con ese criterio de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
