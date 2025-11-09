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

    const particleCount = 30;
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
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 60 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const randomDelay = Math.random() * 0.3;
        
        particle.style.position = "fixed";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty("--tx", `${tx}px`);
        particle.style.animationDelay = `${randomDelay}s`;
        const size = 5 + Math.random() * 8;
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
      }, 1300);
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

