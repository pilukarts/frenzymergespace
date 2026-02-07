/**
 * Ejemplo de integración del Merge Flotante con el juego de Tap del Comandante
 * Para Forgenite Frenzy
 */

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Rocket, 
  Target,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Carga dinámica del juego de merge
const FloatingMergeGame = dynamic(
  () => import('@/merge-floating').then(mod => mod.FloatingMergeGame),
  { ssr: false }
);

interface IntegratedGameProps {
  userId: string;
  initialPoints?: number;
  onPointsUpdate?: (points: number) => void;
}

// Modos de juego
type GameMode = 'tap' | 'merge';

export const IntegratedGame: React.FC<IntegratedGameProps> = ({
  userId,
  initialPoints = 0,
  onPointsUpdate,
}) => {
  const [gameMode, setGameMode] = useState<GameMode>('tap');
  const [tapPoints, setTapPoints] = useState(initialPoints);
  const [mergePoints, setMergePoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(initialPoints);
  const [tapCount, setTapCount] = useState(0);
  const [showModeSwitch, setShowModeSwitch] = useState(true);

  // Actualizar puntos totales
  useEffect(() => {
    const total = tapPoints + mergePoints;
    setTotalPoints(total);
    onPointsUpdate?.(total);
  }, [tapPoints, mergePoints, onPointsUpdate]);

  // Manejar tap en comandante
  const handleCommanderTap = () => {
    const pointsPerTap = 10 + Math.floor(tapCount / 10) * 2;
    setTapPoints(prev => prev + pointsPerTap);
    setTapCount(prev => prev + 1);
  };

  // Manejar puntuación del merge
  const handleMergeScore = (score: number) => {
    setMergePoints(score);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* Header con puntos totales */}
      <motion.div
        className="absolute top-0 left-0 right-0 p-4 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Logo/Back */}
          <div className="flex items-center gap-3">
            <motion.button
              className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-blue-400" />
              <span className="text-white font-bold">Alliance Forge</span>
            </div>
          </div>

          {/* Puntos totales */}
          <motion.div
            className="flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '2px solid rgba(255, 215, 0, 0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Puntos Totales</p>
              <motion.p 
                className="text-3xl font-bold text-white tabular-nums"
                key={totalPoints}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {totalPoints.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>

          {/* Info de modos */}
          <div className="hidden md:flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-slate-800/80">
              <p className="text-xs text-slate-400">Tap</p>
              <p className="text-lg font-bold text-blue-400">{tapPoints.toLocaleString()}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-800/80">
              <p className="text-xs text-slate-400">Merge</p>
              <p className="text-lg font-bold text-purple-400">{mergePoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido del juego */}
      <AnimatePresence mode="wait">
        {gameMode === 'tap' ? (
          <motion.div
            key="tap-mode"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Fondo del modo tap */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
              {/* Efectos de fondo */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
              </div>
            </div>

            {/* Área de tap */}
            <div className="relative z-10 text-center">
              <motion.p
                className="text-slate-400 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ¡Toca al Comandante para ganar puntos!
              </motion.p>

              {/* Comandante (círculo clickable) */}
              <motion.button
                className="relative w-48 h-48 rounded-full"
                onClick={handleCommanderTap}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 40px rgba(59, 130, 246, 0.5)',
                      '0 0 80px rgba(147, 51, 234, 0.5)',
                      '0 0 40px rgba(59, 130, 246, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Avatar del comandante */}
                <div 
                  className="absolute inset-2 rounded-full flex items-center justify-center text-7xl"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                  }}
                >
                  👨‍🚀
                </div>

                {/* Partículas de tap */}
                <AnimatePresence>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}-${tapCount}`}
                      className="absolute w-2 h-2 rounded-full bg-yellow-400"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    />
                  ))}
                </AnimatePresence>
              </motion.button>

              {/* Puntos por tap */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-slate-400 text-sm">Taps realizados</p>
                <p className="text-2xl font-bold text-white">{tapCount}</p>
                <p className="text-sm text-blue-400">
                  +{10 + Math.floor(tapCount / 10) * 2} pts por tap
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="merge-mode"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FloatingMergeGame onScoreUpdate={handleMergeScore} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Switch de modos */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div 
          className="flex items-center gap-2 p-2 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.button
            onClick={() => setGameMode('tap')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${gameMode === 'tap' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                : 'text-slate-400 hover:text-white'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Target className="w-5 h-5" />
            <span>Tap</span>
          </motion.button>

          <motion.button
            onClick={() => setGameMode('merge')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${gameMode === 'merge' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'text-slate-400 hover:text-white'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-5 h-5" />
            <span>Merge</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Indicador de modo */}
      <motion.div
        className="absolute top-24 right-4 px-4 py-2 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-slate-400 uppercase tracking-wider">Modo Actual</p>
        <p className="text-lg font-bold text-white">
          {gameMode === 'tap' ? '👆 Tap del Comandante' : '🎮 Merge Espacial'}
        </p>
      </motion.div>
    </div>
  );
};

export default IntegratedGame;
