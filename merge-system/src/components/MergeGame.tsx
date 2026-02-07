/**
 * Componente principal del juego de Merge Espacial
 * Integra todos los componentes y la lógica del juego
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMergeGame } from '../hooks/useMergeGame';
import { MergeBoard } from './MergeBoard';
import { MissionPanel } from './MissionPanel';
import { GameStats } from './GameStats';
import { ObjectInfo } from './ObjectInfo';
import { MERGE_OBJECTS } from '../types/merge';
import { 
  Rocket, 
  Sparkles, 
  Trophy,
  X
} from 'lucide-react';

interface MergeGameProps {
  onScoreUpdate?: (score: number) => void;
  onMissionComplete?: (missionId: string, reward: { points: number; aurons?: number; xp: number }) => void;
}

export const MergeGame: React.FC<MergeGameProps> = ({
  onScoreUpdate,
  onMissionComplete,
}) => {
  const {
    board,
    missions,
    stats,
    selectedObject,
    isGameOver,
    canUndo,
    spawnObject,
    handleCellClick,
    claimMissionReward,
    undo,
    resetGame,
    getObjectAt,
    canMerge,
  } = useMergeGame();

  // Notificar cambio de puntuación
  useEffect(() => {
    onScoreUpdate?.(board.score);
  }, [board.score, onScoreUpdate]);

  // Notificar misión completada
  useEffect(() => {
    missions.forEach(mission => {
      if (mission.completed && !mission.claimed) {
        onMissionComplete?.(mission.id, mission.reward);
      }
    });
  }, [missions, onMissionComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Nebulosa */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, transparent 70%)' }}
        />
        
        {/* Estrellas */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(147, 51, 234, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Rocket className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Merge Espacial
              </h1>
              <p className="text-sm text-slate-400">
                Fusiona objetos para construir naves
              </p>
            </div>
          </div>

          {/* Objetivo actual */}
          <motion.div
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-xs text-slate-400">Objetivo</p>
              <p className="text-sm font-semibold text-white">
                {MERGE_OBJECTS[Object.values(MERGE_OBJECTS).find(o => o.level === board.highestLevelReached + 1)?.type || 'starforge_ark']?.name || '¡StarForge Ark!'}
              </p>
            </div>
          </motion.div>
        </motion.header>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Tablero */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estadísticas */}
            <GameStats
              score={board.score}
              highestLevel={board.highestLevelReached}
              totalMerges={stats.totalMerges}
              shipsBuilt={stats.shipsBuilt}
              canUndo={canUndo}
              onUndo={undo}
              onReset={resetGame}
              onSpawn={spawnObject}
            />

            {/* Tablero */}
            <MergeBoard
              cells={board.cells}
              selectedObject={selectedObject}
              onCellClick={handleCellClick}
              canMerge={canMerge}
              getObjectAt={getObjectAt}
            />

            {/* Info de objetos */}
            <ObjectInfo highestLevelReached={board.highestLevelReached} />
          </div>

          {/* Columna derecha - Misiones */}
          <div className="lg:col-span-1">
            <MissionPanel
              missions={missions}
              onClaimReward={claimMissionReward}
            />
          </div>
        </div>

        {/* Tutorial flotante */}
        <motion.div
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-xl bg-slate-800/95 border border-slate-700 backdrop-blur-sm"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">¿Cómo jugar?</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Toca un objeto para seleccionarlo</li>
                <li>• Toca otro igual para fusionarlos</li>
                <li>• O muévelo a una celda vacía</li>
                <li>• ¡Crea la StarForge Ark!</li>
              </ul>
            </div>
            <button 
              className="text-slate-500 hover:text-white"
              onClick={(e) => {
                const el = e.currentTarget.parentElement?.parentElement;
                el?.remove();
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-md w-full p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-5xl">💥</span>
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-2">
                ¡Sin movimientos!
              </h2>
              <p className="text-slate-400 mb-6">
                El tablero está lleno y no hay más fusiones posibles.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-800">
                  <p className="text-sm text-slate-400">Puntuación</p>
                  <p className="text-2xl font-bold text-white">
                    {board.score.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800">
                  <p className="text-sm text-slate-400">Nivel Máx.</p>
                  <p className="text-2xl font-bold text-white">
                    {board.highestLevelReached}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={resetGame}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg hover:from-blue-400 hover:to-purple-400 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Jugar de Nuevo
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MergeGame;
