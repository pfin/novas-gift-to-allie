'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/gameContext';
import { getSoundManager } from '@/lib/sounds';

export default function BusStopScene() {
  const { gameState, completeMinigame, collectItem } = useGame();
  const soundManager = getSoundManager();
  
  const [kidCount, setKidCount] = useState(0);
  const [wheelSpins, setWheelSpins] = useState(0);
  const [busMoving, setBusMoving] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [oscarPets, setOscarPets] = useState(0);
  const [starVisible, setStarVisible] = useState(false);

  const currentScene = gameState.scenes.find(s => s.id === 'busStop');
  const star = gameState.collectibles.find(c => c.id === 'star1');
  const sticker = gameState.collectibles.find(c => c.id === 'sticker1');

  useEffect(() => {
    // Check for mini-game completion
    if (kidCount >= 5 && !currentScene?.miniGames[0].completed) {
      soundManager.playSuccess();
      completeMinigame('busStop', 'countKids', kidCount);
      setShowStar(true);
      setTimeout(() => {
        collectItem('star1');
        setShowStar(false);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidCount]);

  useEffect(() => {
    if (wheelSpins >= 3 && !currentScene?.miniGames[1].completed) {
      soundManager.playSuccess();
      completeMinigame('busStop', 'wheelSpin', wheelSpins);
      setShowSticker(true);
      setTimeout(() => {
        collectItem('sticker1');
        setShowSticker(false);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheelSpins]);

  const handleAddKid = () => {
    if (kidCount < 5) {
      soundManager.playPop();
      setKidCount(prev => prev + 1);
    }
  };

  const handleBusClick = () => {
    soundManager.playHorn();
    setBusMoving(!busMoving);
    if (!busMoving) {
      setWheelSpins(prev => prev + 1);
      soundManager.playEngine(true);
    } else {
      soundManager.playEngine(false);
    }
  };

  const kidEmojis = ['👧', '👦', '👶', '🧒', '👧🏽'];
  const [wheelRotation, setWheelRotation] = useState(0);
  const [catPosition, setCatPosition] = useState(10);
  const [oscarSays, setOscarSays] = useState('');
  const [showOscarMessage, setShowOscarMessage] = useState(false);
  const [butterflies, setButterflies] = useState<{id: number, x: number, y: number}[]>([]);
  const [butterflyMessages, setButterflyMessages] = useState<{[key: number]: string}>({});

  // Initialize and animate butterflies
  useEffect(() => {
    const newButterflies = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 10
    }));
    setButterflies(newButterflies);

    const butterflyInterval = setInterval(() => {
      setButterflies(prev => prev.map(b => ({
        ...b,
        x: (b.x + Math.random() * 2 - 1 + 100) % 100,
        y: b.y + Math.sin(Date.now() / 1000 + b.id) * 0.5
      })));
    }, 100);

    // Animate Oscar
    const catInterval = setInterval(() => {
      setCatPosition(prev => (prev + 0.5) % 100);
    }, 100);

    return () => {
      clearInterval(butterflyInterval);
      clearInterval(catInterval);
    };
  }, []);

  // Animate wheels when bus is moving
  useEffect(() => {
    if (busMoving) {
      const interval = setInterval(() => {
        setWheelRotation(prev => prev + 10);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [busMoving]);

  const handleOscarClick = () => {
    setOscarPets(prev => prev + 1);
    
    const messages = [
      'Meow! Hi Allie! 🐱',
      'Purr purr purr... 💕',
      'Let me on the bus! 🚌',
      'I love you Allie! 😻',
      'Time for treats? 🐟',
      'Chase the butterflies! 🦋'
    ];
    
    // Special message on 5th pet
    if (oscarPets === 4) {
      setOscarSays('You found me! ⭐');
      setStarVisible(true);
      soundManager.playSuccess();
      if (!star?.collected) {
        setTimeout(() => collectItem('star1'), 500);
      }
    } else {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setOscarSays(randomMessage);
    }
    
    setShowOscarMessage(true);
    soundManager.playCat();
    setTimeout(() => setShowOscarMessage(false), 3000);
  };

  const handleButterflyClick = (id: number) => {
    const messages = [
      '✨ Flutter flutter! ✨',
      '🌸 So pretty! 🌸',
      '🌈 Wheee! 🌈',
      '💖 Catch me! 💖',
      '🌟 Magic wings! 🌟'
    ];
    
    soundManager.playSparkle();
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setButterflyMessages({ ...butterflyMessages, [id]: randomMessage });
    
    setTimeout(() => {
      setButterflyMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[id];
        return newMessages;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-200 to-yellow-200 relative overflow-hidden">
      {/* Sun */}
      <div className="absolute top-8 right-8 w-24 h-24 bg-yellow-400 rounded-full animate-pulse shadow-lg">
        <div className="absolute inset-2 bg-yellow-300 rounded-full"></div>
      </div>

      {/* Butterflies */}
      {butterflies.map((butterfly) => (
        <div
          key={butterfly.id}
          className="absolute text-3xl transition-all duration-1000 cursor-pointer hover:scale-150"
          style={{
            left: `${butterfly.x}%`,
            top: `${butterfly.y}%`,
            transform: `rotate(${Math.sin(Date.now() / 1000 + butterfly.id) * 20}deg)`
          }}
          onClick={() => handleButterflyClick(butterfly.id)}
        >
          🦋
          {butterflyMessages[butterfly.id] && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-pink-100 border-2 border-pink-300 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap animate-bounce">
              {butterflyMessages[butterfly.id]}
            </div>
          )}
        </div>
      ))}

      {/* Bus Stop Sign */}
      <div className="absolute top-32 left-16">
        <div className="w-4 h-64 bg-gray-700"></div>
        <div className="absolute -top-4 -left-8 w-20 h-20 bg-red-600 rounded-lg border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-white font-bold text-2xl">BUS</span>
        </div>
        <div className="absolute top-20 -left-12 w-28 h-16 bg-blue-600 rounded shadow-lg flex items-center justify-center">
          <span className="text-white font-bold">STOP</span>
        </div>
      </div>

      {/* Waiting Area - Show all 5 kids waiting initially */}
      <div className="absolute bottom-48 left-32 flex gap-4">
        {kidEmojis.map((emoji, i) => (
          <div
            key={i}
            className={`text-5xl transition-all duration-500 ${
              i < kidCount ? 'opacity-0 scale-0' : 'animate-bounce'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {emoji}
          </div>
        ))}
        {kidCount >= 5 && (
          <div className="text-green-600 text-xl font-bold">
            All kids are on the bus! 🎉
          </div>
        )}
      </div>

      {/* Bus */}
      <div
        className={`absolute bottom-48 right-32 cursor-pointer transition-all duration-1000 ${
          busMoving ? 'translate-x-32' : ''
        }`}
        onClick={handleBusClick}
      >
        <div className="relative">
          {/* Bus body */}
          <div className="w-80 h-40 bg-yellow-500 rounded-t-2xl shadow-2xl">
            {/* Windows - 5 windows total */}
            <div className="absolute top-4 left-4 right-20 h-20 flex gap-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="flex-1 bg-blue-300 rounded-lg border-4 border-gray-700 flex items-center justify-center"
                >
                  {i < kidCount && (
                    <div className="text-3xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                      {kidEmojis[i]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Driver window */}
            <div className="absolute top-4 right-4 w-16 h-24 bg-blue-300 rounded-lg border-4 border-gray-700 flex items-center justify-center">
              <div className="text-3xl">👨</div>
            </div>
          </div>
          
          {/* Wheels */}
          <div className="absolute -bottom-6 left-12 w-12 h-12 bg-gray-800 rounded-full">
            <div
              className="w-full h-full rounded-full border-4 border-gray-600 flex items-center justify-center"
              style={{
                transform: `rotate(${wheelRotation}deg)`
              }}
            >
              <div className="w-8 h-0.5 bg-white absolute"></div>
              <div className="w-0.5 h-8 bg-white absolute"></div>
            </div>
          </div>
          <div className="absolute -bottom-6 right-12 w-12 h-12 bg-gray-800 rounded-full">
            <div
              className="w-full h-full rounded-full border-4 border-gray-600 flex items-center justify-center"
              style={{
                transform: `rotate(${wheelRotation}deg)`
              }}
            >
              <div className="w-8 h-0.5 bg-white absolute"></div>
              <div className="w-0.5 h-8 bg-white absolute"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gray-700">
        <div className="absolute top-24 left-0 right-0 h-2 bg-yellow-400"></div>
      </div>

      {/* Oscar the Cat */}
      <div 
        className="absolute bottom-48 text-5xl transition-all duration-100 cursor-pointer"
        style={{ left: `${catPosition}%` }}
        onClick={handleOscarClick}
      >
        <div className="relative">
          <div className="animate-bounce hover:scale-110 transition-transform">🐈</div>
          <p className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-sm font-bold">
            Oscar!
          </p>
          {showOscarMessage && (
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-400 px-4 py-2 rounded-2xl text-base font-medium whitespace-nowrap animate-bounce">
              {oscarSays}
            </div>
          )}
        </div>
      </div>

      {/* Game UI */}
      <div className="absolute top-8 left-8 bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Bus Stop Games!</h2>
        
        {/* Star Progress */}
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm font-bold mb-2">Stars to earn:</p>
          <div className="flex gap-4 text-sm">
            <span className={currentScene?.miniGames[0].completed ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Add 5 kids
            </span>
            <span className={currentScene?.miniGames[1].completed ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Spin wheels 3x
            </span>
            <span className={oscarPets >= 5 ? 'text-green-600' : 'text-gray-600'}>
              ⭐ Pet Oscar 5 times
            </span>
          </div>
        </div>
        
        {/* Count Kids Game */}
        <div className="mb-4">
          <p className="text-xl mb-2">
            Kids waiting: <span className="font-bold text-3xl text-blue-600">{kidCount}/5</span>
          </p>
          <button
            onClick={handleAddKid}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full text-xl active:scale-95"
            disabled={kidCount >= 5}
          >
            Add Kid! 👶
          </button>
          {currentScene?.miniGames[0].completed && (
            <span className="ml-4 text-green-600 font-bold">✓ Complete!</span>
          )}
        </div>

        {/* Wheel Spin Game */}
        <div>
          <p className="text-xl mb-2">
            Wheel spins: <span className="font-bold text-3xl text-green-600">{wheelSpins}/3</span>
          </p>
          <p className="text-gray-600">Click the bus to spin wheels!</p>
          {currentScene?.miniGames[1].completed && (
            <span className="ml-4 text-green-600 font-bold">✓ Complete!</span>
          )}
        </div>
      </div>

      {/* Collectible Notifications */}
      {showStar && !star?.collected && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-yellow-100 rounded-3xl p-8 shadow-2xl animate-bounce">
            <div className="text-8xl mb-4">⭐</div>
            <p className="text-2xl font-bold">You got a star!</p>
          </div>
        </div>
      )}

      {showSticker && !sticker?.collected && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-pink-100 rounded-3xl p-8 shadow-2xl animate-bounce">
            <div className="text-8xl mb-4">🦋</div>
            <p className="text-2xl font-bold">You got a butterfly sticker!</p>
          </div>
        </div>
      )}
      
      {/* Visible star when earned */}
      {starVisible && !star?.collected && (
        <div className="absolute top-32 right-32 text-6xl animate-bounce">
          ⭐
        </div>
      )}
      
      {/* Oscar pet counter */}
      {oscarPets > 0 && oscarPets < 5 && (
        <div className="absolute bottom-64 right-16 bg-white rounded-full px-3 py-1 shadow-lg">
          <span className="text-sm font-bold">Oscar pets: {oscarPets}/5</span>
        </div>
      )}
    </div>
  );
}