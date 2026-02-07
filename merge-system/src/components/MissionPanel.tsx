/**
 * Panel de Misiones del juego de Merge
 * Muestra las misiones activas y su progreso
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mission, MERGE_OBJECTS } from '../types/merge';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Gift, 
  Rocket, 
  Zap,
  Trophy,
  Star
} from 'lucide-react';

interface MissionPanelProps {
  missions: Mission[];
  onClaimReward: (missionId: string) => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({
  missions,
  onClaimReward,
}) => {
  // Icono según tipo de misión
  const getMissionIcon = (type: Mission['type']) => {
    switch (type) {
      case 'create':
        return <Rocket className="w-5 h-5 text-blue-400" />;
      case 'merge':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'collect':
        return <Target className="w-5 h-5 text-green-400" />;
      case 'reach_level':
        return <Trophy className="w-5 h-5 text-purple-400" />;
      default:
        return <Star className="w-5 h-5 text-slate-400" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // Misiones ordenadas: pendientes primero, luego completadas no reclamadas, luego reclamadas
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.claimed !== b.claimed) return a.claimed ? 1 : -1;
    if (a.completed !== b.completed) return a.completed ? -1 : 1;
    return 0;
  });

  return (
    <motion.div
      className="w-full max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Misiones</h2>
          <p className="text-sm text-slate-400">
            {missions.filter(m => m.completed && !m.claimed).length} recompensas pendientes
          </p>
        </div>
      </div>

      {/* Lista de misiones */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {sortedMissions.map((mission) => {
            const progress = (mission.currentCount / mission.targetCount) * 100;
            const targetObjectInfo = mission.targetObject ? MERGE_OBJECTS[mission.targetObject] : null;

            return (
              <motion.div
                key={mission.id}
                variants={itemVariants}
                layout
                className={`
                  relative p-4 rounded-xl border transition-all duration-300
                  ${mission.claimed 
                    ? 'bg-slate-800/50 border-slate-700 opacity-60' 
                    : mission.completed
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                {/* Indicador de completado */}
                {mission.completed && !mission.claimed && (
                  <motion.div
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-xs">!</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-start gap-3">
                  {/* Icono */}
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${mission.claimed ? 'bg-slate-700' : 'bg-slate-700/50'}
                  `}>
                    {getMissionIcon(mission.type)}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{mission.title}</h3>
                      {mission.claimed && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                      {mission.description}
                      {targetObjectInfo && (
                        <span className="inline-flex items-center gap-1 ml-1">
                          {targetObjectInfo.emoji}
                        </span>
                      )}
                    </p>

                    {/* Barra de progreso */}
                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                      <motion.div
                        className={`
                          absolute inset-y-0 left-0 rounded-full
                          ${mission.completed 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-500'
                          }
                        `}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {mission.currentCount} / {mission.targetCount}
                      </span>

                      {/* Recompensas */}
                      <div className="flex items-center gap-2">
                        {mission.reward.points > 0 && (
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {mission.reward.points.toLocaleString()}
                          </span>
                        )}
                        {mission.reward.aurons && mission.reward.aurons > 0 && (
                          <span className="text-xs text-purple-400 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {mission.reward.aurons}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botón de reclamar */}
                  {mission.completed && !mission.claimed && (
                    <motion.button
                      onClick={() => onClaimReward(mission.id)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Gift className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Estadísticas resumen */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">
              {missions.filter(m => m.completed).length}
            </p>
            <p className="text-xs text-slate-400">Completadas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {missions.filter(m => m.completed && !m.claimed).length}
            </p>
            <p className="text-xs text-slate-400">Pendientes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {missions.filter(m => m.claimed).length}
            </p>
            <p className="text-xs text-slate-400">Reclamadas</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionPanel;
