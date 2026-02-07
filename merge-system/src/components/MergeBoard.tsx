/**
 * Componente del tablero de Merge Espacial
 * Grid interactivo donde los jugadores fusionan objetos
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MergeCell } from './MergeCell';
import { BoardObject } from '../types/merge';

interface MergeBoardProps {
  cells: (BoardObject | null)[][];
  selectedObject: BoardObject | null;
  onCellClick: (row: number, col: number) => void;
  canMerge: (obj1: BoardObject, obj2: BoardObject) => boolean;
  getObjectAt: (row: number, col: number) => BoardObject | null;
}

export const MergeBoard: React.FC<MergeBoardProps> = ({
  cells,
  selectedObject,
  onCellClick,
  canMerge,
  getObjectAt,
}) => {
  // Verificar si una celda es un objetivo válido para la selección actual
  const isValidTarget = (row: number, col: number): boolean => {
    if (!selectedObject) return false;
    
    const targetObj = getObjectAt(row, col);
    
    // Celda vacía adyacente es válida
    if (!targetObj) {
      const isAdjacent = 
        Math.abs(selectedObject.position.row - row) + 
        Math.abs(selectedObject.position.col - col) === 1;
      return isAdjacent;
    }
    
    // Objeto del mismo tipo y nivel es válido para merge
    return canMerge(selectedObject, targetObj);
  };

  const boardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  return (
    <motion.div
      className="relative p-4 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
        boxShadow: `
          0 0 40px rgba(59, 130, 246, 0.2),
          inset 0 0 40px rgba(0, 0, 0, 0.3)
        `,
      }}
      variants={boardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Borde brillante */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)',
          padding: '2px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Grid del tablero */}
      <div className="relative z-10 grid gap-2" style={{ gridTemplateColumns: `repeat(${cells[0]?.length || 5}, 1fr)` }}>
        {cells.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                variants={rowVariants}
              >
                <MergeCell
                  object={cell}
                  isSelected={selectedObject?.id === cell?.id}
                  isValidTarget={isValidTarget(rowIndex, colIndex)}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  row={rowIndex}
                  col={colIndex}
                />
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Efecto de partículas estelares */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MergeBoard;
