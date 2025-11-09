"use client";

import { Button } from "@/components/ui/button";

interface ControlButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
}

export function ControlButton({ label, onClick, active = false }: ControlButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e);
  };

  return (
    <Button
      onClick={handleClick}
      className={`backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base md:text-lg w-full sm:w-auto ${
        active ? "bg-white/40 ring-2 ring-white/50 shadow-2xl" : ""
      }`}
      variant="ghost"
      type="button"
    >
      {label}
      {active && <span className="ml-2 animate-pulse" aria-hidden="true">⚡</span>}
    </Button>
  );
}

