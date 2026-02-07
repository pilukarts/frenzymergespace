/**
 * Ejemplo de página de Next.js para integrar el juego de Merge
 * En tu proyecto, copia esto a: app/merge/page.tsx
 */

'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext'; // Ajusta según tu proyecto
import { 
  saveMergeGameState, 
  loadMergeGameState,
  updateMergeScore,
} from '@/merge-game';

// Carga dinámica para evitar problemas de SSR con Telegram WebApp
const MergeGame = dynamic(
  () => import('@/merge-game').then(mod => mod.MergeGame),
  { ssr: false }
);

export default function MergeGamePage() {
  const { user } = useAuth(); // O tu sistema de autenticación
  const [isLoading, setIsLoading] = useState(true);
  const [initialState, setInitialState] = useState(null);

  // Cargar progreso guardado
  useEffect(() => {
    if (user?.uid) {
      loadMergeGameState(user.uid)
        .then(savedState => {
          if (savedState) {
            setInitialState(savedState);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Guardar puntuación cuando cambie
  const handleScoreUpdate = async (score: number) => {
    if (user?.uid) {
      await updateMergeScore(user.uid, score);
    }
  };

  // Manejar misión completada
  const handleMissionComplete = async (
    missionId: string, 
    reward: { points: number; aurons?: number; xp: number }
  ) => {
    console.log(`🎉 Misión ${missionId} completada!`, reward);
    
    // Aquí puedes:
    // 1. Mostrar notificación
    // 2. Actualizar monedas del jugador
    // 3. Enviar evento a analytics
    
    if (user?.uid) {
      // Actualizar en Firebase
      // await completeMission(user.uid, missionId, reward);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando juego...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Header opcional */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-slate-950 to-transparent">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            ← Volver
          </button>
          
          {user && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800">
              <span className="text-sm text-slate-400">Jugador:</span>
              <span className="text-sm text-white font-medium">
                {user.displayName || user.email || 'Anónimo'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Juego */}
      <MergeGame
        onScoreUpdate={handleScoreUpdate}
        onMissionComplete={handleMissionComplete}
      />
    </main>
  );
}
