"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";

interface SoundButtonProps {
  label: string;
  soundUrl?: string;
  onPlay: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SoundButton({ label, soundUrl, onPlay }: SoundButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (soundUrl) {
      try {
        audioRef.current = new Audio(soundUrl);
        audioRef.current.addEventListener("ended", () => setIsPlaying(false));
        audioRef.current.addEventListener("error", (e) => {
          console.error("Audio error:", e);
          setIsPlaying(false);
        });
      } catch (error) {
        console.error("Failed to create audio:", error);
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [soundUrl]);

  const playTone = useCallback(() => {
    try {
      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          console.warn("Web Audio API not supported");
          return;
        }
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;
      
      // Resume context if suspended (browser autoplay policy)
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(console.error);
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Generate different frequencies for different buttons
      const baseFreq = 200 + Math.random() * 400;
      oscillator.frequency.value = baseFreq;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
      
      oscillator.addEventListener("ended", () => {
        oscillator.disconnect();
        gainNode.disconnect();
      });
    } catch (error) {
      console.error("Failed to play tone:", error);
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay(e);
    
    if (audioRef.current && soundUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Failed to play audio:", error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    } else {
      // Fallback: Use Web Audio API to generate a simple tone
      playTone();
    }
  }, [onPlay, soundUrl, isPlaying, playTone]);

  return (
    <Button
      onClick={handleClick}
      className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-sm md:text-base w-full"
      variant="ghost"
      type="button"
    >
      {label}
      {isPlaying && <span className="ml-2 animate-pulse">🔊</span>}
    </Button>
  );
}

