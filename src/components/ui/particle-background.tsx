import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

interface ParticleBackgroundProps {
  count?: number;
  color?: string;
  className?: string;
}

export function ParticleBackground({
  count = 30,
  color = "#000f9f",
  className = "",
}: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 6 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        delay: Math.random() * 5,
        duration: Math.random() * 20 + 10,
      });
    }
    
    setParticles(newParticles);
  }, [count, dimensions]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity: particle.opacity,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            x: [
              particle.x,
              particle.x + (Math.random() * 60 - 30),
              particle.x + (Math.random() * 60 - 30),
              particle.x,
            ],
            y: [
              particle.y,
              particle.y + (Math.random() * 60 - 30),
              particle.y + (Math.random() * 60 - 30),
              particle.y,
            ],
            opacity: [
              particle.opacity,
              particle.opacity * 1.5,
              particle.opacity,
              particle.opacity * 0.7,
              particle.opacity,
            ],
          }}
          transition={{
            duration: particle.duration,
            ease: "easeInOut",
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
} 