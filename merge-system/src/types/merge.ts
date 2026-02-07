/**
 * Sistema de Merge Espacial para Forgenite Frenzy
 * Tipos y definiciones para el juego de merge
 */

// Niveles de objetos del merge (de menor a mayor)
export enum MergeObjectType {
  // Nivel 1 - Materiales básicos
  STARDUST = 'stardust',
  // Nivel 2 - Fragmentos
  METEORITE_FRAGMENT = 'meteorite_fragment',
  // Nivel 3 - Minerales
  SPATIAL_MINERAL = 'spatial_mineral',
  // Nivel 4 - Aleaciones
  METAL_ALLOY = 'metal_alloy',
  // Nivel 5 - Componentes
  SHIP_MODULE = 'ship_module',
  // Nivel 6 - Naves básicas
  SMALL_SHIP = 'small_ship',
  // Nivel 7 - Naves especializadas
  CARGO_SHIP = 'cargo_ship',
  // Nivel 8 - Naves avanzadas
  COMBAT_SHIP = 'combat_ship',
  // Nivel 9 - Naves épicas
  SPACECRUISER = 'spacecruiser',
  // Nivel 10 - Objetivo final
  STARFORGE_ARK = 'starforge_ark',
}

// Información de cada tipo de objeto
export interface MergeObjectInfo {
  type: MergeObjectType;
  level: number;
  name: string;
  description: string;
  emoji: string;
  color: string;
  glowColor: string;
  value: number; // Valor en puntos
  spawnRate: number; // Probabilidad de aparición (0-1)
}

// Objeto en el tablero
export interface BoardObject {
  id: string;
  type: MergeObjectType;
  level: number;
  position: {
    row: number;
    col: number;
  };
  isNew?: boolean;
  isMerging?: boolean;
}

// Estado del tablero
export interface MergeBoard {
  rows: number;
  cols: number;
  cells: (BoardObject | null)[][];
  score: number;
  highestLevelReached: number;
}

// Misión del juego
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'create' | 'merge' | 'collect' | 'reach_level';
  targetObject?: MergeObjectType;
  targetLevel?: number;
  targetCount: number;
  currentCount: number;
  reward: {
    points: number;
    aurons?: number;
    xp: number;
  };
  completed: boolean;
  claimed: boolean;
}

// Estado del jugador en el juego de merge
export interface MergeGameState {
  board: MergeBoard;
  missions: Mission[];
  inventory: {
    [key in MergeObjectType]?: number;
  };
  stats: {
    totalMerges: number;
    totalObjectsCreated: number;
    highestLevelReached: number;
    shipsBuilt: number;
  };
  lastSaved: number;
}

// Configuración del juego
export interface MergeGameConfig {
  boardRows: number;
  boardCols: number;
  maxUndoSteps: number;
  spawnObjects: MergeObjectType[];
  missionsEnabled: boolean;
}

// Eventos del juego
export type MergeGameEvent =
  | { type: 'OBJECT_SPAWNED'; object: BoardObject }
  | { type: 'OBJECTS_MERGED'; from: BoardObject; to: BoardObject; result: BoardObject }
  | { type: 'MISSION_COMPLETED'; mission: Mission }
  | { type: 'LEVEL_UP'; newLevel: number }
  | { type: 'GAME_OVER'; finalScore: number };

// Información de fusión
export interface MergeResult {
  success: boolean;
  mergedObject?: BoardObject;
  newPosition?: { row: number; col: number };
  scoreGained: number;
  leveledUp: boolean;
}

