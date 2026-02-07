/**
 * Componente de celda individual para el tablero de merge
 * Muestra el objeto espacial con animaciones y efectos visuales
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BoardObject, MERGE_OBJECTS } from '../types/merge';

interface MergeCellProps {
  object: BoardObject | null;
  isSelected: boolean;
  isValidTarget: boolean;
  onClick: () => void;
  row: number;
  col: number;
}

export const MergeCell: React.FC<MergeCellProps> = ({
  object,
  isSelected,
  isValidTarget,
  onClick,
  row,
  col,
}) => {
  const objectInfo = object ? MERGE_OBJECTS[object.type] : null;

  // Variantes de animación
  const cellVariants = {
    empty: {
      scale: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    hover: {
      scale: 1.02,
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
    },
    selected: {
      scale: 1.05,
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    },
  };

  const objectVariants = {
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    spawn: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
    idle: {
      scale: 1,
      rotate: 0,
      opacity: 1,
    },
    selected: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    merge: {
      scale: [1, 1.3, 0],
      opacity: [1, 1, 0],
      transition: {
        duration: 0.3,
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className={`
        relative w-full aspect-square rounded-xl cursor-pointer
        border-2 transition-all duration-200
        flex items-center justify-center
        ${isSelected ? 'border-blue-400' : 'border-slate-700/50'}
        ${isValidTarget && !object ? 'border-green-400/50 bg-green-400/10' : ''}
        ${isValidTarget && object ? 'border-yellow-400/50 bg-yellow-400/10' : ''}
      `}
      variants={cellVariants}
      initial="empty"
      animate={isSelected ? 'selected' : 'empty'}
      whileHover="hover"
      onClick={onClick}
      style={{
        background: isSelected
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
          : 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
      }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 rounded-xl opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20% 20%',
        }}
      />

      {/* Indicador de celda válida */}
      {isValidTarget && !object && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-dashed border-green-400/50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        />
      )}

      {/* Objeto */}
      {object && objectInfo && (
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center"
          variants={objectVariants}
          initial={object.isNew ? 'initial' : 'idle'}
          animate={isSelected ? 'selected' : 'idle'}
          key={object.id}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            variants={glowVariants}
            initial="initial"
            animate="animate"
            style={{
              background: objectInfo.glowColor,
              width: '150%',
              height: '150%',
              left: '-25%',
              top: '-25%',
            }}
          />

          {/* Emoji/Object */}
          <motion.span
            className="text-4xl md:text-5xl relative z-10 select-none"
            style={{
              filter: `drop-shadow(0 0 10px ${objectInfo.glowColor})`,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {objectInfo.emoji}
          </motion.span>

          {/* Level indicator */}
          <motion.div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: objectInfo.color,
              color: objectInfo.level > 5 ? '#fff' : '#000',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {objectInfo.level}
          </motion.div>

          {/* Selection ring */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}
            />
          )}
        </motion.div>
      )}

      {/* Coordenadas (debug) */}
      {/* <span className="absolute bottom-1 left-1 text-[8px] text-slate-500">
        {row},{col}
      </span> */}
    </motion.div>
  );
};

export default MergeCell;
