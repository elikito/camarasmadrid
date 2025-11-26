'use client';

import { FilterState } from '@/types';
import { useEffect, useState } from 'react';

interface NavbarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onShowList: () => void;
}

export default function Navbar({ 
  filters, 
  onFilterChange, 
  darkMode, 
  onDarkModeToggle,
  onShowList 
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleFilter = (source: keyof FilterState) => {
    onFilterChange({
      ...filters,
      [source]: !filters[source]
    });
  };
  
  const filterLabels = {
    urbanas: 'Cámaras Urbanas',
    m30: 'Cámaras M-30',
    radares: 'Radares'
  };
  
  const filterColors = {
    urbanas: 'bg-green-500',
    m30: 'bg-orange-500',
    radares: 'bg-red-500'
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              📹 Cámaras Madrid
            </h1>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Filtros */}
            <div className="flex items-center space-x-3">
              {(Object.keys(filters) as Array<keyof FilterState>).map((source) => (
                <button
                  key={source}
                  onClick={() => toggleFilter(source)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    filters[source]
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900 opacity-50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${filterColors[source]}`}></span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {filterLabels[source]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {filters[source] ? '✓' : '✗'}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Modo oscuro */}
            <button
              onClick={onDarkModeToggle}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Cambiar tema"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            
            {/* Listado */}
            <button
              onClick={onShowList}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>📋</span>
              <span>Listado</span>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3 space-y-3">
            {/* Filtros móvil */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Filtros
              </p>
              {(Object.keys(filters) as Array<keyof FilterState>).map((source) => (
                <button
                  key={source}
                  onClick={() => toggleFilter(source)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                    filters[source]
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-900 opacity-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${filterColors[source]}`}></span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {filterLabels[source]}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {filters[source] ? '✓' : '✗'}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Modo oscuro móvil */}
            <button
              onClick={onDarkModeToggle}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Modo oscuro</span>
              <span>{darkMode ? '🌙' : '☀️'}</span>
            </button>
            
            {/* Listado móvil */}
            <button
              onClick={() => {
                onShowList();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>📋</span>
              <span>Ver listado completo</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
