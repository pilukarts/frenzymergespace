/**
 * Plataforma flotante - Trozo de meteorito/tierra en el espacio
 * Estilo cartoon/isométrico como Tropical Merge
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FloatingPlatform as FloatingPlatformType } from '../types/floating';

interface FloatingPlatformProps {
  platform: FloatingPlatformType;
  children?: React.ReactNode;
}

export const FloatingPlatform: React.FC<FloatingPlatformProps> = ({
  platform,
  children,
}) => {
  // Generar forma SVG según el tipo
  const getPlatformPath = (): string => {
    const { width, height } = platform.size;
    const w = width;
    const h = height;

    switch (platform.shape) {
      case 'round':
        return `M ${w * 0.2} 0 
                Q ${w * 0.5} -${h * 0.1} ${w * 0.8} 0 
                Q ${w} ${h * 0.3} ${w * 0.85} ${h * 0.7}
                Q ${w * 0.5} ${h * 1.1} ${w * 0.15} ${h * 0.7}
                Q 0 ${h * 0.3} ${w * 0.2} 0 Z`;
      
      case 'crescent':
        return `M ${w * 0.3} 0
                Q ${w * 0.6} ${h * 0.1} ${w * 0.9} ${h * 0.3}
                Q ${w} ${h * 0.6} ${w * 0.8} ${h * 0.9}
                Q ${w * 0.5} ${h} ${w * 0.2} ${h * 0.8}
                Q ${w * 0.4} ${h * 0.6} ${w * 0.5} ${h * 0.4}
                Q ${w * 0.4} ${h * 0.2} ${w * 0.3} 0 Z`;
      
      case 'irregular':
      default:
        return `M ${w * 0.1} ${h * 0.2}
                Q ${w * 0.3} -${h * 0.05} ${w * 0.5} ${h * 0.05}
                Q ${w * 0.7} -${h * 0.1} ${w * 0.9} ${h * 0.15}
                Q ${w * 1.05} ${h * 0.4} ${w * 0.95} ${h * 0.65}
                Q ${w} ${h * 0.85} ${w * 0.75} ${h * 0.95}
                Q ${w * 0.5} ${h * 1.05} ${w * 0.25} ${h * 0.9}
                Q -${w * 0.05} ${h * 0.7} ${w * 0.1} ${h * 0.2} Z`;
    }
  };

  // Colores de la plataforma
  const getPlatformColors = () => {
    return {
      top: '#5D4E37',      // Tierra oscura
      side: '#3D3225',     // Sombra lateral
      highlight: '#7A6B4E', // Brillo superior
      rock: '#4A4035',     // Rocas
    };
  };

  const colors = getPlatformColors();

  return (
    <motion.div
      className="absolute"
      style={{
        left: platform.position.x,
        top: platform.position.y,
        width: platform.size.width,
        height: platform.size.height,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: Math.random() * 0.5,
      }}
    >
      {/* Animación de flotación */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          y: [0, -8, 0],
          rotate: [platform.rotation - 1, platform.rotation + 1, platform.rotation - 1],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Sombra proyectada */}
        <motion.div
          className="absolute rounded-full opacity-30"
          style={{
            width: platform.size.width * 0.8,
            height: platform.size.height * 0.3,
            left: '10%',
            bottom: -20,
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
          animate={{
            scale: [1, 0.9, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* SVG de la plataforma */}
        <svg
          width={platform.size.width}
          height={platform.size.height}
          viewBox={`0 0 ${platform.size.width} ${platform.size.height}`}
          className="absolute inset-0"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        >
          <defs>
            {/* Gradiente para la superficie */}
            <linearGradient id={`surface-${platform.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.highlight} />
              <stop offset="50%" stopColor={colors.top} />
              <stop offset="100%" stopColor={colors.side} />
            </linearGradient>
            
            {/* Gradiente para rocas */}
            <radialGradient id={`rock-${platform.id}`}>
              <stop offset="0%" stopColor={colors.rock} />
              <stop offset="100%" stopColor={colors.side} />
            </radialGradient>

            {/* Patrón de textura */}
            <pattern id={`texture-${platform.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill={colors.side} opacity="0.3" />
              <circle cx="15" cy="12" r="1.5" fill={colors.rock} opacity="0.2" />
            </pattern>
          </defs>

          {/* Forma principal de la isla */}
          <path
            d={getPlatformPath()}
            fill={`url(#surface-${platform.id})`}
            stroke={colors.side}
            strokeWidth="2"
          />

          {/* Textura */}
          <path
            d={getPlatformPath()}
            fill={`url(#texture-${platform.id})`}
            opacity="0.5"
          />

          {/* Rocas decorativas */}
          <ellipse cx={platform.size.width * 0.2} cy={platform.size.height * 0.3} rx="8" ry="6" fill={`url(#rock-${platform.id})`} />
          <ellipse cx={platform.size.width * 0.75} cy={platform.size.height * 0.6} rx="10" ry="7" fill={`url(#rock-${platform.id})`} />
          <ellipse cx={platform.size.width * 0.5} cy={platform.size.height * 0.8} rx="6" ry="4" fill={`url(#rock-${platform.id})`} />

          {/* Cráteres */}
          <ellipse 
            cx={platform.size.width * 0.35} 
            cy={platform.size.height * 0.5} 
            rx="12" 
            ry="8" 
            fill={colors.side} 
            opacity="0.4"
          />
          <ellipse 
            cx={platform.size.width * 0.6} 
            cy={platform.size.height * 0.25} 
            rx="8" 
            ry="5" 
            fill={colors.side} 
            opacity="0.3"
          />

          {/* Brillo en el borde superior */}
          <path
            d={getPlatformPath()}
            fill="none"
            stroke={colors.highlight}
            strokeWidth="3"
            opacity="0.5"
            style={{ clipPath: 'inset(0 0 70% 0)' }}
          />
        </svg>

        {/* Área para objetos (posicionada sobre la plataforma) */}
        <div 
          className="absolute"
          style={{
            left: platform.size.width * 0.15,
            top: platform.size.height * 0.2,
            width: platform.size.width * 0.7,
            height: platform.size.height * 0.6,
          }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FloatingPlatform;
