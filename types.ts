export interface PlanetData {
  id: string;
  name: string;
  enName: string;
  description: string;
  details: {
    diameter: string;
    distanceFromSun: string; // AU or km
    orbitalPeriod: string;
    dayLength: string;
    temperature: string;
    moons: number;
  };
  color: string;
  sizeScale: number; // Relative size for visualization
  orbitScale: number; // Relative distance for visualization
  orbitSpeed: number; // Seconds for one full rotation in CSS
  imageUrl: string; // URL to a real photo of the planet
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}