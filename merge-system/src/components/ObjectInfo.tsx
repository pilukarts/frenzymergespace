/**
 * Panel de información de objetos del Merge
 * Muestra la cadena de evolución de los objetos
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MERGE_OBJECTS, 
  MergeObjectType,
  getNextLevelObject 
} from '../types/merge';
import { 
  ChevronRight, 
  Info, 
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';

interface ObjectInfoProps {
  highestLevelReached: number;
}

export const ObjectInfo: React.FC<ObjectInfoProps> = ({ highestLevelReached }) => {
  const [selectedType, setSelectedType] = useState<MergeObjectType | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const objects = Object.values(MERGE_OBJECTS);
  const selectedObject = selectedType ? MERGE_OBJECTS[selectedType] : null;

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        staggerChildren: 0.05,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="w-full">
      {/* Header colapsable */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Catálogo Espacial</h3>
            <p className="text-sm text-slate-400">Descubre todos los objetos</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </motion.div>
      </motion.button>

      {/* Contenido expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 overflow-hidden"
          >
            {/* Grid de objetos */}
            <motion.div
              className="grid grid-cols-5 gap-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {objects.map((obj) => {
                const isUnlocked = obj.level <= highestLevelReached;
                const isSelected = selectedType === obj.type;

                return (
                  <motion.button
                    key={obj.type}
                    variants={itemVariants}
                    onClick={() => setSelectedType(isUnlocked ? obj.type : null)}
                    className={`
                      relative aspect-square rounded-lg flex flex-col items-center justify-center
                      transition-all duration-200
                      ${isUnlocked 
                        ? 'cursor-pointer hover:scale-110' 
                        : 'cursor-not-allowed opacity-50'
                      }
                      ${isSelected 
                        ? 'ring-2 ring-blue-400 bg-blue-500/20' 
                        : 'bg-slate-800 hover:bg-slate-700'
                      }
                    `}
                    whileHover={isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  >
                    {/* Emoji */}
                    <span className="text-2xl">{isUnlocked ? obj.emoji : '🔒'}</span>
                    
                    {/* Nivel */}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-700 
                                   flex items-center justify-center text-[10px] font-bold text-white">
                      {obj.level}
                    </span>

                    {/* Indicador de desbloqueado */}
                    {isUnlocked && (
                      <motion.div
                        className="absolute -top-1 -left-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Unlock className="w-3 h-3 text-green-400" />
                      </motion.div>
                    )}

                    {/* Glow para objetos de alto nivel */}
                    {isUnlocked && obj.level >= 8 && (
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        animate={{
                          boxShadow: [
                            `0 0 5px ${obj.glowColor}`,
                            `0 0 20px ${obj.glowColor}`,
                            `0 0 5px ${obj.glowColor}`,
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Detalle del objeto seleccionado */}
            <AnimatePresence mode="wait">
              {selectedObject && (
                <motion.div
                  key={selectedObject.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-3 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700"
                >
                  <div className="flex items-start gap-4">
                    {/* Icono grande */}
                    <motion.div
                      className="w-20 h-20 rounded-xl flex items-center justify-center text-5xl"
                      style={{
                        background: `linear-gradient(135deg, ${selectedObject.color}33, ${selectedObject.color}11)`,
                        border: `2px solid ${selectedObject.color}66`,
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 10px ${selectedObject.glowColor}`,
                          `0 0 30px ${selectedObject.glowColor}`,
                          `0 0 10px ${selectedObject.glowColor}`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {selectedObject.emoji}
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-white">
                          {selectedObject.name}
                        </h4>
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ 
                            background: selectedObject.color,
                            color: selectedObject.level > 5 ? '#fff' : '#000'
                          }}
                        >
                          Nivel {selectedObject.level}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-3">
                        {selectedObject.description}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-white">
                            {selectedObject.value.toLocaleString()} pts
                          </span>
                        </div>

                        {/* Siguiente evolución */}
                        {selectedObject.level < 10 && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-xs">Fusiona 2 para evolucionar</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cadena de evolución */}
                  {selectedObject.level < 10 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-xs text-slate-500 mb-2">Evolución:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{selectedObject.emoji}</span>
                        <span className="text-slate-500">+</span>
                        <span className="text-xl">{selectedObject.emoji}</span>
                        <span className="text-slate-500">=</span>
                        {(() => {
                          const nextType = getNextLevelObject(selectedObject.type);
                          const nextObj = nextType ? MERGE_OBJECTS[nextType] : null;
                          return nextObj ? (
                            <motion.span 
                              className="text-xl"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              {nextObj.emoji}
                            </motion.span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ObjectInfo;
