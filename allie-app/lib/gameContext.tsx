'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for game state
export type SceneType = 'map' | 'busStop' | 'park' | 'zoo' | 'beach' | 'home';

export interface GameScene {
  id: SceneType;
  name: string;
  icon: string;
  unlocked: boolean;
  stars: number; // 0-3 stars earned
  miniGames: {
    id: string;
    name: string;
    completed: boolean;
    highScore: number;
  }[];
}

export interface Collectible {
  id: string;
  type: 'star' | 'sticker' | 'treasure';
  scene: SceneType;
  collected: boolean;
  icon: string;
}

export interface GameState {
  currentScene: SceneType;
  scenes: GameScene[];
  collectibles: Collectible[];
  totalStars: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  playerName: string;
  achievements: string[];
}

interface GameContextType {
  gameState: GameState;
  setCurrentScene: (scene: SceneType) => void;
  unlockScene: (scene: SceneType) => void;
  completeMinigame: (scene: SceneType, gameId: string, score: number) => void;
  collectItem: (itemId: string) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  resetGame: () => void;
  saveGame: () => void;
  loadGame: () => void;
}

const initialGameState: GameState = {
  currentScene: 'map',
  scenes: [
    {
      id: 'busStop',
      name: 'Bus Stop',
      icon: '🚏',
      unlocked: true,
      stars: 0,
      miniGames: [
        { id: 'countKids', name: 'Count the Kids', completed: false, highScore: 0 },
        { id: 'wheelSpin', name: 'Spin the Wheels', completed: false, highScore: 0 }
      ]
    },
    {
      id: 'park',
      name: 'The Park',
      icon: '🌳',
      unlocked: true, // Unlock by default for easier progression
      stars: 0,
      miniGames: [
        { id: 'butterflyChase', name: 'Butterfly Chase', completed: false, highScore: 0 },
        { id: 'flowerPick', name: 'Pick Flowers', completed: false, highScore: 0 }
      ]
    },
    {
      id: 'zoo',
      name: 'The Zoo',
      icon: '🦁',
      unlocked: false,
      stars: 0,
      miniGames: [
        { id: 'animalSounds', name: 'Animal Sounds', completed: false, highScore: 0 },
        { id: 'feedAnimals', name: 'Feed the Animals', completed: false, highScore: 0 }
      ]
    },
    {
      id: 'beach',
      name: 'The Beach',
      icon: '🏖️',
      unlocked: true, // Unlock for easier access
      stars: 0,
      miniGames: [
        { id: 'sandcastle', name: 'Build Sandcastles', completed: false, highScore: 0 },
        { id: 'shellCollect', name: 'Collect Shells', completed: false, highScore: 0 }
      ]
    },
    {
      id: 'home',
      name: 'Back Home',
      icon: '🏠',
      unlocked: false,
      stars: 0,
      miniGames: [
        { id: 'toyCleanup', name: 'Toy Cleanup', completed: false, highScore: 0 },
        { id: 'bedtime', name: 'Bedtime Story', completed: false, highScore: 0 }
      ]
    }
  ],
  collectibles: [
    { id: 'star1', type: 'star', scene: 'busStop', collected: false, icon: '⭐' },
    { id: 'star2', type: 'star', scene: 'park', collected: false, icon: '⭐' },
    { id: 'star3', type: 'star', scene: 'zoo', collected: false, icon: '⭐' },
    { id: 'star4', type: 'star', scene: 'beach', collected: false, icon: '⭐' },
    { id: 'star5', type: 'star', scene: 'home', collected: false, icon: '⭐' },
    { id: 'sticker1', type: 'sticker', scene: 'busStop', collected: false, icon: '🦋' },
    { id: 'sticker2', type: 'sticker', scene: 'park', collected: false, icon: '🌸' },
    { id: 'sticker3', type: 'sticker', scene: 'zoo', collected: false, icon: '🐘' },
    { id: 'sticker4', type: 'sticker', scene: 'beach', collected: false, icon: '🐚' },
    { id: 'sticker5', type: 'sticker', scene: 'home', collected: false, icon: '🧸' }
  ],
  totalStars: 0,
  soundEnabled: true,
  musicEnabled: true,
  playerName: 'Allie',
  achievements: []
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // Load game on mount
  useEffect(() => {
    loadGame();
  }, []);

  // Auto-save when game state changes
  useEffect(() => {
    saveGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const setCurrentScene = (scene: SceneType) => {
    setGameState(prev => ({ ...prev, currentScene: scene }));
  };

  const unlockScene = (scene: SceneType) => {
    setGameState(prev => ({
      ...prev,
      scenes: prev.scenes.map(s => 
        s.id === scene ? { ...s, unlocked: true } : s
      )
    }));
  };

  const completeMinigame = (scene: SceneType, gameId: string, score: number) => {
    setGameState(prev => {
      const newScenes = prev.scenes.map(s => {
        if (s.id === scene) {
          const newMiniGames = s.miniGames.map(g => {
            if (g.id === gameId) {
              return {
                ...g,
                completed: true,
                highScore: Math.max(g.highScore, score)
              };
            }
            return g;
          });
          
          // Calculate stars for the scene
          const completedCount = newMiniGames.filter(g => g.completed).length;
          // 1 star for first game, 2 stars for second game, 3 stars for collecting the star item
          const stars = completedCount;
          
          // Unlock next scene if this one has at least 1 star
          if (stars >= 1) {
            const sceneOrder: SceneType[] = ['busStop', 'park', 'zoo', 'beach', 'home'];
            const currentIndex = sceneOrder.indexOf(scene);
            if (currentIndex < sceneOrder.length - 1) {
              const nextScene = sceneOrder[currentIndex + 1];
              setTimeout(() => unlockScene(nextScene), 1000);
            }
            
            // Special case: completing Park also unlocks Beach (for testing)
            if (scene === 'park' && stars >= 1) {
              setTimeout(() => unlockScene('beach'), 1500);
            }
          }
          
          return { ...s, miniGames: newMiniGames, stars };
        }
        return s;
      });
      
      // Calculate total stars
      const totalStars = newScenes.reduce((sum, s) => sum + s.stars, 0);
      
      return { ...prev, scenes: newScenes, totalStars };
    });
  };

  const collectItem = (itemId: string) => {
    setGameState(prev => {
      const newCollectibles = prev.collectibles.map(c =>
        c.id === itemId ? { ...c, collected: true } : c
      );
      
      // If this is a star collectible, update the scene's star count
      const collectible = prev.collectibles.find(c => c.id === itemId);
      if (collectible && collectible.type === 'star') {
        const sceneId = collectible.scene;
        const newScenes = prev.scenes.map(scene => {
          if (scene.id === sceneId) {
            // Award third star for collecting the star item (if both games completed)
            const completedGames = scene.miniGames.filter(g => g.completed).length;
            if (completedGames === 2) {
              return { ...scene, stars: 3 };
            }
          }
          return scene;
        });
        
        return { 
          ...prev, 
          collectibles: newCollectibles,
          scenes: newScenes,
          totalStars: newScenes.reduce((sum, s) => sum + s.stars, 0)
        };
      }
      
      return { ...prev, collectibles: newCollectibles };
    });
  };

  const toggleSound = () => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleMusic = () => {
    setGameState(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
    localStorage.removeItem('alliesBusAdventure');
  };

  const saveGame = () => {
    localStorage.setItem('alliesBusAdventure', JSON.stringify(gameState));
  };

  const loadGame = () => {
    const saved = localStorage.getItem('alliesBusAdventure');
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        setGameState(loaded);
      } catch (e) {
        console.error('Failed to load game:', e);
      }
    }
  };

  return (
    <GameContext.Provider value={{
      gameState,
      setCurrentScene,
      unlockScene,
      completeMinigame,
      collectItem,
      toggleSound,
      toggleMusic,
      resetGame,
      saveGame,
      loadGame
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};