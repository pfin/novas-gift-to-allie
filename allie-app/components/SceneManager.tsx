'use client';

import { useGame } from '@/lib/gameContext';
import SceneMap from './SceneMap';
import BusStopScene from './scenes/BusStopScene';
import ParkScene from './scenes/ParkScene';
import BeachScene from './scenes/BeachScene';
import { getSoundManager } from '@/lib/sounds';

export default function SceneManager() {
  const { gameState, setCurrentScene } = useGame();
  const soundManager = getSoundManager();

  const handleBackToMap = () => {
    soundManager.playClick();
    setCurrentScene('map'); // Go back to map view
  };

  // Show map if no specific scene is selected or if map is selected
  if (!gameState.currentScene || gameState.currentScene === 'map') {
    return <SceneMap />;
  }

  // Render the appropriate scene
  const renderScene = () => {
    switch (gameState.currentScene) {
      case 'busStop':
        return <BusStopScene />;
      case 'park':
        return <ParkScene />;
      case 'zoo':
        return <ZooScenePlaceholder />;
      case 'beach':
        return <BeachScene />;
      case 'home':
        return <HomeScenePlaceholder />;
      default:
        return <SceneMap />;
    }
  };

  return (
    <div className="relative">
      {renderScene()}
      
      {/* Navigation buttons */}
      <button
        onClick={handleBackToMap}
        className="fixed top-8 right-8 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-50"
        title="Back to Map"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      {/* Sound toggle */}
      <button
        onClick={() => {
          soundManager.setEnabled(!gameState.soundEnabled);
          soundManager.playClick();
        }}
        className="fixed bottom-8 right-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-50"
        title="Toggle Sound"
      >
        {gameState.soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
}

// Placeholder components for scenes not yet implemented
function ZooScenePlaceholder() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-300 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl mb-4">🦁</div>
        <h1 className="text-5xl font-bold text-white">Zoo - Coming Soon!</h1>
        <p className="text-2xl text-white mt-4">Help feed the animals and learn their sounds!</p>
      </div>
    </div>
  );
}

function HomeScenePlaceholder() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-300 to-pink-300 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl mb-4">🏠</div>
        <h1 className="text-5xl font-bold text-white">Home - Coming Soon!</h1>
        <p className="text-2xl text-white mt-4">Clean up toys and get ready for bed!</p>
      </div>
    </div>
  );
}