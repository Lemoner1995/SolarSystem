import React, { useState } from 'react';
import SolarSystemMap from './components/SolarSystemMap';
import InfoPanel from './components/InfoPanel';
import { PlanetData } from './types';

const App: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePlanetSelect = (planet: PlanetData) => {
    setSelectedPlanet(planet);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedPlanet(null);
  };

  return (
    <div className="h-screen w-screen bg-space-900 text-white overflow-hidden relative">
      {/* Visual Area - Always Full Screen */}
      <div className="absolute inset-0 w-full h-full">
        <SolarSystemMap 
          onSelectPlanet={handlePlanetSelect} 
          selectedPlanetId={selectedPlanet?.id || null}
        />
        
        {/* Title Overlay */}
        <div className="absolute top-6 left-6 pointer-events-none z-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg tracking-tight">
            SOLAR SYSTEM
          </h1>
          <p className="text-white/50 text-sm tracking-[0.2em] uppercase mt-1">Interactive Explorer</p>
        </div>
      </div>

      {/* Sidebar - Fixed Overlay (Drawer) */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-auto transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <InfoPanel planet={selectedPlanet} onClose={handleCloseSidebar} />
      </div>

      {/* Mobile overlay backdrop when sidebar is open */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={handleCloseSidebar}
        ></div>
      )}
    </div>
  );
};

export default App;