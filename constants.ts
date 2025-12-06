import { PlanetData } from './types';

// Helper to generate a random start angle (delay) for animation to make it look natural
// We use a fixed seed-like effect by hardcoding delays or using a function if we wanted dynamic.
// Here we add a 'startDelay' property to the data interface implicitly via the style generation in the component,
// but for now, we will add a specific property for visual styling.

export const SOLAR_SYSTEM_DATA: PlanetData[] = [
  {
    id: 'sun',
    name: '太阳',
    enName: 'Sun',
    description: '太阳系中心的恒星，提供了地球生命所需的光和热。它几乎占据了整个太阳系质量的99.86%。',
    details: {
      diameter: '1,392,700 km',
      distanceFromSun: '0 km',
      orbitalPeriod: 'N/A',
      dayLength: 'N/A',
      temperature: '5,500°C (表面)',
      moons: 0,
    },
    // Realistic: Glowing orange/yellow/white core
    color: 'bg-[radial-gradient(circle_at_center,_#fff_0%,_#fcd34d_20%,_#f59e0b_50%,_#ea580c_100%)] shadow-[0_0_60px_rgba(251,191,36,0.8),0_0_120px_rgba(234,88,12,0.6)]',
    sizeScale: 70,
    orbitScale: 0,
    orbitSpeed: 0,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/440px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg'
  },
  {
    id: 'mercury',
    name: '水星',
    enName: 'Mercury',
    description: '离太阳最近的行星。它体积很小，且由于缺乏大气层，昼夜温差极大。表面布满陨石坑，呈灰褐色。',
    details: {
      diameter: '4,880 km',
      distanceFromSun: '57,900,000 km',
      orbitalPeriod: '88 天',
      dayLength: '59 天',
      temperature: '-173°C 至 427°C',
      moons: 0,
    },
    // Realistic: Grey, rocky, barren
    color: 'bg-[radial-gradient(circle_at_30%_30%,_#a8a29e_0%,_#78716c_50%,_#44403c_100%)] shadow-inner',
    sizeScale: 12,
    orbitScale: 100,
    orbitSpeed: 10,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/440px-Mercury_in_true_color.jpg'
  },
  {
    id: 'venus',
    name: '金星',
    enName: 'Venus',
    description: '太阳系中最热的行星，有着厚厚的二氧化碳大气层，呈现出明亮的黄白色外观。',
    details: {
      diameter: '12,104 km',
      distanceFromSun: '108,200,000 km',
      orbitalPeriod: '225 天',
      dayLength: '243 天',
      temperature: '462°C',
      moons: 0,
    },
    // Realistic: Yellowish white, hazy atmosphere
    color: 'bg-[radial-gradient(circle_at_30%_30%,_#fef3c7_0%,_#fbbf24_40%,_#d97706_100%)]',
    sizeScale: 20,
    orbitScale: 140,
    orbitSpeed: 20,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Venus_from_Mariner_10.jpg/440px-Venus_from_Mariner_10.jpg'
  },
  {
    id: 'earth',
    name: '地球',
    enName: 'Earth',
    description: '我们的家园。蓝色的海洋、绿色的陆地和白色的云层交织，是太阳系中最美丽的星球。',
    details: {
      diameter: '12,742 km',
      distanceFromSun: '149,600,000 km',
      orbitalPeriod: '365.25 天',
      dayLength: '24 小时',
      temperature: '平均 15°C',
      moons: 1,
    },
    // Realistic: Blue marble
    color: 'bg-[radial-gradient(circle_at_40%_40%,_#4ade80_0%,_#2563eb_40%,_#1e3a8a_100%)] shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.5)]',
    sizeScale: 21,
    orbitScale: 190,
    orbitSpeed: 30,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/440px-The_Earth_seen_from_Apollo_17.jpg'
  },
  {
    id: 'mars',
    name: '火星',
    enName: 'Mars',
    description: '被称为“红色星球”。表面覆盖着氧化铁（铁锈），使其呈现出独特的橘红色。',
    details: {
      diameter: '6,779 km',
      distanceFromSun: '227,900,000 km',
      orbitalPeriod: '687 天',
      dayLength: '24.6 小时',
      temperature: '-153°C 至 20°C',
      moons: 2,
    },
    // Realistic: Rusty red
    color: 'bg-[radial-gradient(circle_at_30%_30%,_#fca5a5_0%,_#ef4444_50%,_#991b1b_100%)]',
    sizeScale: 15,
    orbitScale: 240,
    orbitSpeed: 45,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/440px-OSIRIS_Mars_true_color.jpg'
  },
  {
    id: 'jupiter',
    name: '木星',
    enName: 'Jupiter',
    description: '气态巨行星，表面有显著的红褐色条纹和大红斑风暴。体积巨大。',
    details: {
      diameter: '139,820 km',
      distanceFromSun: '778,500,000 km',
      orbitalPeriod: '12 年',
      dayLength: '9.9 小时',
      temperature: '-110°C',
      moons: 95,
    },
    // Realistic: Striped beige/brown
    color: 'bg-[linear-gradient(180deg,#92400e_0%,_#d97706_20%,_#fcd34d_40%,_#b45309_60%,_#78350f_100%)] rotate-45 shadow-inner',
    sizeScale: 45,
    orbitScale: 340,
    orbitSpeed: 80,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/440px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg'
  },
  {
    id: 'saturn',
    name: '土星',
    enName: 'Saturn',
    description: '以其壮观的行星环系统而闻名。本体呈淡金色，光环主要由冰块和岩石组成。',
    details: {
      diameter: '116,460 km',
      distanceFromSun: '1,434,000,000 km',
      orbitalPeriod: '29 年',
      dayLength: '10.7 小时',
      temperature: '-140°C',
      moons: 146,
    },
    // Realistic: Pale gold/yellowish
    color: 'bg-[radial-gradient(circle_at_30%_30%,_#fef08a_0%,_#eab308_60%,_#a16207_100%)]',
    sizeScale: 38,
    orbitScale: 440,
    orbitSpeed: 110,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/440px-Saturn_during_Equinox.jpg'
  },
  {
    id: 'uranus',
    name: '天王星',
    enName: 'Uranus',
    description: '冰巨星，大气中富含甲烷，使其呈现出柔和的青蓝色（Cyan）。',
    details: {
      diameter: '50,724 km',
      distanceFromSun: '2,871,000,000 km',
      orbitalPeriod: '84 年',
      dayLength: '17 小时',
      temperature: '-195°C',
      moons: 27,
    },
    // Realistic: Pale Cyan
    color: 'bg-[radial-gradient(circle_at_30%_30%,_#a5f3fc_0%,_#22d3ee_60%,_#0891b2_100%)]',
    sizeScale: 28,
    orbitScale: 540,
    orbitSpeed: 140,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/440px-Uranus2.jpg'
  },
  {
    id: 'neptune',
    name: '海王星',
    enName: 'Neptune',
    description: '深蓝色的冰巨星，颜色比天王星更深邃。有着太阳系中最强烈的风暴。',
    details: {
      diameter: '49,244 km',
      distanceFromSun: '4,495,000,000 km',
      orbitalPeriod: '165 年',
      dayLength: '16 小时',
      temperature: '-200°C',
      moons: 14,
    },
    // Realistic: Deep Blue
    color: 'bg-[radial-gradient(circle_at_30%_30%,_#60a5fa_0%,_#2563eb_50%,_#172554_100%)]',
    sizeScale: 27,
    orbitScale: 640,
    orbitSpeed: 180,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/440px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg'
  },
  {
    id: 'pluto',
    name: '冥王星',
    enName: 'Pluto',
    description: '曾经的第九大行星，现在被归类为矮行星。它位于柯伊伯带，是一个寒冷的冰岩世界，有着偏心率极高的倾斜轨道。',
    details: {
      diameter: '2,377 km',
      distanceFromSun: '5,906,000,000 km',
      orbitalPeriod: '248 年',
      dayLength: '153 小时',
      temperature: '-229°C',
      moons: 5,
    },
    // Realistic: Off-white/brownish beige
    color: 'bg-[radial-gradient(circle_at_30%_30%,_#e7e5e4_0%,_#d6d3d1_40%,_#a8a29e_100%)] shadow-inner',
    sizeScale: 10,
    orbitScale: 720, // Farther out
    orbitSpeed: 248, // Very slow
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/440px-Pluto_in_True_Color_-_High-Res.jpg'
  }
];