import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  vr: number;
  opacity: number;
}

interface ConfettiProps {
  origin: { x: number; y: number } | null;
  colors?: string[];
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({
  origin,
  colors = ['#1a8cff', '#8b7bff', '#2ed3b7', '#ff6fa8', '#ffffff', '#f5b84b'],
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!origin) return;

    const count = 36;
    const initialParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      initialParticles.push({
        id: i,
        x: origin.x,
        y: origin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[i % colors.length],
        size: 5 + Math.random() * 4,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 18,
        opacity: 1,
      });
    }

    setParticles(initialParticles);

    let animationFrameId: number;
    let startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      if (elapsed > 1100) {
        setParticles([]);
        if (onComplete) onComplete();
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3, // gravity
          rotation: p.rotation + p.vr,
          opacity: Math.max(0, 1 - elapsed / 1000),
        }))
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [origin]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size * 0.7}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            boxShadow: `0 0 6px ${p.color}80`,
          }}
        />
      ))}
    </div>
  );
};
