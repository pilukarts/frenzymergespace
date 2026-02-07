/**
 * Juego de Merge Flotante Espacial
 * Objetos en trozos de meteorito flotando en el espacio
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useFloatingMerge } from '../hooks/useFloatingMerge';
import { SpaceBackground } from './SpaceBackground';
import { FloatingPlatform } from './FloatingPlatform';
import { FloatingObjectComponent } from './FloatingObject';
import { FLOATING_OBJECTS, canMergeFloating } from '../types/floating';
import { 
  Zap, 
  Sparkles, 
  RotateCcw, 
  Plus,
  Trophy,
  Rocket,
  Target,
  Info
} from 'lucide-react';

interface FloatingMergeGameProps {
  onScoreUpdate?: (score: number) => void;
}

export const FloatingMergeGame: React.FC<FloatingMergeGameProps> = ({
  onScoreUpdate,
}) => {
  const {
    platforms,
    objects,
    draggedObject,
    score,
    highestLevel,
    mergeAnimation,
    containerRef,
    startDrag,
    updateDragPosition,
    endDrag,
    spawnObject,
    spawnMultiple,
    resetGame,
    findObject,
    findMergeTarget,
  } = useFloatingMerge();

  const [showTutorial, setShowTutorial] = useState(true);
  const [mergePreview, setMergePreview] = useState<string | null>(null);

  // Notificar cambio de puntuación
  useEffect(() => {
    onScoreUpdate?.(score);
  }, [score, onScoreUpdate]);

  // Manejar inicio de drag
  const handleDragStart = useCallback((objectId: string) => {
    startDrag(objectId);
    const obj = findObject(objectId);
    if (obj) {
      // Buscar posibles objetivos de merge
      const target = findMergeTarget(obj);
      if (target) {
        setMergePreview(target.id);
      }
    }
  }, [startDrag, findObject, findMergeTarget]);

  // Manejar drag
  const handleDrag = useCallback((info: PanInfo) => {
    if (containerRef.current && draggedObject) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = info.point.x - rect.left - 30;
      const y = info.point.y - rect.top - 30;
      updateDragPosition(x, y);

      // Actualizar preview de merge
      const obj = { ...draggedObject, position: { x, y } };
      const target = objects.find(o => 
        o.id !== obj.id && canMergeFloating(obj, o, 80)
      );
      setMergePreview(target?.id || null);
    }
  }, [draggedObject, updateDragPosition, containerRef, objects]);

  // Manejar fin de drag
  const handleDragEnd = useCallback(() => {
    endDrag();
    setMergePreview(null);
  }, [endDrag]);

  // Obtener nombre del nivel actual
  const getCurrentLevelName = () => {
    const levelObj = Object.values(FLOATING_OBJECTS).find(o => o.level === highestLevel);
    return levelObj?.name || 'Desconocido';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Fondo espacial */}
      <SpaceBackground />

      {/* Área de juego */}
      <div className="absolute inset-0">
        {/* Plataformas flotantes */}
        {platforms.map((platform) => (
          <FloatingPlatform key={platform.id} platform={platform}>
            {/* Objetos en esta plataforma podrían ir aquí */}
          </FloatingPlatform>
        ))}

        {/* Objetos flotantes */}
        <AnimatePresence>
          {objects.map((obj) => (
            <FloatingObjectComponent
              key={obj.id}
              object={obj}
              isDragging={draggedObject?.id === obj.id}
              onDragStart={() => handleDragStart(obj.id)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              mergeTarget={mergePreview === obj.id}
            />
          ))}
        </AnimatePresence>

        {/* Efecto de fusión */}
        <AnimatePresence>
          {mergeAnimation && (
            <motion.div
              className="absolute pointer-events-none"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                left: '50%',
                top: '50%',
              }}
            >
              <div className="w-20 h-20 rounded-full bg-yellow-400 blur-xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* UI Superior - Score y Stats */}
      <motion.div
        className="absolute top-0 left-0 right-0 p-4 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Score */}
          <motion.div
            className="flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Puntuación</p>
              <motion.p 
                className="text-2xl font-bold text-white tabular-nums"
                key={score}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
              >
                {score.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>

          {/* Nivel actual */}
          <motion.div
            className="flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Nivel Máx.</p>
              <p className="text-lg font-bold text-white">{highestLevel}</p>
              <p className="text-xs text-slate-500">{getCurrentLevelName()}</p>
            </div>
          </motion.div>

          {/* Objetivo */}
          <motion.div
            className="hidden md:flex items-center gap-3 px-6 py-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Objetivo</p>
              <p className="text-sm font-bold text-white">
                {highestLevel < 10 ? FLOATING_OBJECTS[Object.values(FLOATING_OBJECTS).find(o => o.level === highestLevel + 1)?.type || 'STAR_CRUISER'].name : '¡Completado!'}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* UI Inferior - Controles */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="flex items-center justify-center gap-4">
          <motion.button
            onClick={spawnObject}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Spawn Objeto</span>
          </motion.button>

          <motion.button
            onClick={() => spawnMultiple(3)}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            <span>Spawn x3</span>
          </motion.button>

          <motion.button
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reiniciar</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tutorial */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            className="absolute bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-xl z-50"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-2">¿Cómo jugar?</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Arrastra objetos para moverlos</li>
                  <li>• Acerca 2 iguales para fusionar</li>
                  <li>• Crea objetos de nivel superior</li>
                  <li>• ¡Alcanza el Crucero Estelar!</li>
                </ul>
              </div>
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-slate-500 hover:text-white"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de objetos */}
      <motion.div
        className="absolute top-24 left-4 p-3 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-slate-300">
            Objetos: <span className="text-white font-bold">{objects.length}</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingMergeGame;
