/**
 * Tipos para el sistema de Merge Flotante Espacial
 * Objetos en plataformas de meteorito flotando en el espacio
 */

// Tipos de objetos para merge
export enum FloatingObjectType {
  SPACE_DEBRIS = 'space_debris',      // Nivel 1 - Basura espacial
  ASTEROID_CHUNK = 'asteroid_chunk',  // Nivel 2 - Trozo de asteroide
  IRON_ORE = 'iron_ore',              // Nivel 3 - Mineral de hierro
  CRYSTAL_SHARD = 'crystal_shard',    // Nivel 4 - Fragmento de cristal
  ENERGY_CORE = 'energy_core',        // Nivel 5 - Núcleo de energía
  SHIP_HULL = 'ship_hull',            // Nivel 6 - Casco de nave
  ENGINE_PART = 'engine_part',        // Nivel 7 - Pieza de motor
  NAV_SYSTEM = 'nav_system',          // Nivel 8 - Sistema de navegación
  WARP_DRIVE = 'warp_drive',          // Nivel 9 - Motor de curvatura
  STAR_CRUISER = 'star_cruiser',      // Nivel 10 - Crucero estelar
}

// Información de cada objeto
export interface FloatingObjectInfo {
  type: FloatingObjectType;
  level: number;
  name: string;
  description: string;
  emoji: string;
  color: string;
  glowColor: string;
  value: number;
  size: number; // Tamaño visual (px)
}

// Objeto en el juego
export interface FloatingObject {
  id: string;
  type: FloatingObjectType;
  level: number;
  position: {
    x: number;
    y: number;
  };
  isDragging?: boolean;
  isMerging?: boolean;
  isNew?: boolean;
  platformId?: string; // ID de la plataforma donde está
}

// Plataforma flotante (trozo de meteorito/tierra)
export interface FloatingPlatform {
  id: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  rotation: number;
  shape: 'round' | 'irregular' | 'crescent';
  objects: FloatingObject[];
  maxObjects: number;
}

// Estado del juego
export interface FloatingMergeState {
  platforms: FloatingPlatform[];
  floatingObjects: FloatingObject[]; // Objetos que no están en plataformas
  score: number;
  highestLevel: number;
  inventory: Record<FloatingObjectType, number>;
}

// Configuración del juego
export interface FloatingGameConfig {
  maxPlatforms: number;
  platformSpawnInterval: number;
  gravityRadius: number; // Radio para detectar fusión
}

// Información de todos los objetos
export const FLOATING_OBJECTS: Record<FloatingObjectType, FloatingObjectInfo> = {
  [FloatingObjectType.SPACE_DEBRIS]: {
    type: FloatingObjectType.SPACE_DEBRIS,
    level: 1,
    name: 'Basura Espacial',
    description: 'Restos de naves antiguas',
    emoji: '🔩',
    color: '#718096',
    glowColor: 'rgba(113, 128, 150, 0.4)',
    value: 10,
    size: 40,
  },
  [FloatingObjectType.ASTEROID_CHUNK]: {
    type: FloatingObjectType.ASTEROID_CHUNK,
    level: 2,
    name: 'Trozo de Asteroide',
    description: 'Roca espacial con minerales',
    emoji: '🪨',
    color: '#8B7355',
    glowColor: 'rgba(139, 115, 85, 0.5)',
    value: 25,
    size: 45,
  },
  [FloatingObjectType.IRON_ORE]: {
    type: FloatingObjectType.IRON_ORE,
    level: 3,
    name: 'Mineral de Hierro',
    description: 'Metal crudo del espacio',
    emoji: '⛏️',
    color: '#A0AEC0',
    glowColor: 'rgba(160, 174, 192, 0.5)',
    value: 60,
    size: 50,
  },
  [FloatingObjectType.CRYSTAL_SHARD]: {
    type: FloatingObjectType.CRYSTAL_SHARD,
    level: 4,
    name: 'Fragmento de Cristal',
    description: 'Cristal energético brillante',
    emoji: '💎',
    color: '#00D4FF',
    glowColor: 'rgba(0, 212, 255, 0.7)',
    value: 150,
    size: 55,
  },
  [FloatingObjectType.ENERGY_CORE]: {
    type: FloatingObjectType.ENERGY_CORE,
    level: 5,
    name: 'Núcleo de Energía',
    description: 'Poder puro concentrado',
    emoji: '⚡',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.8)',
    value: 400,
    size: 60,
  },
  [FloatingObjectType.SHIP_HULL]: {
    type: FloatingObjectType.SHIP_HULL,
    level: 6,
    name: 'Casco de Nave',
    description: 'Estructura principal',
    emoji: '🛡️',
    color: '#4A5568',
    glowColor: 'rgba(74, 85, 104, 0.6)',
    value: 1000,
    size: 70,
  },
  [FloatingObjectType.ENGINE_PART]: {
    type: FloatingObjectType.ENGINE_PART,
    level: 7,
    name: 'Pieza de Motor',
    description: 'Propulsión interestelar',
    emoji: '🔧',
    color: '#FF6B35',
    glowColor: 'rgba(255, 107, 53, 0.7)',
    value: 2500,
    size: 75,
  },
  [FloatingObjectType.NAV_SYSTEM]: {
    type: FloatingObjectType.NAV_SYSTEM,
    level: 8,
    name: 'Sistema de Navegación',
    description: 'Control de vuelo avanzado',
    emoji: '🧭',
    color: '#9F7AEA',
    glowColor: 'rgba(159, 122, 234, 0.7)',
    value: 6000,
    size: 80,
  },
  [FloatingObjectType.WARP_DRIVE]: {
    type: FloatingObjectType.WARP_DRIVE,
    level: 9,
    name: 'Motor de Curvatura',
    description: 'Viaje más rápido que la luz',
    emoji: '🌌',
    color: '#00FF88',
    glowColor: 'rgba(0, 255, 136, 0.9)',
    value: 15000,
    size: 90,
  },
  [FloatingObjectType.STAR_CRUISER]: {
    type: FloatingObjectType.STAR_CRUISER,
    level: 10,
    name: 'Crucero Estelar',
    description: '¡La nave definitiva!',
    emoji: '🚀',
    color: '#FF1493',
    glowColor: 'rgba(255, 20, 147, 1)',
    value: 50000,
    size: 100,
  },
};

// Obtener siguiente nivel
export function getNextFloatingLevel(current: FloatingObjectType): FloatingObjectType | null {
  const levels = Object.values(FloatingObjectType);
  const index = levels.indexOf(current);
  return index < levels.length - 1 ? levels[index + 1] : null;
}

// Generar ID único
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Calcular distancia entre dos puntos
export function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Verificar si dos objetos están lo suficientemente cerca para fusionar
export function canMergeFloating(
  obj1: FloatingObject, 
  obj2: FloatingObject, 
  mergeRadius: number = 80
): boolean {
  if (obj1.type !== obj2.type || obj1.level !== obj2.level) return false;
  const distance = getDistance(obj1.position, obj2.position);
  return distance <= mergeRadius;
}
