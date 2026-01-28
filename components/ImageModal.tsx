'use client';

import { Camera } from '@/types';
import { useEffect, useState } from 'react';

interface ImageModalProps {
  camera: Camera | null;
  onClose: () => void;
}

export default function ImageModal({ camera, onClose }: ImageModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    // Reset image states when camera changes
    setImageLoading(true);
    setImageError(false);
  }, [camera]);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    
    if (camera) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [camera, isFullscreen, onClose]);
  
  if (!camera) return null;
  
  const hasImage = camera.imageUrl && camera.imageUrl.trim() !== '';
  
  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
        isFullscreen ? 'bg-opacity-100' : 'bg-opacity-75'
      }`}
      onClick={() => {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }}
    >
      <div 
        className={`${
          isFullscreen 
            ? 'w-full h-full' 
            : 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-3xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${isFullscreen ? 'h-full' : ''}`}>
          {/* Header */}
          {!isFullscreen && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {camera.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {camera.description}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 capitalize">
                    Fuente: {camera.source}
                  </p>
                  {camera.type === 'radar' && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {camera.radarType} - Velocidad máx: {camera.maxSpeed} km/h
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          {/* Image */}
          {camera.type !== 'radar' && (
            <div className={`${isFullscreen ? 'w-full h-full flex items-center justify-center' : 'p-4'} relative`}>
              {hasImage ? (
                <>
                  {imageLoading && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Cargando imagen...</p>
                      </div>
                    </div>
                  )}
                  <img
                    src={camera.imageUrl}
                    alt={camera.name}
                    loading="lazy"
                    className={`${
                      isFullscreen 
                        ? 'max-w-full max-h-full object-contain cursor-zoom-out' 
                        : 'w-full h-auto rounded cursor-zoom-in'
                    } ${imageLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      setImageLoading(false);
                      setImageError(true);
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </>
              ) : (
                <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Imagen no disponible</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Footer hint */}
          {hasImage && !isFullscreen && camera.type !== 'radar' && (
            <div className="p-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
              Haz clic en la imagen para expandir a pantalla completa
            </div>
          )}
          
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
