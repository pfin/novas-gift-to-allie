'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/gameContext';
import { getSoundManager } from '@/lib/sounds';

interface Shell {
  id: number;
  type: string;
  x: number;
  y: number;
  collected: boolean;
}

interface Crab {
  id: number;
  x: number;
  direction: number;
}

interface Seagull {
  id: number;
  x: number;
  y: number;
}

export default function BeachScene() {
  const { gameState, completeMinigame, collectItem } = useGame();
  const soundManager = getSoundManager();
  
  const [sandcastles, setSandcastles] = useState(0);
  const [shells, setShells] = useState<Shell[]>([]);
  const [shellsCollected, setShellsCollected] = useState(0);
  const [crabs, setCrabs] = useState<Crab[]>([]);
  const [seagulls, setSeagulls] = useState<Seagull[]>([]);
  const [wavePosition, setWavePosition] = useState(0);
  const [showSandcastle, setShowSandcastle] = useState(false);
  const [bucketPosition, setBucketPosition] = useState({ x: 50, y: 70 });
  const [beachBallBounces, setBeachBallBounces] = useState(0);
  
  const currentScene = gameState.scenes.find(s => s.id === 'beach');
  const star = gameState.collectibles.find(c => c.id === 'star4');
  const sticker = gameState.collectibles.find(c => c.id === 'sticker4');

  // Initialize beach creatures and shells
  useEffect(() => {
    // Create shells
    const shellTypes = ['🐚', '🦪', '🐠', '⭐', '🦀'];
    const newShells = shellTypes.map((type, i) => ({
      id: i,
      type,
      x: Math.random() * 80 + 10,
      y: Math.random() * 20 + 60,
      collected: false
    }));
    setShells(newShells);

    // Create crabs
    const newCrabs = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: Math.random() * 90,
      direction: Math.random() > 0.5 ? 1 : -1
    }));
    setCrabs(newCrabs);

    // Create seagulls
    const newSeagulls = Array.from({ length: 2 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 30 + 10
    }));
    setSeagulls(newSeagulls);
  }, []);

  // Animate waves
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWavePosition(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(waveInterval);
  }, []);

  // Animate crabs
  useEffect(() => {
    const crabInterval = setInterval(() => {
      setCrabs(prev => prev.map(crab => ({
        ...crab,
        x: crab.x + crab.direction * 0.5,
        direction: (crab.x <= 0 || crab.x >= 95) ? -crab.direction : crab.direction
      })));
    }, 100);
    return () => clearInterval(crabInterval);
  }, []);

  // Animate seagulls
  useEffect(() => {
    const seagullInterval = setInterval(() => {
      setSeagulls(prev => prev.map(seagull => ({
        ...seagull,
        x: (seagull.x + 0.3) % 110,
        y: seagull.y + Math.sin(Date.now() / 1000 + seagull.id) * 0.5
      })));
    }, 100);
    return () => clearInterval(seagullInterval);
  }, []);

  // Check for mini-game completion
  useEffect(() => {
    if (sandcastles >= 3 && !currentScene?.miniGames[0].completed) {
      soundManager.playSuccess();
      completeMinigame('beach', 'sandcastle', sandcastles);
      if (!star?.collected) {
        collectItem('star4');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandcastles]);

  useEffect(() => {
    if (shellsCollected >= 5 && !currentScene?.miniGames[1].completed) {
      soundManager.playSuccess();
      completeMinigame('beach', 'shellCollect', shellsCollected);
      if (!sticker?.collected) {
        collectItem('sticker4');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shellsCollected]);

  const handleBuildSandcastle = () => {
    if (sandcastles < 3) {
      soundManager.playPop();
      setShowSandcastle(true);
      setSandcastles(prev => prev + 1);
      
      // Animate bucket
      setBucketPosition({ x: Math.random() * 60 + 20, y: 70 });
      
      setTimeout(() => setShowSandcastle(false), 1000);
    }
  };

  const handleShellClick = (id: number) => {
    const shell = shells.find(s => s.id === id);
    if (shell && !shell.collected) {
      soundManager.playSparkle();
      setShells(prev => prev.map(s => 
        s.id === id ? { ...s, collected: true } : s
      ));
      setShellsCollected(prev => prev + 1);
    }
  };

  const handleCrabClick = (id: number) => {
    soundManager.playClick();
    // Make crab scuttle away quickly
    setCrabs(prev => prev.map(c => 
      c.id === id ? { ...c, x: Math.random() * 90, direction: -c.direction * 2 } : c
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-300 relative overflow-hidden">
      {/* Sun */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-yellow-300 rounded-full">
        <div className="absolute inset-4 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>

      {/* Clouds */}
      <div className="absolute top-16 left-20 w-24 h-12 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-24 left-1/2 w-32 h-16 bg-white rounded-full opacity-70"></div>

      {/* Seagulls */}
      {seagulls.map(seagull => (
        <div
          key={seagull.id}
          className="absolute text-3xl"
          style={{
            left: `${seagull.x}%`,
            top: `${seagull.y}%`,
            transform: 'scaleX(-1)'
          }}
        >
          🦅
        </div>
      ))}

      {/* Ocean */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500 to-blue-600">
        {/* Waves */}
        <div 
          className="absolute top-0 left-0 right-0 h-8 bg-blue-400 opacity-50"
          style={{
            transform: `translateX(${Math.sin(wavePosition / 10) * 20}px)`
          }}
        ></div>
        <div 
          className="absolute top-8 left-0 right-0 h-8 bg-blue-300 opacity-40"
          style={{
            transform: `translateX(${Math.sin(wavePosition / 10 + 1) * -20}px)`
          }}
        ></div>
        
        {/* Wave emojis */}
        <div className="absolute top-4 left-0 right-0 flex justify-around text-4xl">
          <span style={{ transform: `translateY(${Math.sin(wavePosition / 10) * 10}px)` }}>🌊</span>
          <span style={{ transform: `translateY(${Math.sin(wavePosition / 10 + 1) * 10}px)` }}>🌊</span>
          <span style={{ transform: `translateY(${Math.sin(wavePosition / 10 + 2) * 10}px)` }}>🌊</span>
        </div>
      </div>

      {/* Beach sand */}
      <div className="absolute bottom-48 left-0 right-0 h-48 bg-gradient-to-b from-yellow-200 to-yellow-300">
        {/* Sandcastles */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-around items-end">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-6xl">
              {i < sandcastles ? '🏰' : ''}
            </div>
          ))}
        </div>

        {/* Shells */}
        {shells.map(shell => (
          <div
            key={shell.id}
            className={`absolute text-3xl cursor-pointer transition-all duration-300 ${
              shell.collected ? 'opacity-0 scale-0' : 'hover:scale-125'
            }`}
            style={{ 
              left: `${shell.x}%`,
              bottom: `${shell.y - 60}%`
            }}
            onClick={() => handleShellClick(shell.id)}
          >
            {shell.type}
          </div>
        ))}

        {/* Crabs */}
        {crabs.map(crab => (
          <div
            key={crab.id}
            className="absolute text-2xl cursor-pointer hover:scale-110 transition-transform"
            style={{ 
              left: `${crab.x}%`,
              bottom: '10%',
              transform: `scaleX(${crab.direction})`
            }}
            onClick={() => handleCrabClick(crab.id)}
          >
            🦀
          </div>
        ))}

        {/* Beach toys */}
        <div 
          className="absolute text-4xl cursor-pointer hover:scale-110 transition-all"
          style={{ left: `${bucketPosition.x}%`, bottom: `${bucketPosition.y - 60}%` }}
          onClick={handleBuildSandcastle}
        >
          🪣
        </div>
        <div className="absolute bottom-4 right-20 text-3xl">🏖️</div>
      </div>

      {/* Game UI */}
      <div className="absolute top-8 left-8 bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Beach Games! 🏖️</h2>
        
        {/* Star Progress */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-bold mb-2">Stars to earn:</p>
          <div className="flex gap-4 text-sm">
            <span className={currentScene?.miniGames[0].completed ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Build 3 castles
            </span>
            <span className={currentScene?.miniGames[1].completed ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Collect 5 shells
            </span>
            <span className={beachBallBounces >= 5 ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Bounce beach ball 5 times
            </span>
          </div>
        </div>
        
        {/* Sandcastle Game */}
        <div className="mb-4">
          <p className="text-xl mb-2">
            Sandcastles built: <span className="font-bold text-3xl text-yellow-600">{sandcastles}/3</span>
          </p>
          <button
            onClick={handleBuildSandcastle}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-full text-xl active:scale-95"
            disabled={sandcastles >= 3}
          >
            Build Castle! 🏰
          </button>
          {currentScene?.miniGames[0].completed && (
            <span className="ml-4 text-green-600 font-bold">✓ Complete!</span>
          )}
        </div>

        {/* Shell Collection */}
        <div>
          <p className="text-xl mb-2">
            Shells collected: <span className="font-bold text-3xl text-blue-600">{shellsCollected}/5</span>
          </p>
          <p className="text-gray-600">Tap the shells on the beach!</p>
          {currentScene?.miniGames[1].completed && (
            <span className="ml-4 text-green-600 font-bold">✓ Complete!</span>
          )}
        </div>
      </div>

      {/* Sandcastle building animation */}
      {showSandcastle && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-9xl animate-bounce">🏰</div>
        </div>
      )}

      {/* Shell basket */}
      <div className="absolute bottom-8 right-8 bg-blue-100 rounded-2xl p-4 shadow-lg">
        <div className="text-4xl mb-2">🧺</div>
        <div className="flex gap-1">
          {Array.from({ length: shellsCollected }).map((_, i) => (
            <span key={i} className="text-2xl">🐚</span>
          ))}
        </div>
      </div>

      {/* Beach ball - interactive */}
      <div 
        className="absolute text-5xl animate-bounce cursor-pointer hover:scale-125 transition-transform"
        style={{ 
          left: '80%',
          bottom: '55%',
          animationDuration: '2s'
        }}
        onClick={() => {
          soundManager.playPop();
          if (beachBallBounces < 5) {
            setBeachBallBounces(prev => prev + 1);
            if (beachBallBounces === 4 && !star?.collected) {
              collectItem('star4');
            }
          }
        }}
      >
        ⚪
        {beachBallBounces > 0 && beachBallBounces < 5 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-100 px-2 py-1 rounded-full">
            <span className="text-sm font-bold">Bounces: {beachBallBounces}/5</span>
          </div>
        )}
      </div>

      {/* Palm tree */}
      <div className="absolute bottom-48 left-10 text-8xl">🌴</div>
    </div>
  );
}