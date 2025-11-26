import React, { useState, useRef, MouseEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  perspective?: number;
  scale?: number;
  transitionSpeed?: number;
  tiltReverse?: boolean;
  glareMaxOpacity?: number;
  glareColor?: string;
  initialGlarePosition?: string;
  glareBorderRadius?: string;
}

export function TiltCard({
  children,
  className,
  glareEnabled = true,
  tiltMaxAngleX = 10,
  tiltMaxAngleY = 10,
  perspective = 1000,
  scale = 1.05,
  transitionSpeed = 400,
  tiltReverse = false,
  glareMaxOpacity = 0.5,
  glareColor = "rgba(255, 255, 255, 0.5)",
  initialGlarePosition = "50% 50%",
  glareBorderRadius = "14px",
}: TiltCardProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const xDecimal = (mouseX - centerX) / (rect.width / 2);
    const yDecimal = (mouseY - centerY) / (rect.height / 2);
    
    const multiplier = tiltReverse ? -1 : 1;
    
    setTransform({
      x: multiplier * tiltMaxAngleX * yDecimal,
      y: multiplier * tiltMaxAngleY * -xDecimal,
      scale: isHovered ? scale : 1,
    });
    
    if (glareEnabled) {
      setGlarePosition({
        x: (mouseX - rect.left) / rect.width * 100,
        y: (mouseY - rect.top) / rect.height * 100,
      });
    }
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({ x: 0, y: 0, scale: 1 });
    setGlarePosition({ x: 50, y: 50 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transform.x,
        rotateY: transform.y,
        scale: transform.scale,
      }}
      transition={{
        duration: transitionSpeed / 1000,
        ease: 'easeOut',
      }}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      
      {glareEnabled && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, rgba(0, 0, 0, 0) 70%)`,
            opacity: glareMaxOpacity,
            borderRadius: glareBorderRadius,
            mixBlendMode: "overlay",
          }}
          animate={{
            opacity: isHovered ? glareMaxOpacity : 0,
          }}
          transition={{
            duration: transitionSpeed / 1000,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.div>
  );
} 