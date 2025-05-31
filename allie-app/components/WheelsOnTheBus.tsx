'use client';

import { useState, useEffect } from 'react';

export default function WheelsOnTheBus() {
  const [wheelRotation, setWheelRotation] = useState(0);
  const [busPosition, setBusPosition] = useState(0);
  const [kidCount, setKidCount] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isMoving) {
      const interval = setInterval(() => {
        setWheelRotation(prev => prev + 10);
        setBusPosition(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isMoving]);

  const handleBusClick = () => {
    setIsMoving(!isMoving);
  };

  const handleKidClick = () => {
    if (kidCount < 5) {
      setKidCount(prev => prev + 1);
      if (kidCount === 4) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      setKidCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 overflow-hidden relative">
      {/* Sky and Clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-24 h-16 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-20 right-32 w-32 h-20 bg-white rounded-full opacity-70"></div>
        <div className="absolute top-16 left-1/2 w-28 h-18 bg-white rounded-full opacity-75"></div>
      </div>

      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gray-700">
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-yellow-400"></div>
      </div>

      {/* Bus Container */}
      <div 
        className="absolute bottom-48 transition-all duration-100 cursor-pointer"
        style={{ left: `${busPosition}%` }}
        onClick={handleBusClick}
      >
        {/* Bus Body */}
        <div className="relative">
          <div className="w-80 h-48 bg-yellow-500 rounded-t-3xl relative shadow-2xl">
            {/* Windows */}
            <div className="absolute top-4 left-4 right-4 h-24 flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 bg-blue-300 rounded-lg border-4 border-gray-700">
                  {i < kidCount && (
                    <div className="h-full flex items-center justify-center text-4xl">
                      👦
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Driver window */}
            <div className="absolute top-4 right-8 w-16 h-24 bg-blue-300 rounded-lg border-4 border-gray-700">
              <div className="h-full flex items-center justify-center text-3xl">
                👨
              </div>
            </div>
            {/* Door */}
            <div className="absolute bottom-0 left-8 w-16 h-32 bg-gray-700 rounded-t-lg"></div>
          </div>
          
          {/* Wheels */}
          <div className="absolute -bottom-8 left-12 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
            <div 
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <div className="w-8 h-1 bg-white"></div>
              <div className="w-1 h-8 bg-white absolute"></div>
            </div>
          </div>
          <div className="absolute -bottom-8 right-12 w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-lg">
            <div 
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <div className="w-8 h-1 bg-white"></div>
              <div className="w-1 h-8 bg-white absolute"></div>
            </div>
          </div>
        </div>
      </div>

      {/* UI Controls */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Allie&apos;s Bus 🚌</h2>
          <p className="text-xl text-gray-600 mb-2">
            Kids on the bus: <span className="font-bold text-3xl text-blue-600">{kidCount}</span>
          </p>
          <button
            onClick={handleKidClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-xl mt-2 active:scale-95 transition-transform"
          >
            Add a Kid! 👶
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
          <p className="text-xl text-gray-700 font-medium mb-2">
            {isMoving ? '🎵 The wheels go round and round! 🎵' : 'Touch the bus to start!'}
          </p>
          <div className="text-5xl mt-2">
            {isMoving ? '🚌💨' : '🚌'}
          </div>
        </div>
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-3xl p-8 shadow-2xl animate-bounce">
            <h3 className="text-4xl font-bold text-center text-purple-600">
              🎉 Bus is Full! 🎉
            </h3>
            <p className="text-2xl text-center mt-4">Great counting, Allie!</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-4 shadow-lg">
        <p className="text-lg text-gray-700">
          <span className="font-bold">Touch</span> the bus to make it go! 🚌
        </p>
      </div>
    </div>
  );
}