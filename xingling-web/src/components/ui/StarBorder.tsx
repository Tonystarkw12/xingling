import React from 'react';
import { sfx } from '../../utils/sfx';

interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
}

export function StarBorder({
  as: Component = 'button',
  className = '',
  color = '#a78bfa',
  speed = '6s',
  children,
  onMouseEnter,
  onClick,
  ...props
}: StarBorderProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    sfx.playHover();
    onMouseEnter?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sfx.playClick();
    onClick?.(e);
  };

  return (
    <Component
      className={`relative inline-block py-[1px] overflow-hidden rounded-[20px] ${className}`}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-1 bg-gradient-to-b from-cosmic-800/90 to-cosmic-900/95 border border-cosmic-600/50 text-text-primary text-center rounded-[20px]">
        {children}
      </div>
    </Component>
  );
}
