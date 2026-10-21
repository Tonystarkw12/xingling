import React, { useRef, useState, useCallback } from 'react';
import { sfx } from '../../utils/sfx';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  enableHoverSound?: boolean;
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(167, 139, 250, 0.15)',
  spotlightSize = 350,
  enableHoverSound = true,
  onMouseEnter,
  onClick,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setOpacity(1);
      if (enableHoverSound) {
        sfx.playHover();
      }
      onMouseEnter?.(e);
    },
    [enableHoverSound, onMouseEnter]
  );

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      sfx.playClick();
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative overflow-hidden rounded-2xl border border-cosmic-600/40 bg-cosmic-800/40 backdrop-blur-md transition-all duration-300 hover:border-nebula-400/50 hover:shadow-xl hover:shadow-nebula-500/10 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 ease-out"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
