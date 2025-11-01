import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Confetti() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    rotation: Math.random() * 360,
    color: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${particle.x}%`,
            backgroundColor: particle.color,
          }}
          initial={{
            y: particle.y,
            rotate: particle.rotation,
            opacity: 1,
          }}
          animate={{
            y: '110vh',
            rotate: particle.rotation + 360,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
