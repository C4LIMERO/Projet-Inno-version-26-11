import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IdeaNode {
  id: string;
  x: number;
  y: number;
  type: 'bulb' | 'star' | 'circle' | 'note'; // Types de représentations d'idées
  size: number;
  vx: number;
  vy: number;
  connections: string[];
  brightness: number; // Pour l'effet d'illumination
  pulseIntensity: number;
  pulseDirection: number;
  rotation: number; // Pour la rotation de certains éléments
  targetX?: number; // Position cible pour l'animation fluide
  targetY?: number; // Position cible pour l'animation fluide
}

interface Connection {
  from: string;
  to: string;
  strength: number;
  active: boolean;
}

interface IdeaNetworkBackgroundProps {
  nodeCount?: number;
  connectionMaxDistance?: number;
  nodeMaxSpeed?: number;
  className?: string;
  interactive?: boolean;
  connectionColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  pulseSpeed?: number;
  container?: string; // ID du conteneur pour limiter l'arrière-plan
}

// SVG en base64 préchargées pour éviter les problèmes de chargement
const BULB_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwZjlmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTkgMThoNnYzYTIgMiAwIDAgMS0yIDJoLTJhMiAyIDAgMCAxLTItMnYtM3oiLz48cGF0aCBkPSJNNiAxOGE2IDYgMCAxIDEgMTIgMEg2eiIvPjxwYXRoIGQ9Ik0xMiAydjEiLz48cGF0aCBkPSJNNCQuOTJsMSAxLjcyIi8+PHBhdGggZD0iTTIwIDQuOTJsLTEgMS43MiIvPjxwYXRoIGQ9Ik0yIDEyaDEiLz48cGF0aCBkPSJNMjEgMTJoLTEiLz48cGF0aCBkPSJNNC4yIDE5Ljc4bDEtMS43MiIvPjxwYXRoIGQ9Ik0xOC44IDE5Ljc4bC0xLTEuNzIiLz48L3N2Zz4=";
const STAR_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwZjlmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlnb24gcG9pbnRzPSIxMiAyIDEzLjk5IDguMjY3IDIwIDkuMjc0IDE1Ljk0NSAxMy41MyAxNi45NjEgMjAgMTIgMTYuODk3IDcuMDM5IDIwIDguMDU1IDEzLjUzIDQgOS4yNzQgMTAuMDEgOC4yNjciPjwvcG9seWdvbj48L3N2Zz4=";
const NOTE_SVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwZjlmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE0IDJIOGEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY4bC02LTZ6Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iMTQgMiAxNCA4IDIwIDgiPjwvcG9seWxpbmU+PGxpbmUgeDE9IjkiIHkxPSIxMCIgeDI9IjE1IiB5Mj0iMTAiPjwvbGluZT48bGluZSB4MT0iOSIgeTE9IjE0IiB4Mj0iMTUiIHkyPSIxNCI+PC9saW5lPjwvc3ZnPg==";

