/**
 * Fondo espacial animado con estrellas, nebulosas y partículas
 */

import React from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface Nebula {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

// Generar estrellas
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));
};

// Generar nebulosas
const generateNebulas = (count: number): Nebula[] => {
  const colors = [
    'rgba(59, 130, 246, 0.3)',   // Azul
    'rgba(147, 51, 234, 0.25)',  // Púrpura
    'rgba(236, 72, 153, 0.2)',   // Rosa
    'rgba(0, 212, 255, 0.2)',    // Cyan
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 400 + 200,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 10 + 15,
  }));
};

const stars = generateStars(100);
const nebulas = generateNebulas(5);

export const SpaceBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradiente base del espacio */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(15, 23, 42, 1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(30, 27, 75, 1) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a1a 0%, #0f172a 50%, #1a1a3e 100%)
          `,
        }}
      />

      {/* Nebulosas */}
      {nebulas.map((nebula) => (
        <motion.div
          key={nebula.id}
          className="absolute rounded-full blur-3xl pointer-events-none"
          style={{
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            width: nebula.size,
            height: nebula.size,
            background: `radial-gradient(circle, ${nebula.color} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: nebula.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Estrellas brillantes */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
          animate={{
            opacity: [star.opacity, 1, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Estrellas fugaces */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none"
          style={{
            top: `${20 + i * 30}%`,
            left: '-100px',
            transform: 'rotate(-45deg)',
          }}
          animate={{
            left: ['-100px', '120%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 8 + 3,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Partículas de polvo espacial */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(${100 + Math.random() * 155}, ${100 + Math.random() * 155}, 255, 0.3)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Líneas de grid sutiles (opcional, estilo sci-fi) */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};

export default SpaceBackground;
