import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Neuron {
  id: string;
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  connections: string[];
  hue: number;
  pulseIntensity: number;
  pulseDirection: number;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

interface NeuralIdeaBackgroundProps {
  neuronCount?: number;
  connectionMaxDistance?: number;
  neuronMaxSpeed?: number;
  className?: string;
  interactive?: boolean;
  connectionColor?: string;
  neuronColor?: string;
  pulseSpeed?: number;
}

export function NeuralIdeaBackground({
  neuronCount = 30,
  connectionMaxDistance = 150,
  neuronMaxSpeed = 0.5,
  className = "",
  interactive = true,
  connectionColor = "rgba(0, 15, 159, 0.2)",
  neuronColor = "#000f9f",
  pulseSpeed = 0.01,
}: NeuralIdeaBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const neuronsRef = useRef<Neuron[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const activationQueueRef = useRef<{ id: string; delay: number }[]>([]);

  // Initialiser les neurones et les connexions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length > 0) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    const container = canvasRef.current?.parentElement;
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Générer les neurones
    const neurons: Neuron[] = [];
    for (let i = 0; i < neuronCount; i++) {
      neurons.push({
        id: `neuron-${i}`,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * neuronMaxSpeed,
        vy: (Math.random() - 0.5) * neuronMaxSpeed,
        connections: [],
        hue: Math.random() * 60 - 30, // Variation subtile autour de la couleur principale
        pulseIntensity: Math.random(), 
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
      });
    }
    
    // Générer les connexions
    const connections: Connection[] = [];
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const a = neurons[i];
        const b = neurons[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionMaxDistance) {
          connections.push({
            from: a.id,
            to: b.id,
            strength: 1 - distance / connectionMaxDistance,
            active: Math.random() > 0.7, // Certaines connexions sont actives dès le début
          });
          
          a.connections.push(b.id);
          b.connections.push(a.id);
        }
      }
    }
    
    neuronsRef.current = neurons;
    connectionsRef.current = connections;
    
    // Déclencher des activations aléatoires
    const interval = setInterval(() => {
      const randomNeuronIndex = Math.floor(Math.random() * neurons.length);
      activateNeuron(neurons[randomNeuronIndex].id);
    }, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [dimensions, neuronCount, connectionMaxDistance, neuronMaxSpeed]);
  
  const activateNeuron = (id: string, delay = 0) => {
    activationQueueRef.current.push({ id, delay });
  };
  
  // Mettre à jour et dessiner le canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ajuster la résolution du canvas pour éviter le flou
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    
    let activeNeurons = new Set<string>();
    
    const animate = () => {
      if (!ctx) return;
      
      // Effacer le canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Traiter la file d'activation
      const currentQueue = [...activationQueueRef.current];
      activationQueueRef.current = [];
      
      currentQueue.forEach(({ id, delay }) => {
        if (delay <= 0) {
          // Activer le neurone
          activeNeurons.add(id);
          
          // Trouver ses connexions et les activer avec un délai
          const neuron = neuronsRef.current.find(n => n.id === id);
          if (neuron) {
            neuron.connections.forEach(connectedId => {
              // Propagation avec délai
              activateNeuron(connectedId, Math.random() * 30 + 10);
            });
          }
        } else {
          // Réduire le délai et remettre dans la file
          activationQueueRef.current.push({ id, delay: delay - 1 });
        }
      });
      
      // Après un certain temps, désactiver les neurones
      activeNeurons.forEach(id => {
        if (Math.random() > 0.95) {
          activeNeurons.delete(id);
        }
      });
      
      // Dessiner les connexions
      connectionsRef.current.forEach(connection => {
        const fromNeuron = neuronsRef.current.find(n => n.id === connection.from);
        const toNeuron = neuronsRef.current.find(n => n.id === connection.to);
        
        if (!fromNeuron || !toNeuron) return;
        
        const isActive = connection.active || 
                          activeNeurons.has(connection.from) || 
                          activeNeurons.has(connection.to);
        
        const opacity = isActive 
          ? Math.min(connection.strength + 0.2, 1) 
          : connection.strength * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(fromNeuron.x, fromNeuron.y);
        ctx.lineTo(toNeuron.x, toNeuron.y);
        ctx.strokeStyle = connectionColor.replace('rgba(', '').replace(')', '') + `, ${opacity})`;
        ctx.lineWidth = isActive ? 1.5 : 0.5;
        ctx.stroke();
      });
      
      // Dessiner les neurones
      neuronsRef.current.forEach(neuron => {
        // Mise à jour de la position
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;
        
        // Rebondir sur les bords
        if (neuron.x <= 0 || neuron.x >= dimensions.width) neuron.vx *= -1;
        if (neuron.y <= 0 || neuron.y >= dimensions.height) neuron.vy *= -1;
        
        // Effet de pulsation
        neuron.pulseIntensity += pulseSpeed * neuron.pulseDirection;
        if (neuron.pulseIntensity >= 1 || neuron.pulseIntensity <= 0) {
          neuron.pulseDirection *= -1;
        }
        
        const isActive = activeNeurons.has(neuron.id);
        const baseColor = isActive ? "#ffffff" : neuronColor;
        const hue = isActive ? neuron.hue + 30 : neuron.hue;
        const size = isActive ? neuron.radius * 1.5 : neuron.radius;
        
        // Effet d'interaction avec la souris
        let interactionEffect = 1;
        if (interactive && mousePosition) {
          const dx = neuron.x - mousePosition.x;
          const dy = neuron.y - mousePosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            interactionEffect = 1 + (1 - distance / 100) * 1.5;
            
            // Ajouter une légère attraction vers le curseur
            neuron.vx += (mousePosition.x - neuron.x) * 0.002;
            neuron.vy += (mousePosition.y - neuron.y) * 0.002;
            
            // Limiter la vitesse
            const speed = Math.sqrt(neuron.vx * neuron.vx + neuron.vy * neuron.vy);
            if (speed > neuronMaxSpeed * 2) {
              neuron.vx = (neuron.vx / speed) * neuronMaxSpeed * 2;
              neuron.vy = (neuron.vy / speed) * neuronMaxSpeed * 2;
            }
          }
        }
        
        // Dessiner un cercle avec un gradient radial pour un effet de lueur
        const gradient = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, size * 4 * interactionEffect
        );
        
        // Effet de pulsation
        const pulseOpacity = 0.3 + neuron.pulseIntensity * 0.5;
        
        gradient.addColorStop(0, isActive ? 'rgba(0, 15, 159, 0.8)' : 'rgba(0, 15, 159, 0.6)');
        gradient.addColorStop(0.5, isActive ? 'rgba(0, 15, 159, 0.4)' : 'rgba(0, 15, 159, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 15, 159, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(neuron.x, neuron.y, size * 3 * interactionEffect, 0, Math.PI * 2);
        ctx.fill();
        
        // Cercle central
        ctx.beginPath();
        ctx.fillStyle = isActive ? '#ffffff' : neuronColor;
        ctx.arc(neuron.x, neuron.y, size * interactionEffect, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [dimensions, connectionColor, neuronColor, pulseSpeed, interactive, mousePosition]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  const handleMouseLeave = () => {
    setMousePosition(null);
  };
  
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
} 