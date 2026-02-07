/**
 * Integración con Firebase para el juego de Merge
 * Guarda y recupera el progreso del jugador
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { MergeGameState, Mission, BoardObject } from '../types/merge';

// Configuración de Firebase (debes usar la de tu proyecto)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Colección para guardar el progreso del juego
const MERGE_GAME_COLLECTION = 'mergeGames';

/**
 * Guarda el estado del juego de merge para un usuario
 */
export async function saveMergeGameState(
  userId: string,
  gameState: MergeGameState
): Promise<void> {
  try {
    const gameRef = doc(db, MERGE_GAME_COLLECTION, userId);
    
    await setDoc(gameRef, {
      ...gameState,
      lastSaved: serverTimestamp(),
    }, { merge: true });
    
    console.log('✅ Estado del juego guardado correctamente');
  } catch (error) {
    console.error('❌ Error al guardar el estado del juego:', error);
    throw error;
  }
}

/**
 * Carga el estado del juego de merge de un usuario
 */
export async function loadMergeGameState(
  userId: string
): Promise<MergeGameState | null> {
  try {
    const gameRef = doc(db, MERGE_GAME_COLLECTION, userId);
    const snapshot = await getDoc(gameRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data() as MergeGameState;
      console.log('✅ Estado del juego cargado correctamente');
      return data;
    }
    
    console.log('ℹ️ No hay estado guardado para este usuario');
    return null;
  } catch (error) {
    console.error('❌ Error al cargar el estado del juego:', error);
    throw error;
  }
}

/**
 * Actualiza solo la puntuación del jugador
 */
export async function updateMergeScore(
  userId: string,
  score: number
): Promise<void> {
  try {
    const gameRef = doc(db, MERGE_GAME_COLLECTION, userId);
    await updateDoc(gameRef, {
      'board.score': score,
      lastSaved: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Error al actualizar la puntuación:', error);
    throw error;
  }
}

/**
 * Actualiza las estadísticas del jugador
 */
export async function updateMergeStats(
  userId: string,
  stats: {
    totalMerges?: number;
    totalObjectsCreated?: number;
    highestLevelReached?: number;
    shipsBuilt?: number;
  }
): Promise<void> {
  try {
    const gameRef = doc(db, MERGE_GAME_COLLECTION, userId);
    await updateDoc(gameRef, {
      stats,
      lastSaved: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Error al actualizar las estadísticas:', error);
    throw error;
  }
}

/**
 * Marca una misión como completada
 */
export async function completeMission(
  userId: string,
  missionId: string,
  reward: { points: number; aurons?: number; xp: number }
): Promise<void> {
  try {
    const gameRef = doc(db, MERGE_GAME_COLLECTION, userId);
    
    // Obtener estado actual
    const snapshot = await getDoc(gameRef);
    if (!snapshot.exists()) return;
    
    const data = snapshot.data() as MergeGameState;
    const updatedMissions = data.missions.map(m =>
      m.id === missionId ? { ...m, completed: true, claimed: true } : m
    );
    
    await updateDoc(gameRef, {
      missions: updatedMissions,
      'board.score': (data.board.score || 0) + reward.points,
      lastSaved: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Error al completar la misión:', error);
    throw error;
  }
}

/**
 * Obtiene el leaderboard de merge
 */
export async function getMergeLeaderboard(
  limit: number = 10
): Promise<Array<{ userId: string; score: number; highestLevel: number; displayName?: string }>> {
  try {
    // Nota: Para esto necesitarías un índice en Firestore
    // o usar una Cloud Function
    const { getDocs, collection, query, orderBy, limit: firestoreLimit } = await import('firebase/firestore');
    
    const q = query(
      collection(db, MERGE_GAME_COLLECTION),
      orderBy('board.score', 'desc'),
      firestoreLimit(limit)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      userId: doc.id,
      score: doc.data().board?.score || 0,
      highestLevel: doc.data().board?.highestLevelReached || 1,
      displayName: doc.data().displayName,
    }));
  } catch (error) {
    console.error('❌ Error al obtener el leaderboard:', error);
    return [];
  }
}

/**
 * Sincroniza el estado del juego con el servidor
 * Útil para guardar automáticamente cada cierto tiempo
 */
export function autoSaveMergeGame(
  userId: string,
  getGameState: () => MergeGameState,
  intervalMs: number = 30000 // 30 segundos
): () => void {
  const intervalId = setInterval(async () => {
    try {
      const gameState = getGameState();
      await saveMergeGameState(userId, gameState);
    } catch (error) {
      console.error('Error en auto-save:', error);
    }
  }, intervalMs);

  // Retorna función para limpiar el intervalo
  return () => clearInterval(intervalId);
}

export { app, db };
export default app;
