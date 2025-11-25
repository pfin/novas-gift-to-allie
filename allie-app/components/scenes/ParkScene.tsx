'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/gameContext';
import { getSoundManager } from '@/lib/sounds';

interface Butterfly {
  id: number;
  x: number;
  y: number;
  caught: boolean;
  color: string;
}

interface Flower {
  id: number;
  x: number;
  type: string;
  picked: boolean;
}

export default function ParkScene() {
  const { gameState, completeMinigame, collectItem } = useGame();
  const soundManager = getSoundManager();
  
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [butterfliesCaught, setButterfliesCaught] = useState(0);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [flowersPicked, setFlowersPicked] = useState(0);
  const [showNet, setShowNet] = useState(false);
  const [netPosition, setNetPosition] = useState({ x: 0, y: 0 });
  const [showPlaygroundScore, setShowPlaygroundScore] = useState(0);
  
  const currentScene = gameState.scenes.find(s => s.id === 'park');
  const star = gameState.collectibles.find(c => c.id === 'star2');
  const sticker = gameState.collectibles.find(c => c.id === 'sticker2');

  // Initialize butterflies and flowers
  useEffect(() => {
    const butterflyColors = ['🦋', '🦋', '🦋', '🦋', '🦋'];
    const newButterflies = butterflyColors.map((color, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 10,
      caught: false,
      color
    }));
    setButterflies(newButterflies);

    const flowerTypes = ['🌸', '🌺', '🌻', '🌹', '🌷'];
    const newFlowers = flowerTypes.map((type, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      type,
      picked: false
    }));
    setFlowers(newFlowers);
  }, []);

  // Animate butterflies
  useEffect(() => {
    const interval = setInterval(() => {
      setButterflies(prev => prev.map(b => {
        if (b.caught) return b;
        return {
          ...b,
          x: (b.x + (Math.random() - 0.5) * 5 + 100) % 100,
          y: (b.y + Math.sin(Date.now() / 1000 + b.id) * 2 + 50) % 50
        };
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Check for completion
  useEffect(() => {
    if (butterfliesCaught >= 5 && !currentScene?.miniGames[0].completed) {
      soundManager.playSuccess();
      completeMinigame('park', 'butterflyChase', butterfliesCaught);
      if (!star?.collected) {
        collectItem('star2');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [butterfliesCaught]);

  useEffect(() => {
    if (flowersPicked >= 5 && !currentScene?.miniGames[1].completed) {
      soundManager.playSuccess();
      completeMinigame('park', 'flowerPick', flowersPicked);
      if (!sticker?.collected) {
        collectItem('sticker2');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowersPicked]);

  const handleButterflyClick = (id: number) => {
    const butterfly = butterflies.find(b => b.id === id);
    if (butterfly && !butterfly.caught) {
      soundManager.playSparkle();
      setButterflies(prev => prev.map(b =>
        b.id === id ? { ...b, caught: true } : b
      ));
      setButterfliesCaught(prev => prev + 1);
      
      // Show net animation
      setNetPosition({ x: butterfly.x, y: butterfly.y });
      setShowNet(true);
      setTimeout(() => setShowNet(false), 500);
    }
  };

  const handleFlowerClick = (id: number) => {
    const flower = flowers.find(f => f.id === id);
    if (flower && !flower.picked) {
      soundManager.playPop();
      setFlowers(prev => prev.map(f =>
        f.id === id ? { ...f, picked: true } : f
      ));
      setFlowersPicked(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-green-300 relative overflow-hidden">
      {/* Sky and clouds */}
      <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-80"></div>
      <div className="absolute top-20 right-20 w-40 h-24 bg-white rounded-full opacity-70"></div>

      {/* Trees */}
      <div className="absolute bottom-32 left-10 text-8xl">🌳</div>
      <div className="absolute bottom-36 right-20 text-7xl">🌲</div>
      <div className="absolute bottom-40 left-1/3 text-9xl">🌳</div>

      {/* Butterflies */}
      {butterflies.map(butterfly => (
        <div
          key={butterfly.id}
          className={`absolute text-4xl cursor-pointer transition-all duration-300 ${
            butterfly.caught ? 'opacity-0 scale-0' : 'hover:scale-125'
          }`}
          style={{
            left: `${butterfly.x}%`,
            top: `${butterfly.y}%`,
            transform: `rotate(${Math.sin(Date.now() / 500 + butterfly.id) * 20}deg)`
          }}
          onClick={() => handleButterflyClick(butterfly.id)}
        >
          {butterfly.color}
        </div>
      ))}

      {/* Net animation */}
      {showNet && (
        <div
          className="absolute text-5xl animate-ping"
          style={{
            left: `${netPosition.x}%`,
            top: `${netPosition.y}%`
          }}
        >
          🥅
        </div>
      )}

      {/* Grass and flowers */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-green-400">
        {flowers.map(flower => (
          <div
            key={flower.id}
            className={`absolute bottom-8 text-5xl cursor-pointer transition-all ${
              flower.picked ? 'opacity-0 scale-0' : 'hover:scale-110'
            }`}
            style={{ left: `${flower.x}%` }}
            onClick={() => handleFlowerClick(flower.id)}
          >
            {flower.type}
          </div>
        ))}
      </div>

      {/* Playground equipment - interactive */}
      <div 
        className="absolute bottom-32 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => {
          if (showPlaygroundScore < 3) {
            soundManager.playSuccess();
            setShowPlaygroundScore(prev => prev + 1);
            if (showPlaygroundScore === 2 && !star?.collected) {
              collectItem('star2');
            }
          }
        }}
      >
        <div className="text-6xl">🛝</div>
        {showPlaygroundScore > 0 && showPlaygroundScore < 3 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-100 px-2 py-1 rounded-full">
            <span className="text-sm font-bold">Plays: {showPlaygroundScore}/3</span>
          </div>
        )}
      </div>

      {/* Game UI */}
      <div className="absolute top-8 left-8 bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Park Games! 🌳</h2>
        
        {/* Star Progress */}
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-bold mb-2">Stars to earn:</p>
          <div className="flex gap-4 text-sm">
            <span className={currentScene?.miniGames[0].completed ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Catch 5 butterflies
            </span>
            <span className={currentScene?.miniGames[1].completed ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Pick 5 flowers
            </span>
            <span className={showPlaygroundScore >= 3 ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Play on playground 3 times
            </span>
          </div>
        </div>
        
        {/* Butterfly Chase */}
        <div className="mb-4">
          <p className="text-xl mb-2">
            Butterflies caught: <span className="font-bold text-3xl text-purple-600">{butterfliesCaught}/5</span>
          </p>
          <p className="text-gray-600">Tap the butterflies!</p>
          {currentScene?.miniGames[0].completed && (
            <span className="ml-4 text-green-600 font-bold">✓ Complete!</span>
          )}
        </div>

        {/* Flower Pick */}
        <div>
          <p className="text-xl mb-2">
            Flowers picked: <span className="font-bold text-3xl text-pink-600">{flowersPicked}/5</span>
          </p>
          <p className="text-gray-600">Tap the flowers!</p>
          {currentScene?.miniGames[1].completed && (
            <span className="ml-4 text-green-600 font-bold">✓ Complete!</span>
          )}
        </div>
      </div>

      {/* Oscar the cat appears! */}
      <div className="absolute bottom-32 right-32 text-5xl animate-bounce">
        <div className="relative">
          <div>🐈</div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-sm font-bold whitespace-nowrap">
            Hi Allie!
          </div>
        </div>
      </div>

      {/* Basket for collected items */}
      <div className="absolute bottom-8 right-8 bg-yellow-100 rounded-2xl p-4 shadow-lg">
        <div className="text-4xl mb-2">🧺</div>
        <div className="flex gap-2">
          {Array.from({ length: flowersPicked }).map((_, i) => (
            <span key={i} className="text-2xl">🌸</span>
          ))}
        </div>
      </div>
    </div>
  );
}