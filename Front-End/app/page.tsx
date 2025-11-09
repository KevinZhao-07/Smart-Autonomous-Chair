"use client";

import { useState, useCallback } from "react";
import { CustomCursor } from "@/components/CustomCursor";
import { ParticleEffect } from "@/components/ParticleEffect";
import { SoundButton } from "@/components/SoundButton";
import { ControlButton } from "@/components/ControlButton";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function Home() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [trackPersonActive, setTrackPersonActive] = useState(false);
  const [gooningMachineActive, setGooningMachineActive] = useState(false);

  const soundLabels = [
    "Sound 1",
    "Sound 2",
    "Sound 3",
    "Sound 4",
    "Sound 5",
    "Sound 6",
    "Sound 7",
    "Sound 8",
    "Sound 9",
    "Sound 10",
  ];

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const id = Date.now() + Math.random();
      setParticles((prev) => [...prev, { id, x, y }]);
    } catch (error) {
      console.error("Error handling button click:", error);
    }
  }, []);

  const handleParticleComplete = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleTrackPerson = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonClick(e);
    setTrackPersonActive((prev) => !prev);
  }, [handleButtonClick]);

  const handleGooningMachine = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonClick(e);
    setGooningMachineActive((prev) => !prev);
  }, [handleButtonClick]);

  return (
    <main className="custom-cursor min-h-screen relative overflow-hidden">
      <CustomCursor />
      
      {/* Livestream Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/50 to-blue-900/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-9xl font-bold select-none">
            LIVE STREAM
          </div>
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Title */}
        <div className="pt-8 px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl backdrop-blur-sm bg-black/20 px-4 md:px-6 py-3 rounded-lg inline-block">
            The Goon Chair
          </h1>
        </div>

        {/* Controls at bottom */}
        <div className="mt-auto pb-4 md:pb-8 px-4 md:px-8 space-y-4 md:space-y-6">
          {/* Sound Buttons */}
          <div className="backdrop-blur-md bg-black/20 rounded-2xl p-4 md:p-6 border border-white/20">
            <h2 className="text-white text-lg md:text-xl font-semibold mb-3 md:mb-4 drop-shadow-lg">
              Sounds
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {soundLabels.map((label, index) => (
                <SoundButton
                  key={index}
                  label={label}
                  onPlay={handleButtonClick}
                />
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="backdrop-blur-md bg-black/20 rounded-2xl p-4 md:p-6 border border-white/20">
            <h2 className="text-white text-lg md:text-xl font-semibold mb-3 md:mb-4 drop-shadow-lg">
              Controls
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <ControlButton
                label="Track Person"
                onClick={handleTrackPerson}
                active={trackPersonActive}
              />
              <ControlButton
                label="Gooning Machine"
                onClick={handleGooningMachine}
                active={gooningMachineActive}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Particle Effects */}
      {particles.map((particle) => (
        <ParticleEffect
          key={particle.id}
          id={particle.id}
          x={particle.x}
          y={particle.y}
          onComplete={() => handleParticleComplete(particle.id)}
        />
      ))}
    </main>
  );
}

