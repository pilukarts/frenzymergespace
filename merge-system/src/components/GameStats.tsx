/**
 * Panel de estadísticas del juego de Merge
 * Muestra puntuación, nivel máximo alcanzado y estadísticas
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  GitMerge, 
  Rocket, 
  RotateCcw, 
  Undo2,
  Sparkles,
  Crown
} from 'lucide-react';

interface GameStatsProps {
  score: number;
  highestLevel: number;
  totalMerges: number;
  shipsBuilt: number;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onSpawn: () => void;
}

export const GameStats: React.FC<GameStatsProps> = ({
  score,
  highestLevel,
  totalMerges,
  shipsBuilt,
  canUndo,
  onUndo,
  onReset,
  onSpawn,
}) => {
  // Nombres de niveles
  const levelNames: Record<number, string> = {
    1: 'Polvo Estelar',
    2: 'Fragmento',
    3: 'Mineral',
    4: 'Aleación',
    5: 'Módulo',
    6: 'Nave Pequeña',
    7: 'Nave de Carga',
    8: 'Nave de Combate',
    9: 'Crucero',
    10: 'StarForge Ark',
  };

  const statVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="w-full space-y-4">
      {/* Puntuación principal */}
      <motion.div
        className="relative p-6 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="relative z-10 text-center">
          <motion.p
            className="text-sm text-slate-400 mb-1 uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Puntuación
          </motion.p>
          <motion.div
            className="flex items-center justify-center gap-2"
            key={score}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">
              {score.toLocaleString()}
            </span>
          </motion.div>
        </div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Estadísticas secundarias */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          className="p-4 rounded-xl bg-slate-800/80 border border-slate-700"
          variants={statVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Nivel Máx.</span>
          </div>
          <p className="text-2xl font-bold text-white">{highestLevel}</p>
          <p className="text-xs text-slate-500 truncate">
            {levelNames[highestLevel] || 'Desconocido'}
          </p>
        </motion.div>

        <motion.div
          className="p-4 rounded-xl bg-slate-800/80 border border-slate-700"
          variants={statVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <div className="flex items-center gap-2 mb-2">
            <GitMerge className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-400">Fusiones</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalMerges}</p>
          <p className="text-xs text-slate-500">Total</p>
        </motion.div>

        <motion.div
          className="p-4 rounded-xl bg-slate-800/80 border border-slate-700"
          variants={statVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <div className="flex items-center gap-2 mb-2">
            <Rocket className="w-4 h-4 text-green-400" />
            <span className="text-xs text-slate-400">Naves</span>
          </div>
          <p className="text-2xl font-bold text-white">{shipsBuilt}</p>
          <p className="text-xs text-slate-500">Construidas</p>
        </motion.div>

        <motion.div
          className="p-4 rounded-xl bg-slate-800/80 border border-slate-700"
          variants={statVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-400">Rango</span>
          </div>
          <p className="text-lg font-bold text-white truncate">
            {highestLevel >= 8 ? 'Comandante' : 
             highestLevel >= 6 ? 'Ingeniero' : 
             highestLevel >= 4 ? 'Recolector' : 'Cadete'}
          </p>
          <p className="text-xs text-slate-500">Actual</p>
        </motion.div>
      </div>

      {/* Controles */}
      <div className="flex gap-2">
        <motion.button
          onClick={onSpawn}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-400 hover:to-emerald-400 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline">Spawn Objeto</span>
          <span className="sm:hidden">Spawn</span>
        </motion.button>

        <motion.button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all
            ${canUndo 
              ? 'bg-slate-700 text-white hover:bg-slate-600' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }
          `}
          whileHover={canUndo ? { scale: 1.02 } : {}}
          whileTap={canUndo ? { scale: 0.98 } : {}}
        >
          <Undo2 className="w-5 h-5" />
          <span className="hidden sm:inline">Deshacer</span>
        </motion.button>

        <motion.button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-5 h-5" />
          <span className="hidden sm:inline">Reiniciar</span>
        </motion.button>
      </div>
    </div>
  );
};

export default GameStats;
