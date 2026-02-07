/**
 * Hook para el sistema de Merge Flotante
 * Maneja drag & drop, fusión de objetos y plataformas flotantes
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  FloatingObject,
  FloatingPlatform,
  FloatingObjectType,
  FLOATING_OBJECTS,
  getNextFloatingLevel,
  generateId,
  getDistance,
  canMergeFloating,
} from '../types/floating';

// Configuración
const MERGE_RADIUS = 80;
const SNAP_RADIUS = 60;

// Plataformas iniciales
const INITIAL_PLATFORMS: FloatingPlatform[] = [
  {
    id: 'platform_1',
    position: { x: 150, y: 200 },
    size: { width: 180, height: 140 },
    rotation: -5,
    shape: 'round',
    objects: [],
    maxObjects: 4,
  },
  {
    id: 'platform_2',
    position: { x: 400, y: 150 },
    size: { width: 160, height: 120 },
    rotation: 8,
    shape: 'irregular',
    objects: [],
    maxObjects: 3,
  },
  {
    id: 'platform_3',
    position: { x: 650, y: 250 },
    size: { width: 200, height: 150 },
    rotation: -3,
    shape: 'crescent',
    objects: [],
    maxObjects: 5,
  },
  {
    id: 'platform_4',
    position: { x: 280, y: 400 },
    size: { width: 150, height: 110 },
    rotation: 12,
    shape: 'round',
    objects: [],
    maxObjects: 3,
  },
  {
    id: 'platform_5',
    position: { x: 550, y: 450 },
    size: { width: 170, height: 130 },
    rotation: -8,
    shape: 'irregular',
    objects: [],
    maxObjects: 4,
  },
];

// Spawn inicial de objetos
function spawnInitialObjects(): FloatingObject[] {
  const objects: FloatingObject[] = [];
  const spawnTypes = [
    FloatingObjectType.SPACE_DEBRIS,
    FloatingObjectType.SPACE_DEBRIS,
    FloatingObjectType.ASTEROID_CHUNK,
    FloatingObjectType.ASTEROID_CHUNK,
    FloatingObjectType.IRON_ORE,
  ];

  spawnTypes.forEach((type, index) => {
    objects.push({
      id: generateId(),
      type,
      level: FLOATING_OBJECTS[type].level,
      position: {
        x: 100 + (index * 120) + Math.random() * 50,
        y: 300 + Math.random() * 100,
      },
      isNew: true,
    });
  });

  return objects;
}

export function useFloatingMerge() {
  // Estado
  const [platforms, setPlatforms] = useState<FloatingPlatform[]>(INITIAL_PLATFORMS);
  const [objects, setObjects] = useState<FloatingObject[]>(spawnInitialObjects());
  const [draggedObject, setDraggedObject] = useState<FloatingObject | null>(null);
  const [score, setScore] = useState(0);
  const [highestLevel, setHighestLevel] = useState(1);
  const [mergeAnimation, setMergeAnimation] = useState<{ from: string; to: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // ============ FUNCIONES AUXILIARES ============

  // Encontrar objeto por ID
  const findObject = useCallback((id: string): FloatingObject | undefined => {
    return objects.find(obj => obj.id === id);
  }, [objects]);

  // Encontrar plataforma que contiene un punto
  const findPlatformAtPosition = useCallback((x: number, y: number): FloatingPlatform | null => {
    return platforms.find(platform => {
      const dx = x - (platform.position.x + platform.size.width / 2);
      const dy = y - (platform.position.y + platform.size.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < Math.min(platform.size.width, platform.size.height) / 2;
    }) || null;
  }, [platforms]);

  // Verificar si hay un objeto cercano para fusionar
  const findMergeTarget = useCallback((obj: FloatingObject): FloatingObject | null => {
    for (const other of objects) {
      if (other.id === obj.id) continue;
      if (canMergeFloating(obj, other, MERGE_RADIUS)) {
        return other;
      }
    }
    return null;
  }, [objects]);

  // ============ ACCIONES ============

  // Iniciar drag
  const startDrag = useCallback((objectId: string) => {
    const obj = findObject(objectId);
    if (obj) {
      setDraggedObject({ ...obj, isDragging: true });
    }
  }, [findObject]);

  // Actualizar posición durante drag
  const updateDragPosition = useCallback((x: number, y: number) => {
    if (draggedObject) {
      setDraggedObject(prev => prev ? { ...prev, position: { x, y } } : null);
    }
  }, [draggedObject]);

  // Finalizar drag
  const endDrag = useCallback(() => {
    if (!draggedObject) return;

    const target = findMergeTarget(draggedObject);

    if (target) {
      // Fusionar objetos
      mergeObjects(draggedObject, target);
    } else {
      // Soltar objeto en nueva posición
      setObjects(prev =>
        prev.map(obj =>
          obj.id === draggedObject.id
            ? { ...obj, position: draggedObject.position, isDragging: false }
            : obj
        )
      );
    }

    setDraggedObject(null);
  }, [draggedObject, findMergeTarget]);

  // Fusionar dos objetos
  const mergeObjects = useCallback((obj1: FloatingObject, obj2: FloatingObject) => {
    const nextType = getNextFloatingLevel(obj1.type);
    if (!nextType) return;

    const nextInfo = FLOATING_OBJECTS[nextType];

    // Animación de merge
    setMergeAnimation({ from: obj1.id, to: obj2.id });

    setTimeout(() => {
      setObjects(prev => {
        const filtered = prev.filter(o => o.id !== obj1.id && o.id !== obj2.id);
        const mergedObject: FloatingObject = {
          id: generateId(),
          type: nextType,
          level: nextInfo.level,
          position: {
            x: (obj1.position.x + obj2.position.x) / 2,
            y: (obj1.position.y + obj2.position.y) / 2,
          },
          isNew: true,
          isMerging: false,
        };
        return [...filtered, mergedObject];
      });

      setScore(prev => prev + nextInfo.value);
      setHighestLevel(prev => Math.max(prev, nextInfo.level));
      setMergeAnimation(null);
    }, 300);
  }, []);

  // Spawnear nuevo objeto
  const spawnObject = useCallback(() => {
    const spawnableTypes = [
      FloatingObjectType.SPACE_DEBRIS,
      FloatingObjectType.ASTEROID_CHUNK,
      FloatingObjectType.IRON_ORE,
    ];
    
    const randomType = spawnableTypes[Math.floor(Math.random() * spawnableTypes.length)];
    const info = FLOATING_OBJECTS[randomType];

    const newObject: FloatingObject = {
      id: generateId(),
      type: randomType,
      level: info.level,
      position: {
        x: 50 + Math.random() * 700,
        y: 50 + Math.random() * 500,
      },
      isNew: true,
    };

    setObjects(prev => [...prev, newObject]);
  }, []);

  // Spawnear múltiples objetos
  const spawnMultiple = useCallback((count: number = 3) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnObject(), i * 200);
    }
  }, [spawnObject]);

  // Reiniciar juego
  const resetGame = useCallback(() => {
    setObjects(spawnInitialObjects());
    setScore(0);
    setHighestLevel(1);
    setDraggedObject(null);
    setMergeAnimation(null);
  }, []);

  // Limpiar flag isNew después de animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setObjects(prev =>
        prev.map(obj => (obj.isNew ? { ...obj, isNew: false } : obj))
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [objects]);

  return {
    // Estado
    platforms,
    objects,
    draggedObject,
    score,
    highestLevel,
    mergeAnimation,
    containerRef,

    // Acciones
    startDrag,
    updateDragPosition,
    endDrag,
    spawnObject,
    spawnMultiple,
    resetGame,
    findObject,
    findMergeTarget,
  };
}

export default useFloatingMerge;
