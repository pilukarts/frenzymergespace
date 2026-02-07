# 🚀 Sistema de Merge Espacial para Forgenite Frenzy

Sistema completo de juego de merge con temática espacial para integrar en **Alliance Forge: Forgeite Frenzy**.

## ✨ Características

- 🎮 **Mecánica de Merge**: Fusiona 2 objetos iguales para crear uno superior
- 🚀 **10 niveles de objetos**: Desde Polvo Estelar hasta la StarForge Ark
- 📋 **Sistema de Misiones**: Completa objetivos y gana recompensas
- 🔥 **Animaciones fluidas**: Usando Framer Motion
- 💾 **Integración Firebase**: Guarda el progreso automáticamente
- 📱 **Responsive**: Funciona en móvil y desktop
- 🎨 **Diseño espacial**: UI futurista con efectos de neón

## 📦 Instalación

### 1. Copiar archivos al proyecto

Copia la carpeta `merge-system/src` a tu proyecto en `src/merge-game/`:

```bash
# Desde la raíz de tu proyecto
cp -r /ruta/al/merge-system/src/* src/merge-game/
```

### 2. Instalar dependencias adicionales (si no las tienes)

```bash
npm install framer-motion
```

### 3. Configurar variables de entorno

Añade a tu `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=forgeite-frenzy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## 🎮 Uso

### Componente Principal

```tsx
import { MergeGame } from '@/merge-game';

export default function MergeGamePage() {
  return (
    <MergeGame
      onScoreUpdate={(score) => console.log('Score:', score)}
      onMissionComplete={(missionId, reward) => {
        console.log('Mission completed:', missionId, reward);
      }}
    />
  );
}
```

### Integración con Firebase

```tsx
import { useEffect } from 'react';
import { useMergeGame } from '@/merge-game';
import { 
  saveMergeGameState, 
  loadMergeGameState,
  autoSaveMergeGame 
} from '@/merge-game';

function MergeGameWithSave({ userId }: { userId: string }) {
  const game = useMergeGame();

  // Cargar progreso al iniciar
  useEffect(() => {
    loadMergeGameState(userId).then(savedState => {
      if (savedState) {
        // Restaurar estado
        // ...
      }
    });
  }, [userId]);

  // Auto-guardar cada 30 segundos
  useEffect(() => {
    const cleanup = autoSaveMergeGame(userId, () => ({
      board: game.board,
      missions: game.missions,
      stats: game.stats,
      inventory: {},
      lastSaved: Date.now(),
    }));
    return cleanup;
  }, [userId, game]);

  return <MergeBoard {...game} />;
}
```

## 🎯 Objetos del Juego

| Nivel | Objeto | Emoji | Valor |
|-------|--------|-------|-------|
| 1 | Polvo Estelar | ✨ | 10 |
| 2 | Fragmento de Meteorito | 🪨 | 25 |
| 3 | Mineral Espacial | 💎 | 60 |
| 4 | Aleación Metálica | 🔩 | 150 |
| 5 | Módulo de Nave | 🔧 | 400 |
| 6 | Nave Pequeña | 🚀 | 1,000 |
| 7 | Nave de Carga | 🛸 | 2,500 |
| 8 | Nave de Combate | ⚔️ | 6,000 |
| 9 | Crucero Espacial | 🛰️ | 15,000 |
| 10 | StarForge Ark | 🌌 | 50,000 |

## 🎨 Personalización

### Cambiar colores de objetos

```tsx
// En types/merge.ts
export const MERGE_OBJECTS: Record<MergeObjectType, MergeObjectInfo> = {
  [MergeObjectType.STARDUST]: {
    type: MergeObjectType.STARDUST,
    level: 1,
    name: 'Polvo Estelar',
    description: 'Material básico del cosmos',
    emoji: '✨',
    color: '#FFD700', // Cambia este color
    glowColor: 'rgba(255, 215, 0, 0.5)',
    value: 10,
    spawnRate: 0.5,
  },
  // ...
};
```

### Añadir nuevas misiones

```tsx
const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission_custom',
    title: 'Mi Misión',
    description: 'Descripción de la misión',
    type: 'create', // 'create' | 'merge' | 'collect' | 'reach_level'
    targetObject: MergeObjectType.SMALL_SHIP,
    targetCount: 5,
    currentCount: 0,
    reward: { points: 1000, aurons: 50, xp: 200 },
    completed: false,
    claimed: false,
  },
];
```

## 📁 Estructura de archivos

```
merge-system/
├── src/
│   ├── types/
│   │   └── merge.ts          # Tipos y definiciones
│   ├── hooks/
│   │   └── useMergeGame.ts   # Lógica del juego
│   ├── components/
│   │   ├── MergeCell.tsx     # Celda individual
│   │   ├── MergeBoard.tsx    # Tablero completo
│   │   ├── MissionPanel.tsx  # Panel de misiones
│   │   ├── GameStats.tsx     # Estadísticas
│   │   ├── ObjectInfo.tsx    # Info de objetos
│   │   └── MergeGame.tsx     # Componente principal
│   ├── lib/
│   │   └── firebase.ts       # Integración Firebase
│   └── index.ts              # Exportaciones
└── README.md
```

## 🔧 API del Hook useMergeGame

```tsx
const {
  // Estado
  board,              // Estado del tablero
  missions,           // Lista de misiones
  stats,              // Estadísticas del juego
  selectedObject,     // Objeto seleccionado
  isGameOver,         // ¿Juego terminado?
  canUndo,            // ¿Se puede deshacer?

  // Acciones
  spawnObject,        // Spawnear objeto aleatorio
  moveObject,         // Mover objeto
  handleCellClick,    // Manejar click en celda
  claimMissionReward, // Reclamar recompensa
  undo,               // Deshacer último movimiento
  resetGame,          // Reiniciar juego

  // Utilidades
  getObjectAt,        // Obtener objeto en posición
  canMerge,           // Verificar si puede fusionar
  findEmptyCells,     // Encontrar celdas vacías
} = useMergeGame();
```

## 🚀 Integración con Telegram Web App

```tsx
import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { MergeGame } from '@/merge-game';

export default function TelegramMergeGame() {
  useEffect(() => {
    // Expandir la ventana
    WebApp.expand();
    
    // Configurar botón atrás
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => {
      // Volver al menú principal
    });
  }, []);

  return (
    <MergeGame
      onScoreUpdate={(score) => {
        // Enviar datos al bot de Telegram
        WebApp.sendData(JSON.stringify({ score }));
      }}
    />
  );
}
```

## 📄 Licencia

MIT - Parte del proyecto Forgenite Frenzy

---

¿Necesitas ayuda? ¡Contáctame! 🚀
