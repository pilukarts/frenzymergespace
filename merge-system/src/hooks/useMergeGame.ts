/**
 * Hook personalizado para el juego de Merge Espacial
 * Maneja toda la lógica del juego: tablero, fusiones, misiones, puntuación
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  MergeObjectType,
  BoardObject,
  MergeBoard,
  Mission,
  MergeGameState,
  MergeResult,
  MERGE_OBJECTS,
  getNextLevelObject,
  generateObjectId,
} from '../types/merge';

// Configuración por defecto
const DEFAULT_BOARD_ROWS = 5;
const DEFAULT_BOARD_COLS = 5;

// Misiones iniciales
const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission_1',
    title: 'Primeros Pasos',
    description: 'Crea tu primer Fragmento de Meteorito',
    type: 'create',
    targetObject: MergeObjectType.METEORITE_FRAGMENT,
    targetCount: 1,
    currentCount: 0,
    reward: { points: 100, xp: 50 },
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_2',
    title: 'Recolector Espacial',
    description: 'Acumula 5 Minerales Espaciales',
    type: 'collect',
    targetObject: MergeObjectType.SPATIAL_MINERAL,
    targetCount: 5,
    currentCount: 0,
    reward: { points: 500, aurons: 10, xp: 100 },
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_3',
    title: 'Constructor Novato',
    description: 'Crea tu primera Nave Pequeña',
    type: 'create',
    targetObject: MergeObjectType.SMALL_SHIP,
    targetCount: 1,
    currentCount: 0,
    reward: { points: 2000, aurons: 25, xp: 300 },
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_4',
    title: 'Maestro del Merge',
    description: 'Realiza 20 fusiones exitosas',
    type: 'merge',
    targetCount: 20,
    currentCount: 0,
    reward: { points: 1000, aurons: 15, xp: 200 },
    completed: false,
    claimed: false,
  },
  {
    id: 'mission_5',
    title: 'Hacia el Infinito',
    description: 'Alcanza el nivel 8 (Nave de Combate)',
    type: 'reach_level',
    targetLevel: 8,
    targetCount: 1,
    currentCount: 0,
    reward: { points: 10000, aurons: 100, xp: 1000 },
    completed: false,
    claimed: false,
  },
];

// Crear tablero vacío
function createEmptyBoard(rows: number, cols: number): (BoardObject | null)[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
}

// Obtener objeto aleatorio para spawn
function getRandomSpawnObject(): MergeObjectType {
  const spawnableObjects = Object.values(MERGE_OBJECTS).filter(obj => obj.spawnRate > 0);
  const totalRate = spawnableObjects.reduce((sum, obj) => sum + obj.spawnRate, 0);
  let random = Math.random() * totalRate;
  
  for (const obj of spawnableObjects) {
    random -= obj.spawnRate;
    if (random <= 0) {
      return obj.type;
    }
  }
  
  return MergeObjectType.STARDUST;
}

export function useMergeGame() {
  // Estado del tablero
  const [board, setBoard] = useState<MergeBoard>(() => ({
    rows: DEFAULT_BOARD_ROWS,
    cols: DEFAULT_BOARD_COLS,
    cells: createEmptyBoard(DEFAULT_BOARD_ROWS, DEFAULT_BOARD_COLS),
    score: 0,
    highestLevelReached: 1,
  }));

  // Estado de misiones
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);

  // Estadísticas
  const [stats, setStats] = useState({
    totalMerges: 0,
    totalObjectsCreated: 0,
    highestLevelReached: 1,
    shipsBuilt: 0,
  });

  // Objeto seleccionado para mover
  const [selectedObject, setSelectedObject] = useState<BoardObject | null>(null);

  // Historial para undo
  const historyRef = useRef<MergeBoard[]>([]);

  // ============ FUNCIONES AUXILIARES ============

  // Verificar si una posición es válida
  const isValidPosition = useCallback((row: number, col: number): boolean => {
    return row >= 0 && row < board.rows && col >= 0 && col < board.cols;
  }, [board.rows, board.cols]);

  // Obtener objeto en posición
  const getObjectAt = useCallback((row: number, col: number): BoardObject | null => {
    if (!isValidPosition(row, col)) return null;
    return board.cells[row][col];
  }, [board.cells, isValidPosition]);

  // Verificar si dos objetos pueden fusionarse
  const canMerge = useCallback((obj1: BoardObject, obj2: BoardObject): boolean => {
    return obj1.type === obj2.type && obj1.level === obj2.level;
  }, []);

  // Encontrar celdas vacías
  const findEmptyCells = useCallback((): { row: number; col: number }[] => {
    const empty: { row: number; col: number }[] = [];
    for (let row = 0; row < board.rows; row++) {
      for (let col = 0; col < board.cols; col++) {
        if (!board.cells[row][col]) {
          empty.push({ row, col });
        }
      }
    }
    return empty;
  }, [board.cells, board.rows, board.cols]);

  // ============ FUNCIONES PRINCIPALES ============

  // Spawnear un nuevo objeto en celda aleatoria
  const spawnObject = useCallback((): BoardObject | null => {
    const emptyCells = findEmptyCells();
    if (emptyCells.length === 0) return null;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const objectType = getRandomSpawnObject();
    const objectInfo = MERGE_OBJECTS[objectType];

    const newObject: BoardObject = {
      id: generateObjectId(),
      type: objectType,
      level: objectInfo.level,
      position: randomCell,
      isNew: true,
    };

    setBoard(prev => {
      const newCells = [...prev.cells.map(row => [...row])];
      newCells[randomCell.row][randomCell.col] = newObject;
      return { ...prev, cells: newCells };
    });

    setStats(prev => ({
      ...prev,
      totalObjectsCreated: prev.totalObjectsCreated + 1,
    }));

    return newObject;
  }, [findEmptyCells]);

  // Spawnear múltiples objetos al inicio
  const spawnInitialObjects = useCallback((count: number = 6) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => spawnObject(), i * 100);
    }
  }, [spawnObject]);

  // Fusionar dos objetos
  const mergeObjects = useCallback((obj1: BoardObject, obj2: BoardObject): MergeResult => {
    if (!canMerge(obj1, obj2)) {
      return { success: false, scoreGained: 0, leveledUp: false };
    }

    const nextType = getNextLevelObject(obj1.type);
    if (!nextType) {
      return { success: false, scoreGained: 0, leveledUp: false };
    }

    const nextObjectInfo = MERGE_OBJECTS[nextType];
    const mergedObject: BoardObject = {
      id: generateObjectId(),
      type: nextType,
      level: nextObjectInfo.level,
      position: obj2.position,
      isNew: true,
    };

    setBoard(prev => {
      const newCells = [...prev.cells.map(row => [...row])];
      // Eliminar objeto 1
      newCells[obj1.position.row][obj1.position.col] = null;
      // Colocar objeto fusionado en posición 2
      newCells[obj2.position.row][obj2.position.col] = mergedObject;

      const newHighestLevel = Math.max(prev.highestLevelReached, mergedObject.level);

      return {
        ...prev,
        cells: newCells,
        score: prev.score + nextObjectInfo.value,
        highestLevelReached: newHighestLevel,
      };
    });

    setStats(prev => {
      const newStats = {
        ...prev,
        totalMerges: prev.totalMerges + 1,
        highestLevelReached: Math.max(prev.highestLevelReached, mergedObject.level),
      };
      if (mergedObject.level >= 6) {
        newStats.shipsBuilt = prev.shipsBuilt + 1;
      }
      return newStats;
    });

    // Actualizar misiones
    updateMissions('merge', mergedObject.type, mergedObject.level);

    return {
      success: true,
      mergedObject,
      newPosition: obj2.position,
      scoreGained: nextObjectInfo.value,
      leveledUp: true,
    };
  }, [canMerge]);

  // Mover objeto
  const moveObject = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number): MergeResult => {
    const sourceObj = getObjectAt(fromRow, fromCol);
    const targetObj = getObjectAt(toRow, toCol);

    if (!sourceObj) {
      return { success: false, scoreGained: 0, leveledUp: false };
    }

    // Guardar estado para undo
    historyRef.current.push({ ...board, cells: board.cells.map(row => [...row]) });
    if (historyRef.current.length > 5) {
      historyRef.current.shift();
    }

    // Si hay un objeto en el destino, intentar fusionar
    if (targetObj) {
      if (canMerge(sourceObj, targetObj)) {
        return mergeObjects(sourceObj, targetObj);
      }
      // No se pueden fusionar, no hacer nada
      return { success: false, scoreGained: 0, leveledUp: false };
    }

    // Mover a celda vacía
    setBoard(prev => {
      const newCells = [...prev.cells.map(row => [...row])];
      newCells[fromRow][fromCol] = null;
      const movedObject = { ...sourceObj, position: { row: toRow, col: toCol } };
      newCells[toRow][toCol] = movedObject;
      return { ...prev, cells: newCells };
    });

    setSelectedObject(null);
    return { success: true, scoreGained: 0, leveledUp: false };
  }, [getObjectAt, canMerge, mergeObjects, board]);

  // Seleccionar objeto
  const selectObject = useCallback((obj: BoardObject | null) => {
    setSelectedObject(obj);
  }, []);

  // Click en celda
  const handleCellClick = useCallback((row: number, col: number) => {
    const clickedObj = getObjectAt(row, col);

    if (!selectedObject) {
      // Seleccionar objeto si hay uno
      if (clickedObj) {
        selectObject(clickedObj);
      }
      return;
    }

    // Si hacemos click en el mismo objeto, deseleccionar
    if (selectedObject.id === clickedObj?.id) {
      selectObject(null);
      return;
    }

    // Intentar mover/fusionar
    moveObject(selectedObject.position.row, selectedObject.position.col, row, col);
  }, [selectedObject, getObjectAt, selectObject, moveObject]);

  // Actualizar misiones
  const updateMissions = useCallback((action: 'create' | 'merge' | 'collect', objectType?: MergeObjectType, level?: number) => {
    setMissions(prev => prev.map(mission => {
      if (mission.completed) return mission;

      let shouldUpdate = false;

      switch (mission.type) {
        case 'create':
          if (action === 'merge' && mission.targetObject === objectType) {
            shouldUpdate = true;
          }
          break;
        case 'merge':
          if (action === 'merge') {
            shouldUpdate = true;
          }
          break;
        case 'collect':
          if (mission.targetObject === objectType) {
            shouldUpdate = true;
          }
          break;
        case 'reach_level':
          if (level && level >= (mission.targetLevel || 0)) {
            shouldUpdate = true;
          }
          break;
      }

      if (shouldUpdate) {
        const newCount = mission.currentCount + 1;
        const completed = newCount >= mission.targetCount;
        return {
          ...mission,
          currentCount: newCount,
          completed,
        };
      }

      return mission;
    }));
  }, []);

  // Reclamar recompensa de misión
  const claimMissionReward = useCallback((missionId: string) => {
    setMissions(prev => prev.map(mission => {
      if (mission.id === missionId && mission.completed && !mission.claimed) {
        return { ...mission, claimed: true };
      }
      return mission;
    }));
  }, []);

  // Undo
  const undo = useCallback(() => {
    const previousState = historyRef.current.pop();
    if (previousState) {
      setBoard(previousState);
      setSelectedObject(null);
    }
  }, []);

  // Reiniciar juego
  const resetGame = useCallback(() => {
    setBoard({
      rows: DEFAULT_BOARD_ROWS,
      cols: DEFAULT_BOARD_COLS,
      cells: createEmptyBoard(DEFAULT_BOARD_ROWS, DEFAULT_BOARD_COLS),
      score: 0,
      highestLevelReached: 1,
    });
    setMissions(INITIAL_MISSIONS);
    setStats({
      totalMerges: 0,
      totalObjectsCreated: 0,
      highestLevelReached: 1,
      shipsBuilt: 0,
    });
    setSelectedObject(null);
    historyRef.current = [];
    spawnInitialObjects();
  }, [spawnInitialObjects]);

  // Verificar game over (sin movimientos posibles)
  const checkGameOver = useCallback((): boolean => {
    const emptyCells = findEmptyCells();
    if (emptyCells.length > 0) return false;

    // Verificar si hay fusiones posibles
    for (let row = 0; row < board.rows; row++) {
      for (let col = 0; col < board.cols; col++) {
        const obj = board.cells[row][col];
        if (!obj) continue;

        // Verificar vecinos
        const neighbors = [
          { row: row - 1, col },
          { row: row + 1, col },
          { row, col: col - 1 },
          { row, col: col + 1 },
        ];

        for (const neighbor of neighbors) {
          const neighborObj = getObjectAt(neighbor.row, neighbor.col);
          if (neighborObj && canMerge(obj, neighborObj)) {
            return false;
          }
        }
      }
    }

    return true;
  }, [board.cells, board.rows, board.cols, findEmptyCells, getObjectAt, canMerge]);

  // Inicializar juego
  useEffect(() => {
    spawnInitialObjects();
  }, []);

  // Limpiar flag isNew después de animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setBoard(prev => ({
        ...prev,
        cells: prev.cells.map(row =>
          row.map(cell => cell ? { ...cell, isNew: false } : null)
        ),
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [board.cells]);

  return {
    // Estado
    board,
    missions,
    stats,
    selectedObject,
    isGameOver: checkGameOver(),
    canUndo: historyRef.current.length > 0,

    // Acciones
    spawnObject,
    moveObject,
    selectObject,
    handleCellClick,
    claimMissionReward,
    undo,
    resetGame,

    // Utilidades
    getObjectAt,
    canMerge,
    findEmptyCells,
  };
}

export default useMergeGame;
