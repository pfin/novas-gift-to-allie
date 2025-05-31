'use client';

import { useState } from 'react';
import WheelsOnTheBus from '@/components/WheelsOnTheBus';

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-blue-900 mb-8 animate-pulse">
            🌟 Allie&apos;s Bus Adventure 🌟
          </h1>
          <button
            onClick={() => setShowApp(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-6 px-12 rounded-full text-3xl shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
          >
            🚌 Let&apos;s Play!
          </button>
          <p className="mt-8 text-blue-700 text-xl">
            Touch to start the bus journey!
          </p>
        </div>
      </div>
    );
  }

  return <WheelsOnTheBus />;
}
