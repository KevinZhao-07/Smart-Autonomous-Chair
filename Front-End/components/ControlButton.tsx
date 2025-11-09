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
      className={`backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white text-lg px-6 py-3 rounded-lg shadow-lg transition-all duration-150 ${
        active ? "bg-white/30 border-white/50" : ""
      }`}
      variant="ghost"
      type="button"
    >
      {label}
    </Button>
  );
}

