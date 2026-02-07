/**
 * Objeto flotante para merge
 * Con drag & drop, efectos de brillo y animaciones
 */

import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { FloatingObject as FloatingObjectType, FLOATING_OBJECTS } from '../types/floating';

interface FloatingObjectProps {
  object: FloatingObjectType;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDrag?: (info: PanInfo) => void;
  onDragEnd?: () => void;
  mergeTarget?: boolean;
}

export const FloatingObjectComponent: React.FC<FloatingObjectProps> = ({
  object,
  isDragging = false,
  onDragStart,
  onDrag,
  onDragEnd,
  mergeTarget = false,
}) => {
  const objectInfo = FLOATING_OBJECTS[object.type];
  
  // Motion values para el drag
  const x = useMotionValue(object.position.x);
  const y = useMotionValue(object.position.y);
  
  // Transformaciones para efectos visuales
  const scale = useTransform(
    [x, y],
    ([latestX, latestY]) => {
      // Efecto de "levantamiento" al arrastrar
      return isDragging ? 1.2 : 1;
    }
  );

  const shadowOpacity = useTransform(
    [x, y],
    () => isDragging ? 0.3 : 0.6
  );

  // Variantes de animación
  const variants = {
    idle: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    dragging: {
      scale: 1.15,
      rotate: [0, -5, 5, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 0.5,
        },
      },
    },
    spawn: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
      },
    },
    mergeTarget: {
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        left: object.position.x,
        top: object.position.y,
        width: objectInfo.size,
        height: objectInfo.size,
        zIndex: isDragging ? 100 : object.level,
      }}
      drag
      dragMomentum={false}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      variants={variants}
      initial={object.isNew ? 'spawn' : 'idle'}
      animate={mergeTarget ? 'mergeTarget' : isDragging ? 'dragging' : 'idle'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Sombra */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '60%',
          height: '20%',
          left: '20%',
          bottom: '-10%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
          opacity: shadowOpacity,
          filter: 'blur(4px)',
        }}
      />

      {/* Contenedor del objeto */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          filter: isDragging ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' : 'none',
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 20px ${objectInfo.glowColor}`,
              `0 0 40px ${objectInfo.glowColor}`,
              `0 0 20px ${objectInfo.glowColor}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Halo de selección */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Indicador de merge target */}
        {mergeTarget && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-yellow-400"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}

        {/* Emoji/Object */}
        <motion.span
          className="text-4xl select-none"
          style={{
            filter: `drop-shadow(0 0 10px ${objectInfo.glowColor})`,
            fontSize: objectInfo.size * 0.6,
          }}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {objectInfo.emoji}
        </motion.span>

        {/* Indicador de nivel */}
        <motion.div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: objectInfo.color,
            color: object.level > 5 ? '#fff' : '#000',
            boxShadow: `0 0 10px ${objectInfo.glowColor}`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {objectInfo.level}
        </motion.div>

        {/* Partículas flotantes alrededor */}
        {object.level >= 5 && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: objectInfo.color,
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Tooltip con nombre (solo al hover) */}
      <motion.div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-white text-xs whitespace-nowrap pointer-events-none opacity-0"
        whileHover={{ opacity: 1 }}
      >
        {objectInfo.name}
      </motion.div>
    </motion.div>
  );
};

export default FloatingObjectComponent;
