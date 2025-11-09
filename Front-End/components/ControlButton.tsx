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
      className={`backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 text-sm px-4 py-2 rounded transition-all duration-150 ${
        active ? "bg-white/25 border-white/40" : ""
      }`}
      variant="ghost"
      type="button"
    >
      {label}
    </Button>
  );
}

