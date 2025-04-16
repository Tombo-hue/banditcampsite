'use client';

import { useRef } from 'react';
import { cn } from "@/lib/utils";

interface ScrollButtonProps {
  targetId: string;
  children: React.ReactNode;
  className?: string;
}

export default function ScrollButton({ targetId, children, className }: ScrollButtonProps) {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToSection}
      className={cn(
        "relative group",
        className
      )}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
    </button>
  );
} 