// Definiciones de todos los objetos del juego
export const MERGE_OBJECTS: Record<MergeObjectType, MergeObjectInfo> = {
  [MergeObjectType.STARDUST]: {
    type: MergeObjectType.STARDUST,
    level: 1,
    name: 'Polvo Estelar',
    description: 'Material básico del cosmos',
    emoji: '✨',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.5)',
    value: 10,
    spawnRate: 0.5,
  },
  [MergeObjectType.METEORITE_FRAGMENT]: {
    type: MergeObjectType.METEORITE_FRAGMENT,
    level: 2,
    name: 'Fragmento de Meteorito',
    description: 'Restos de roca espacial',
    emoji: '🪨',
    color: '#8B7355',
    glowColor: 'rgba(139, 115, 85, 0.5)',
    value: 25,
    spawnRate: 0.3,
  },
  [MergeObjectType.SPATIAL_MINERAL]: {
    type: MergeObjectType.SPATIAL_MINERAL,
    level: 3,
    name: 'Mineral Espacial',
    description: 'Cristales raros del espacio profundo',
    emoji: '💎',
    color: '#00CED1',
    glowColor: 'rgba(0, 206, 209, 0.5)',
    value: 60,
    spawnRate: 0.15,
  },
  [MergeObjectType.METAL_ALLOY]: {
    type: MergeObjectType.METAL_ALLOY,
    level: 4,
    name: 'Aleación Metálica',
    description: 'Metal refinado para construcción',
    emoji: '🔩',
    color: '#C0C0C0',
    glowColor: 'rgba(192, 192, 192, 0.5)',
    value: 150,
    spawnRate: 0.05,
  },
  [MergeObjectType.SHIP_MODULE]: {
    type: MergeObjectType.SHIP_MODULE,
    level: 5,
    name: 'Módulo de Nave',
    description: 'Componente base para naves',
    emoji: '🔧',
    color: '#4169E1',
    glowColor: 'rgba(65, 105, 225, 0.5)',
    value: 400,
    spawnRate: 0,
  },
  [MergeObjectType.SMALL_SHIP]: {
    type: MergeObjectType.SMALL_SHIP,
    level: 6,
    name: 'Nave Pequeña',
    description: 'Tu primera nave funcional',
    emoji: '🚀',
    color: '#FF6347',
    glowColor: 'rgba(255, 99, 71, 0.6)',
    value: 1000,
    spawnRate: 0,
  },
  [MergeObjectType.CARGO_SHIP]: {
    type: MergeObjectType.CARGO_SHIP,
    level: 7,
    name: 'Nave de Carga',
    description: 'Transporta recursos por la galaxia',
    emoji: '🛸',
    color: '#9370DB',
    glowColor: 'rgba(147, 112, 219, 0.6)',
    value: 2500,
    spawnRate: 0,
  },
  [MergeObjectType.COMBAT_SHIP]: {
    type: MergeObjectType.COMBAT_SHIP,
    level: 8,
    name: 'Nave de Combate',
    description: 'Defiende la Alianza del Cyber Concord',
    emoji: '⚔️',
    color: '#DC143C',
    glowColor: 'rgba(220, 20, 60, 0.7)',
    value: 6000,
    spawnRate: 0,
  },
  [MergeObjectType.SPACECRUISER]: {
    type: MergeObjectType.SPACECRUISER,
    level: 9,
    name: 'Crucero Espacial',
    description: 'Nave avanzada de la flota',
    emoji: '🛰️',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.8)',
    value: 15000,
    spawnRate: 0,
  },
  [MergeObjectType.STARFORGE_ARK]: {
    type: MergeObjectType.STARFORGE_ARK,
    level: 10,
    name: 'StarForge Ark',
    description: '¡La salvación de la humanidad!',
    emoji: '🌌',
    color: '#FF1493',
    glowColor: 'rgba(255, 20, 147, 1)',
    value: 50000,
    spawnRate: 0,
  },
};

// Obtener el siguiente nivel de objeto
export function getNextLevelObject(currentType: MergeObjectType): MergeObjectType | null {
  const levels = Object.values(MergeObjectType);
  const currentIndex = levels.indexOf(currentType);
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return null;
}

// Obtener objeto por nivel
export function getObjectByLevel(level: number): MergeObjectType | null {
  const objects = Object.values(MERGE_OBJECTS);
  const found = objects.find(obj => obj.level === level);
  return found?.type || null;
}

// Generar ID único
export function generateObjectId(): string {
  return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
