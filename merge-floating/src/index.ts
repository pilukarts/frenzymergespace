/**
 * Sistema de Merge Flotante Espacial
 * Exportaciones principales
 */

// Tipos
export * from './types/floating';

// Hooks
export { useFloatingMerge, default as useFloatingMergeDefault } from './hooks/useFloatingMerge';

// Componentes
export { SpaceBackground } from './components/SpaceBackground';
export { FloatingPlatform } from './components/FloatingPlatform';
export { FloatingObjectComponent } from './components/FloatingObject';
export { FloatingMergeGame } from './components/FloatingMergeGame';

// Versión
export const VERSION = '1.0.0';
