import React, { useState, useEffect, useMemo } from 'react';
import { SOLAR_SYSTEM_DATA } from '../constants';
import { PlanetData } from '../types';

interface SolarSystemMapProps {
  onSelectPlanet: (planet: PlanetData) => void;
  selectedPlanetId: string | null;
}

const SolarSystemMap: React.FC<SolarSystemMapProps> = ({ onSelectPlanet, selectedPlanetId }) => {
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Generate random starting positions (delays) once on mount to avoid re-randomizing on render
  const planetDelays = useMemo(() => {
    return SOLAR_SYSTEM_DATA.reduce((acc, planet) => {
      // Random negative delay between 0 and orbitSpeed to distribute them around orbit
      acc[planet.id] = -(Math.random() * planet.orbitSpeed);
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Generate dense, randomized star backgrounds
  const starLayers = useMemo(() => {
    const generateStars = (count: number, mapSize: number, sizeMin: number, sizeMax: number, opacity: number) => {
        const stars = [];
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * mapSize);
            const y = Math.floor(Math.random() * mapSize);
            const size = (Math.random() * (sizeMax - sizeMin) + sizeMin).toFixed(1);
            stars.push(`radial-gradient(${size}px ${size}px at ${x}px ${y}px, rgba(255,255,255,${opacity}), transparent)`);
        }
        return stars.join(', ');
    };

    return {
        // Lots of tiny faint stars (background noise)
        small: generateStars(300, 1500, 1, 1.5, 0.6),
        // Group A: Normal twinkle
        mediumA: generateStars(80, 1500, 1.5, 2.5, 0.9),
        // Group B: Offset twinkle (lights up when A dims)
        mediumB: generateStars(80, 1500, 1.5, 2.5, 0.9),
        // Fast blinking energetic stars
        fast: generateStars(30, 1500, 2, 3, 1),
        // "Morning Stars" - Steady, bright, larger (no twinkle)
        steady: generateStars(8, 1500, 3, 4.5, 1), 
    };
  }, []);

  // Asteroid belt generation
  const asteroidBelt = useMemo(() => {
    const asteroids = [];
    const count = 150;
    const minRadius = 280; // Between Mars (240) and Jupiter (340)
    const maxRadius = 300;
    
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * 360;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);
        // Convert polar to cartesian
        const rad = angle * (Math.PI / 180);
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const size = Math.random() * 2 + 1;
        const delay = Math.random() * 20;
        
        asteroids.push({ id: i, x, y, size, delay });
    }
    return asteroids;
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    // e.stopPropagation(); // Removed to allow document scroll if needed, or keep if fullscreen
    const newScale = Math.max(0.1, Math.min(scale - e.deltaY * 0.001, 4));
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      id="solar-container"
      className="relative w-full h-full bg-space-900 overflow-hidden cursor-move select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Dynamic Nebula Background - Layer 1 (Base Depth) */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none animate-nebula"
        style={{
            backgroundImage: `
                radial-gradient(circle at 10% 20%, rgba(50, 20, 100, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 90% 80%, rgba(20, 40, 120, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 50% 50%, rgba(80, 20, 60, 0.1) 0%, transparent 70%)
            `,
            backgroundSize: '150% 150%',
            filter: 'blur(80px)',
            zIndex: 0,
            animationDuration: '300s' // Slow movement for base
        }}
      ></div>

      {/* Dynamic Nebula Background - Layer 2 (Colorful Accents) */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none animate-nebula"
        style={{
            backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 80% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 40%),
                radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 70% 10%, rgba(16, 185, 129, 0.1) 0%, transparent 30%)
            `,
            backgroundSize: '200% 200%',
            filter: 'blur(50px)',
            zIndex: 0,
            animationDuration: '180s',
            animationDirection: 'alternate-reverse' // Move in opposition to base layer
        }}
      ></div>

      {/* --- START: Dynamic Star System --- */}
      
      {/* 1. Background Small Stars (Slow Twinkle) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60 z-0 animate-twinkle-slow" 
        style={{ 
            backgroundImage: starLayers.small,
            backgroundSize: '1500px 1500px', // Tile size
        }}
      ></div>

      {/* 2. Medium Stars Group A (Normal Phase) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80 z-0 animate-twinkle" 
        style={{ 
            backgroundImage: starLayers.mediumA,
            backgroundSize: '1500px 1500px',
        }}
      ></div>

      {/* 3. Medium Stars Group B (Reverse Phase - Lights up when A dims) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80 z-0 animate-twinkle" 
        style={{ 
            backgroundImage: starLayers.mediumB,
            backgroundSize: '1500px 1500px',
            animationDelay: '-1.5s', // Offset by half the duration (3s) to create alternating effect
        }}
      ></div>

      {/* 4. Fast Blinking Stars */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-70 z-0 animate-twinkle-fast" 
        style={{ 
            backgroundImage: starLayers.fast,
            backgroundSize: '1500px 1500px',
        }}
      ></div>

      {/* 5. "Morning Stars" (Steady, Always Bright) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ 
            backgroundImage: starLayers.steady,
            backgroundSize: '1500px 1500px',
            // No animation class here -> steady light
            filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))' // Subtle glow
        }}
      ></div>
      
      {/* --- END: Dynamic Star System --- */}

      {/* Transform Container */}
      <div 
        className="absolute w-0 h-0 top-1/2 left-1/2 will-change-transform z-10"
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` 
        }}
      >
        {/* Asteroid Belt */}
        <div className="absolute top-0 left-0 animate-[spin_120s_linear_infinite]">
             {asteroidBelt.map((ast) => (
                 <div 
                    key={ast.id}
                    className="absolute bg-stone-500 rounded-full opacity-60"
                    style={{
                        left: ast.x,
                        top: ast.y,
                        width: `${ast.size}px`,
                        height: `${ast.size}px`,
                        boxShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                 ></div>
             ))}
        </div>

        {SOLAR_SYSTEM_DATA.map((planet) => {
          const isSun = planet.id === 'sun';
          const isSelected = selectedPlanetId === planet.id;
          const hasTrail = ['mars', 'jupiter'].includes(planet.id);
          const trailColor = planet.id === 'mars' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(217, 119, 6, 0.5)';
          
          return (
            <div key={planet.id} className="absolute top-0 left-0">
               {/* Orbit Ring (Not for Sun) */}
              {!isSun && (
                <div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30"
                  style={{
                    width: `${planet.orbitScale * 2}px`,
                    height: `${planet.orbitScale * 2}px`,
                  }}
                >
                   {/* Animated Dashed Ring */}
                   {/* We use a nested div for rotation to avoid conflict with the centering transform of the parent */}
                   <div 
                      className="w-full h-full rounded-full border border-dashed border-white/30 animate-[spin_linear_infinite]"
                      style={{ 
                        // Outer rings rotate slower (simulating orbital mechanics visualization)
                        animationDuration: `${planet.orbitScale * 0.5 + 60}s` 
                      }}
                   />
                </div>
              )}

              {/* Planet Rotator Container - Rotates the entire coordinate system for this planet */}
              <div 
                className={`absolute top-0 left-0 ${!isSun ? 'animate-orbit' : ''}`}
                style={{
                  // Only animate if not sun. 
                  // Use negative delay to start at random position along the orbit.
                  animationDuration: isSun ? '0s' : `${planet.orbitSpeed}s`,
                  animationDelay: isSun ? '0s' : `${planetDelays[planet.id] || 0}s`,
                }}
              >
                
                {/* Comet Trail Effect for Mars and Jupiter */}
                {hasTrail && (
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-pulse"
                    style={{
                      width: `${planet.orbitScale * 2 + 100}px`, // Large enough to cover the mask area
                      height: `${planet.orbitScale * 2 + 100}px`,
                      // Create a trail that fades from transparent to the planet color ending at 0deg (Top, where the planet is)
                      // 300deg to 360deg creates a 60-degree tail behind the planet (since motion is clockwise)
                      background: `conic-gradient(from 0deg, transparent 0deg, transparent 310deg, ${trailColor} 360deg)`,
                      // Mask out everything except the specific orbital path thickness
                      WebkitMaskImage: `radial-gradient(circle, transparent ${planet.orbitScale - planet.sizeScale/1.5}px, black ${planet.orbitScale - planet.sizeScale/2}px, black ${planet.orbitScale + planet.sizeScale/2}px, transparent ${planet.orbitScale + planet.sizeScale/1.5}px)`,
                      maskImage: `radial-gradient(circle, transparent ${planet.orbitScale - planet.sizeScale/1.5}px, black ${planet.orbitScale - planet.sizeScale/2}px, black ${planet.orbitScale + planet.sizeScale/2}px, transparent ${planet.orbitScale + planet.sizeScale/1.5}px)`,
                      filter: 'blur(4px)',
                      opacity: 0.7,
                      zIndex: 0
                    }}
                  />
                )}

                {/* 
                   The Planet Positioning Wrapper 
                   Moves the planet out to its orbit radius (translateY -radius).
                */}
                <div 
                  className={`absolute group cursor-pointer`}
                  style={{
                    // Move up by orbit radius
                    transform: `translate(-50%, -50%) translateY(-${planet.orbitScale}px)`,
                    zIndex: 10
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlanet(planet);
                  }}
                >
                    {/* Counter-rotation to keep label upright and planet shadow consistent relative to screen/sun */}
                    <div 
                       style={{ 
                         animation: isSun ? 'none' : `orbit ${planet.orbitSpeed}s linear infinite reverse`,
                         animationDelay: isSun ? '0s' : `${planetDelays[planet.id] || 0}s`,
                       }}
                    >
                        {/* 
                            Visual Body of the Planet 
                            We use the realistic gradient colors from constants.
                        */}
                        <div 
                            className={`relative rounded-full transition-all duration-300 ${isSelected ? 'scale-110 z-50' : 'hover:scale-110 z-10'}`}
                            style={{
                                width: `${planet.sizeScale}px`,
                                height: `${planet.sizeScale}px`,
                            }}
                        >
                             {/* The main planet sphere with rotation */}
                             <div className={`w-full h-full rounded-full ${planet.color} ${!isSun ? 'animate-spin-very-slow' : ''}`}></div>

                             {/* Selection Ring - separated from rotation to avoid wobble */}
                             {isSelected && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] pointer-events-none">
                                    <div className="w-full h-full border-2 border-dashed border-white/60 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                </div>
                             )}

                            {/* Saturn Ring Special Effect */}
                            {planet.id === 'saturn' && (
                                <div 
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                                    style={{
                                        width: '240%',
                                        height: '240%',
                                        transform: 'translate(-50%, -50%) rotateX(75deg)', // 3D Tilt effect
                                        background: `radial-gradient(
                                            transparent 30%, 
                                            rgba(180, 160, 120, 0.7) 35%, 
                                            rgba(200, 180, 140, 0.9) 45%, 
                                            rgba(0,0,0,0.1) 48%, 
                                            rgba(190, 170, 130, 0.8) 50%, 
                                            rgba(215, 200, 160, 0.6) 65%, 
                                            transparent 70%
                                        )`,
                                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
                                    }}
                                ></div>
                            )}

                             {/* Planet Label */}
                            <div 
                                className={`absolute left-1/2 -translate-x-1/2 -bottom-6 text-[10px] md:text-xs text-white/80 whitespace-nowrap px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm transition-opacity ${isSelected ? 'opacity-100 font-bold text-blue-300' : 'opacity-0 group-hover:opacity-100'}`}
                                style={{ pointerEvents: 'none' }}
                            >
                                {planet.name}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 text-white/40 text-xs md:text-sm bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg pointer-events-none select-none border border-white/5 z-20">
        <p className="font-semibold text-white/70 mb-1">控制指南</p>
        <div className="flex flex-col gap-1">
            <span>🖱️ 拖动背景平移视角</span>
            <span>⚪ 滚动滚轮缩放大小</span>
            <span>👆 点击星球查看详情</span>
        </div>
      </div>
    </div>
  );
};

export default SolarSystemMap;