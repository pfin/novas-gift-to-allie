'use client';

import { useGame, SceneType, GameScene } from '@/lib/gameContext';
import { getSoundManager } from '@/lib/sounds';
import Link from 'next/link';

export default function SceneMap() {
  const { gameState, setCurrentScene } = useGame();
  const soundManager = getSoundManager();

  const handleSceneClick = (sceneId: SceneType) => {
    const scene = gameState.scenes.find(s => s.id === sceneId);
    if (scene?.unlocked) {
      soundManager.playWhoosh();
      setCurrentScene(sceneId);
    } else {
      soundManager.playPop();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 to-green-300 overflow-hidden">
      {/* Animated clouds */}
      <div className="absolute top-0 left-0 w-full h-32">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>

      {/* Title */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-bounce">
          🚌 Allie&apos;s Bus Adventure Map 🗺️
        </h1>
      </div>

      {/* Map Path */}
      <div className="relative w-full h-full max-w-6xl mx-auto p-8">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600">
          {/* Dotted path connecting scenes */}
          <path
            d="M 150 500 Q 300 400 500 450 T 850 300 Q 700 200 500 150 T 150 100"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeDasharray="20 10"
            opacity="0.5"
          />
        </svg>

        {/* Scene Locations */}
        <div className="absolute" style={{ left: '10%', bottom: '20%' }}>
          <SceneNode scene={gameState.scenes[0]} onClick={handleSceneClick} />
        </div>
        
        <div className="absolute" style={{ left: '35%', bottom: '35%' }}>
          <SceneNode scene={gameState.scenes[1]} onClick={handleSceneClick} />
        </div>
        
        <div className="absolute" style={{ left: '60%', top: '35%' }}>
          <SceneNode scene={gameState.scenes[2]} onClick={handleSceneClick} />
        </div>
        
        <div className="absolute" style={{ right: '15%', top: '45%' }}>
          <SceneNode scene={gameState.scenes[3]} onClick={handleSceneClick} />
        </div>
        
        <div className="absolute" style={{ left: '20%', top: '15%' }}>
          <SceneNode scene={gameState.scenes[4]} onClick={handleSceneClick} />
        </div>
      </div>

      {/* Books button */}
      <Link
        href="/books"
        onClick={() => soundManager.playSuccess()}
        className="fixed top-8 right-8 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl p-4 shadow-xl transform hover:scale-110 transition-all duration-200 active:scale-95 z-50 flex items-center gap-2"
        aria-label="Go to Library"
      >
        <span className="text-3xl">📚</span>
        <span className="hidden sm:inline font-bold text-lg">Library</span>
      </Link>

      {/* Progress Bar */}
      <div className="fixed bottom-8 left-8 right-8 bg-white rounded-full p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">Total Stars: {gameState.totalStars} ⭐</span>
          <div className="flex gap-2">
            {gameState.collectibles.filter(c => c.collected).map(c => (
              <span key={c.id} className="text-2xl">{c.icon}</span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cloud {
          position: absolute;
          background: white;
          border-radius: 100px;
          opacity: 0.8;
        }
        
        .cloud::before,
        .cloud::after {
          content: '';
          position: absolute;
          background: white;
          border-radius: 100px;
        }
        
        .cloud-1 {
          width: 100px;
          height: 40px;
          top: 20px;
          animation: float 20s infinite;
        }
        
        .cloud-1::before {
          width: 50px;
          height: 50px;
          top: -25px;
          left: 10px;
        }
        
        .cloud-1::after {
          width: 60px;
          height: 40px;
          top: -15px;
          right: 10px;
        }
        
        .cloud-2 {
          width: 80px;
          height: 35px;
          top: 60px;
          animation: float 25s infinite reverse;
        }
        
        .cloud-2::before {
          width: 60px;
          height: 40px;
          top: -20px;
          left: 15px;
        }
        
        .cloud-3 {
          width: 120px;
          height: 45px;
          top: 40px;
          animation: float 30s infinite;
        }
        
        @keyframes float {
          from { transform: translateX(-200px); }
          to { transform: translateX(calc(100vw + 200px)); }
        }
      `}</style>
    </div>
  );
}

interface SceneNodeProps {
  scene: GameScene;
  onClick: (id: SceneType) => void;
}

function SceneNode({ scene, onClick }: SceneNodeProps) {
  const isLocked = !scene.unlocked;
  
  return (
    <div
      onClick={() => onClick(scene.id)}
      className={`
        relative cursor-pointer transform transition-all duration-300
        ${isLocked ? 'scale-90 grayscale' : 'hover:scale-110 animate-pulse'}
      `}
    >
      {/* Scene bubble */}
      <div className={`
        w-32 h-32 rounded-full flex flex-col items-center justify-center
        shadow-xl border-4 transition-all
        ${isLocked 
          ? 'bg-gray-400 border-gray-500' 
          : 'bg-white border-yellow-400 hover:border-yellow-500'
        }
      `}>
        <div className="text-5xl mb-1">{isLocked ? '🔒' : scene.icon}</div>
        <div className="text-sm font-bold text-center px-2">
          {scene.name}
        </div>
      </div>
      
      {/* Stars */}
      {!isLocked && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[1, 2, 3].map(star => (
            <span
              key={star}
              className={`text-2xl ${star <= scene.stars ? '' : 'opacity-30'}`}
            >
              ⭐
            </span>
          ))}
        </div>
      )}
      
      {/* Sparkle effect for unlocked scenes */}
      {!isLocked && scene.stars > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">✨</div>
          <div className="sparkle sparkle-3">✨</div>
        </div>
      )}
      
      <style jsx>{`
        .sparkle {
          position: absolute;
          animation: sparkle 2s infinite;
        }
        
        .sparkle-1 {
          top: -10px;
          left: 0;
          animation-delay: 0s;
        }
        
        .sparkle-2 {
          top: 0;
          right: -10px;
          animation-delay: 0.7s;
        }
        
        .sparkle-3 {
          bottom: -10px;
          left: 50%;
          animation-delay: 1.4s;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}