'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  duration: number;
}

interface ParticlesProps {
  trigger: boolean;
  emojis?: string[];
  count?: number;
  origin?: { x: number; y: number };
}

export default function Particles({ 
  trigger, 
  emojis = ['✨', '⭐', '🌟', '💫'], 
  count = 10,
  origin = { x: 50, y: 50 }
}: ParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: origin.x + (Math.random() - 0.5) * 20,
          y: origin.y,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          duration: 1 + Math.random() * 2
        });
      }
      setParticles(prev => [...prev, ...newParticles]);

      // Clean up old particles
      const cleanup = setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
      }, 3000);

      return () => clearTimeout(cleanup);
    }
  }, [trigger, count, origin.x, origin.y, emojis]);

  return (
    <>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none text-2xl"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `particle-rise ${particle.duration}s ease-out forwards`
          }}
        >
          {particle.emoji}
        </div>
      ))}
      <style jsx>{`
        @keyframes particle-rise {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-50px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}