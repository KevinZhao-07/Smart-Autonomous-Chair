"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we're on a touch device
    if (typeof window === "undefined") return;
    
    if (window.matchMedia("(pointer: coarse)").matches) {
      return; // Don't show custom cursor on touch devices
    }

    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  // Don't render on touch devices or if not visible
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div
      className="cursor-sperm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
        style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.8))" }}
      >
        {/* Sperm head */}
        <ellipse cx="22" cy="16" rx="5" ry="7" fill="white" opacity="0.95" />
        {/* Sperm tail */}
        <path
          d="M 10 16 Q 14 14 16 16 Q 18 18 20 16 Q 19 15 18 15.5 Q 17 16 15 16 Q 13 16 12 15.5 Q 11 15 10 16"
          fill="white"
          opacity="0.85"
        />
        {/* Sperm body/neck */}
        <circle cx="12" cy="16" r="2.5" fill="white" opacity="0.95" />
      </svg>
    </div>
  );
}