export function IdeaNetworkBackground({
  nodeCount = 25,
  connectionMaxDistance = 200,
  nodeMaxSpeed = 0.3,
  className = "",
  interactive = true,
  connectionColor = "rgba(0, 15, 159, 0.2)",
  primaryColor = "#000f9f",
  secondaryColor = "#4d5f80",
  pulseSpeed = 0.002, // Réduit encore plus pour éliminer le clignotement
  container = "hero-section",
}: IdeaNetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? 800 : 800,
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const nodesRef = useRef<IdeaNode[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const activationQueueRef = useRef<{ id: string; delay: number }[]>([]);
  const bulbImageRef = useRef<HTMLImageElement | null>(null);
  const starImageRef = useRef<HTMLImageElement | null>(null);
  const noteImageRef = useRef<HTMLImageElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const activeNodesRef = useRef<Set<string>>(new Set());
  const attractionStrength = interactive ? 0.03 : 0; // Force d'attraction bien plus élevée
  const attractionRadius = 200; // Rayon d'attraction augmenté

  // Précharger et préparer les images
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let imagesLoadedCount = 0;
    const totalImages = 3;
    
    const checkAllImagesLoaded = () => {
      imagesLoadedCount++;
      if (imagesLoadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    const bulbImage = new Image();
    bulbImage.src = BULB_SVG;
    bulbImage.onload = checkAllImagesLoaded;
    bulbImageRef.current = bulbImage;

    const starImage = new Image();
    starImage.src = STAR_SVG;
    starImage.onload = checkAllImagesLoaded;
    starImageRef.current = starImage;

    const noteImage = new Image();
    noteImage.src = NOTE_SVG;
    noteImage.onload = checkAllImagesLoaded;
    noteImageRef.current = noteImage;
    
    // Si les images sont en cache et se chargent immédiatement, onload ne sera pas appelé
    if (bulbImage.complete) checkAllImagesLoaded();
    if (starImage.complete) checkAllImagesLoaded();
    if (noteImage.complete) checkAllImagesLoaded();
  }, []);

  // Initialiser les dimensions en fonction du conteneur
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      if (container) {
        const containerElement = document.getElementById(container);
        if (containerElement) {
          const { width, height } = containerElement.getBoundingClientRect();
          setDimensions({ width, height });
        } else {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }
      } else {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    // Utiliser debounce pour éviter les appels trop fréquents
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdateDimensions = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    // Observer les changements de taille du conteneur
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }
    
    resizeObserverRef.current = new ResizeObserver(debouncedUpdateDimensions);
    
    const containerElement = document.getElementById(container);
    if (containerElement) {
      resizeObserverRef.current.observe(containerElement);
    }
    
    window.addEventListener('resize', debouncedUpdateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener('resize', debouncedUpdateDimensions);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      clearTimeout(timeoutId);
    };
  }, [container]);

  // Générer les noeuds d'idées et les connexions
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Générer les noeuds
    const nodes: IdeaNode[] = [];
    const types: ('bulb' | 'star' | 'circle' | 'note')[] = ['bulb', 'star', 'circle', 'note'];
    
    for (let i = 0; i < nodeCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const x = Math.random() * dimensions.width;
      const y = Math.random() * dimensions.height;
      nodes.push({
        id: `node-${i}`,
        x: x,
        y: y,
        targetX: x, // Initialiser la position cible
        targetY: y, // Initialiser la position cible
        type,
        size: Math.random() * 6 + 10, // Taille encore plus cohérente
        vx: (Math.random() - 0.5) * nodeMaxSpeed * 0.5,
        vy: (Math.random() - 0.5) * nodeMaxSpeed * 0.5,
        connections: [],
        brightness: 0.3, // Valeur fixe pour éviter le clignotement
        pulseIntensity: 0.5, // Valeur initiale fixe
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        rotation: Math.random() * Math.PI * 2,
      });
    }
    
    // Générer les connexions mais limiter leur nombre pour améliorer les performances
    const connections: Connection[] = [];
    const maxConnectionsPerNode = 3; // Limiter le nombre de connexions par nœud
    
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const potentialConnections = [];
      
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionMaxDistance) {
          potentialConnections.push({
            node: b,
            distance: distance,
            strength: 1 - distance / connectionMaxDistance,
          });
        }
      }
      
      // Trier par distance et prendre les plus proches
      potentialConnections.sort((a, b) => a.distance - b.distance);
      const nodesToConnect = potentialConnections.slice(0, maxConnectionsPerNode);
      
      for (const { node, strength } of nodesToConnect) {
        // Éviter les connexions en double
        const connectionExists = connections.some(
          c => (c.from === a.id && c.to === node.id) || (c.from === node.id && c.to === a.id)
        );
        
        if (!connectionExists) {
          connections.push({
            from: a.id,
            to: node.id,
            strength: strength,
            active: Math.random() > 0.8, // Moins de connexions actives par défaut
          });
          
          a.connections.push(node.id);
          node.connections.push(a.id);
        }
      }
    }
    
    nodesRef.current = nodes;
    connectionsRef.current = connections;
    activeNodesRef.current.clear();
    
    // Déclencher des activations aléatoires d'idées moins fréquemment
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // Réduire encore la fréquence
        const randomNodeIndex = Math.floor(Math.random() * nodes.length);
        activateNode(nodes[randomNodeIndex].id);
      }
    }, 3000);
    
    return () => {
      clearInterval(interval);
    };
  }, [dimensions, nodeCount, connectionMaxDistance, nodeMaxSpeed]);
  
  const activateNode = (id: string, delay = 0) => {
    activationQueueRef.current.push({ id, delay });
  };
  
  // Dessiner les noeuds d'idées et les connexions
  useEffect(() => {
    if (!canvasRef.current || !imagesLoaded) return;
    if (!bulbImageRef.current || !starImageRef.current || !noteImageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Ajuster la résolution du canvas une seule fois
    const adjustCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr;
      canvas.height = dimensions.height * dpr;
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${dimensions.width}px`;
      canvas.style.height = `${dimensions.height}px`;
    };
    
    adjustCanvas();
    
    // Fonction pour la boucle d'animation
    const animate = () => {
      if (!ctx) return;
      
      // Effacer le canvas avec un fond transparent
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Traiter la file d'activation avec un maximum par frame
      const maxActivationsPerFrame = 3; // Limiter pour améliorer les performances
      const currentQueue = [...activationQueueRef.current].slice(0, maxActivationsPerFrame);
      activationQueueRef.current = activationQueueRef.current.slice(maxActivationsPerFrame);
      
      currentQueue.forEach(({ id, delay }) => {
        if (delay <= 0) {
          // Activer l'idée
          activeNodesRef.current.add(id);
          
          // Propager l'activation avec un délai
          const node = nodesRef.current.find(n => n.id === id);
          if (node) {
            // Limiter le nombre de propagations
            const connectionsToActivate = Math.min(node.connections.length, 2);
            if (connectionsToActivate > 0) {
              // Prendre un échantillon aléatoire des connexions
              const shuffled = [...node.connections].sort(() => 0.5 - Math.random());
              shuffled.slice(0, connectionsToActivate).forEach(connectedId => {
                activateNode(connectedId, Math.random() * 30 + 10);
              });
            }
          }
        } else {
          // Réduire le délai et remettre dans la file
          activationQueueRef.current.push({ id, delay: delay - 1 });
        }
      });
      
      // Désactiver progressivement les idées
      activeNodesRef.current.forEach(id => {
        if (Math.random() > 0.98) { // Encore plus lent
          activeNodesRef.current.delete(id);
        }
      });
      
      // Dessiner les connexions
      connectionsRef.current.forEach(connection => {
        const fromNode = nodesRef.current.find(n => n.id === connection.from);
        const toNode = nodesRef.current.find(n => n.id === connection.to);
        
        if (!fromNode || !toNode) return;
        
        const isActive = connection.active || 
                         activeNodesRef.current.has(connection.from) || 
                         activeNodesRef.current.has(connection.to);
        
        const opacity = isActive 
          ? 0.4 // Valeur fixe pour éviter le clignotement 
          : 0.1; // Valeur fixe pour éviter le clignotement
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Connexion en pointillés pour un style "flux d'idées"
        if (isActive) {
          ctx.setLineDash([4, 2]);
        } else {
          ctx.setLineDash([]);
        }
        
        ctx.strokeStyle = connectionColor.replace('rgba(', '').replace(')', '') + `, ${opacity})`;
        ctx.lineWidth = isActive ? 1 : 0.5;
        ctx.stroke();
        ctx.setLineDash([]);
      });
      
      // Calcul de l'attraction du curseur
      if (interactive && mousePosition) {
        nodesRef.current.forEach(node => {
          const dx = mousePosition.x - node.x;
          const dy = mousePosition.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Attraction vers la souris avec une force qui diminue avec la distance
          if (distance < attractionRadius) {
            // Force d'attraction inversement proportionnelle à la distance
            const force = (1 - distance / attractionRadius) * attractionStrength;
            
            // Mettre à jour les positions cibles
            node.targetX = node.x + dx * force;
            node.targetY = node.y + dy * force;
            
            // Activer les nœuds proches du curseur
            if (distance < 50 && Math.random() > 0.98) {
              activateNode(node.id);
            }
          } else {
            // Retour naturel à la trajectoire normale
            node.targetX = node.x + node.vx;
            node.targetY = node.y + node.vy;
          }
        });
      }
      
      // Mise à jour et dessin des noeuds d'idées
      nodesRef.current.forEach(node => {
        // Animation fluide vers les positions cibles
        if (node.targetX !== undefined && node.targetY !== undefined) {
          // Mouvement interpolé pour une animation fluide
          node.x += (node.targetX - node.x) * 0.1;
          node.y += (node.targetY - node.y) * 0.1;
        } else {
          // Mouvement normal si pas de cible
          node.x += node.vx * 0.5;
          node.y += node.vy * 0.5;
        }
        
        // Rebondir sur les bords
        if (node.x <= node.size || node.x >= dimensions.width - node.size) {
          node.vx *= -1;
          node.x = Math.max(node.size, Math.min(dimensions.width - node.size, node.x));
          if (node.targetX !== undefined) {
            node.targetX = node.x + node.vx * 10; // Ajuster la cible
          }
        }
        if (node.y <= node.size || node.y >= dimensions.height - node.size) {
          node.vy *= -1;
          node.y = Math.max(node.size, Math.min(dimensions.height - node.size, node.y));
          if (node.targetY !== undefined) {
            node.targetY = node.y + node.vy * 10; // Ajuster la cible
          }
        }
        
        // Effet de pulsation très subtil
        node.pulseIntensity += pulseSpeed * node.pulseDirection;
        if (node.pulseIntensity >= 0.6) {
          node.pulseDirection = -1;
        } else if (node.pulseIntensity <= 0.4) {
          node.pulseDirection = 1;
        }
        
        const isActive = activeNodesRef.current.has(node.id);
        const scale = isActive ? 1.2 : 1;
        
        // Dessiner l'effet de lueur pour tous les types
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size * 1.5 * scale
        );
        
        const color = isActive ? primaryColor : secondaryColor;
        glow.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.5)'));
        glow.addColorStop(1, 'rgba(0, 15, 159, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(node.x, node.y, node.size * 1.5 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Dessiner le symbole approprié selon le type
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation);
        ctx.globalAlpha = isActive ? 0.9 : 0.7; // Valeurs fixes pour éviter le clignotement
        
        const drawSize = node.size * scale * 0.8;
        
        if (node.type === 'bulb' && bulbImageRef.current) {
          ctx.drawImage(bulbImageRef.current, -drawSize, -drawSize, drawSize * 2, drawSize * 2);
        } else if (node.type === 'star' && starImageRef.current) {
          ctx.drawImage(starImageRef.current, -drawSize, -drawSize, drawSize * 2, drawSize * 2);
        } else if (node.type === 'note' && noteImageRef.current) {
          ctx.drawImage(noteImageRef.current, -drawSize, -drawSize, drawSize * 2, drawSize * 2);
        } else {
          // Circle fallback avec une pulsation très subtile
          const pulseEffect = 1 + node.pulseIntensity * 0.05; // Pulsation réduite à 5%
          ctx.beginPath();
          ctx.fillStyle = isActive ? primaryColor : secondaryColor;
          ctx.arc(0, 0, drawSize * pulseEffect, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
        
        // Mise à jour de la rotation de manière très lente
        node.rotation += 0.0002 * node.pulseDirection;
      });
      
      // Continuer l'animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Démarrer l'animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Nettoyer à la fin
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, connectionColor, primaryColor, secondaryColor, pulseSpeed, interactive, mousePosition, imagesLoaded, attractionStrength, attractionRadius]);
  
  // Gestionnaires d'événements de souris avec débounce pour la fluidité
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
    
    // Réinitialiser les positions cibles
    nodesRef.current.forEach(node => {
      node.targetX = undefined;
      node.targetY = undefined;
    });
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (!interactive || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Activer toutes les idées proches du clic pour un effet visuel fort
    nodesRef.current.forEach(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < attractionRadius * 0.7) {
        activateNode(node.id, Math.floor(distance / 10)); // Activation en cascade selon la distance
      }
    });
  };
  
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </div>
  );
} 