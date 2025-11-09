"use client";

import { useEffect, useRef } from "react";

interface ParticleEffectProps {
  id: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export function ParticleEffect({ id, x, y, onComplete }: ParticleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing particles in this container first
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    particlesRef.current = [];

    const particleCount = 20 + Math.floor(Math.random() * 20); // Randomize particle count
    const particles: HTMLDivElement[] = [];

    const cleanup = () => {
      if (!mountedRef.current) return;
      particlesRef.current.forEach(particle => {
        try {
          if (particle && particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        } catch (error) {
          // Ignore cleanup errors
        }
      });
      particlesRef.current = [];
    };

    try {
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.setAttribute("data-particle-id", `${id}-${i}`);
        
        const angle = Math.random() * Math.PI * 2; // Random angle
        const velocity = 50 + Math.random() * 100; // Random velocity
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity; // Add vertical randomness
        const randomDelay = Math.random() * 0.2; // Shorter delay
        const duration = 0.8 + Math.random() * 0.8; // Random duration
        
        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty("--tx", `${tx}px`);
        particle.style.setProperty("--ty", `${ty}px`);
        particle.style.animationDelay = `${randomDelay}s`;
        particle.style.animationDuration = `${duration}s`; // Set random duration
        const size = 3 + Math.random() * 9; // Random size
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.8)";
        particle.style.zIndex = "50";
        
        container.appendChild(particle);
        particles.push(particle);
      }

      particlesRef.current = particles;

      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          cleanup();
          onComplete();
        }
      }, 1800); // Increased timeout to account for longer animation durations
    } catch (error) {
      console.error("Error creating particles:", error);
      cleanup();
      if (mountedRef.current) {
        onComplete();
      }
    }

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      cleanup();
    };
  }, [x, y, onComplete, id]);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" style={{ left: 0, top: 0, width: "100%", height: "100%" }} data-particle-container={id} />;
}

