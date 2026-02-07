/**
 * Sistema de Merge Espacial para Forgenite Frenzy
 * Exporta todos los componentes, hooks y utilidades
 */

// Tipos
export * from './types/merge';

// Hooks
export { useMergeGame, default as useMergeGameDefault } from './hooks/useMergeGame';

// Componentes
export { MergeCell } from './components/MergeCell';
export { MergeBoard } from './components/MergeBoard';
export { MissionPanel } from './components/MissionPanel';
export { GameStats } from './components/GameStats';
export { ObjectInfo } from './components/ObjectInfo';
export { MergeGame } from './components/MergeGame';

// Firebase
export {
  saveMergeGameState,
  loadMergeGameState,
  updateMergeScore,
  updateMergeStats,
  completeMission,
  getMergeLeaderboard,
  autoSaveMergeGame,
  app as firebaseApp,
  db as firestoreDb,
} from './lib/firebase';

// Versión del paquete
export const VERSION = '1.0.0';
