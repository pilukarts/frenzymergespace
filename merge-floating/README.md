# 🌌 Sistema de Merge Flotante Espacial

Sistema de merge con objetos flotando en trozos de meteorito, estilo **Tropical Merge** pero con temática espacial para **Forgenite Frenzy**.

## ✨ Características

- 🪐 **Plataformas flotantes**: Trozos de meteorito/tierra que flotan en el espacio
- 🎮 **Drag & Drop**: Arrastra objetos libremente por el mapa
- ⚡ **Fusión por proximidad**: Acerca 2 objetos iguales para fusionarlos
- 🌠 **Fondo espacial animado**: Estrellas, nebulosas y partículas
- 🎨 **Estilo cartoon/isométrico**: Como Tropical Merge pero espacial
- 🔗 **Integración con Tap**: Cambia entre modo Tap y modo Merge

## 📦 Instalación

### 1. Copiar archivos

```bash
# Copia la carpeta merge-floating a tu proyecto
cp -r merge-floating/src/* tu-proyecto/src/merge-floating/
```

### 2. Crear página

```tsx
// app/merge/page.tsx
'use client';

import dynamic from 'next/dynamic';

const FloatingMergeGame = dynamic(
  () => import('@/merge-floating').then(mod => mod.FloatingMergeGame),
  { ssr: false }
);

export default function MergePage() {
  return <FloatingMergeGame />;
}
```

### 3. Integración completa con Tap

```tsx
// app/game/page.tsx
'use client';

import { IntegratedGame } from '@/merge-floating/example/integrated-game';

export default function GamePage() {
  return (
    <IntegratedGame 
      userId="user_123"
      initialPoints={0}
      onPointsUpdate={(points) => console.log('Total:', points)}
    />
  );
}
```

## 🎯 Objetos del Juego

| Nivel | Objeto | Emoji | Descripción |
|-------|--------|-------|-------------|
| 1 | 🔩 Basura Espacial | Restos de naves |
| 2 | 🪨 Trozo de Asteroide | Roca con minerales |
| 3 | ⛏️ Mineral de Hierro | Metal del espacio |
| 4 | 💎 Fragmento de Cristal | Cristal energético |
| 5 | ⚡ Núcleo de Energía | Poder concentrado |
| 6 | 🛡️ Casco de Nave | Estructura principal |
| 7 | 🔧 Pieza de Motor | Propulsión interestelar |
| 8 | 🧭 Sistema de Navegación | Control avanzado |
| 9 | 🌌 Motor de Curvatura | Viaje FTL |
| 10 | 🚀 Crucero Estelar | ¡La nave definitiva! |

## 🎮 Cómo Jugar

1. **Arrastra** objetos para moverlos por el espacio
2. **Acerca** 2 objetos del mismo tipo para fusionarlos
3. **Crea** objetos de nivel superior
4. **Alcanza** el Crucero Estelar (nivel 10)

## 🎨 Personalización

### Cambiar plataformas

```tsx
// En useFloatingMerge.ts
const INITIAL_PLATFORMS: FloatingPlatform[] = [
  {
    id: 'platform_1',
    position: { x: 150, y: 200 },
    size: { width: 180, height: 140 },
    rotation: -5,
    shape: 'round', // 'round' | 'irregular' | 'crescent'
    objects: [],
    maxObjects: 4,
  },
  // ...
];
```

### Cambiar objetos

```tsx
// En types/floating.ts
export const FLOATING_OBJECTS: Record<FloatingObjectType, FloatingObjectInfo> = {
  [FloatingObjectType.SPACE_DEBRIS]: {
    type: FloatingObjectType.SPACE_DEBRIS,
    level: 1,
    name: 'Tu Nombre',
    description: 'Tu descripción',
    emoji: '🚀',
    color: '#FF0000',
    glowColor: 'rgba(255, 0, 0, 0.5)',
    value: 100,
    size: 50,
  },
  // ...
};
```

## 🔧 API

### useFloatingMerge

```tsx
const {
  platforms,        // Plataformas flotantes
  objects,          // Objetos en el juego
  draggedObject,    // Objeto siendo arrastrado
  score,            // Puntuación
  highestLevel,     // Nivel máximo alcanzado
  
  // Acciones
  startDrag,        // Iniciar drag
  updateDragPosition, // Actualizar posición
  endDrag,          // Finalizar drag
  spawnObject,      // Spawnear objeto
  spawnMultiple,    // Spawnear múltiples
  resetGame,        // Reiniciar
} = useFloatingMerge();
```

## 📁 Estructura

```
merge-floating/
├── src/
│   ├── types/floating.ts       # Tipos y definiciones
│   ├── hooks/useFloatingMerge.ts # Lógica del juego
│   ├── components/
│   │   ├── SpaceBackground.tsx # Fondo espacial
│   │   ├── FloatingPlatform.tsx # Plataformas
│   │   ├── FloatingObject.tsx   # Objetos draggables
│   │   └── FloatingMergeGame.tsx # Juego completo
│   ├── example/
│   │   └── integrated-game.tsx  # Integración con Tap
│   └── index.ts
└── README.md
```

## 🚀 Modos de Juego

### Modo Tap (Original)
- Toca al Comandante para ganar puntos
- Acumula taps para multiplicadores
- Puntos base: 10 + bonus

### Modo Merge (Nuevo)
- Arrastra y fusiona objetos
- Crea naves espaciales
- Puntos por fusión

### Puntos Totales
```
Total = Puntos Tap + Puntos Merge
```

## 💾 Integración Firebase

```tsx
import { saveMergeGameState, loadMergeGameState } from '@/merge-floating';

// Guardar progreso
await saveMergeGameState(userId, {
  objects,
  score,
  highestLevel,
});

// Cargar progreso
const saved = await loadMergeGameState(userId);
```

## 🎨 Estilos

Los componentes usan Tailwind CSS. Asegúrate de tener:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📱 Responsive

El juego se adapta automáticamente a:
- Desktop: Vista completa
- Tablet: Ajusta tamaños
- Móvil: Controles táctiles optimizados

## 🔗 Dependencias

```json
{
  "dependencies": {
    "framer-motion": "^11.x",
    "lucide-react": "^0.x"
  }
}
```

## 📝 Licencia

MIT - Parte de Forgenite Frenzy

---

¡A fusionar en el espacio! 🚀✨
