import { useEffect, useState, useRef, useCallback } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover' | 'mount';
}

const DEFAULT_CHARS = '✦✧★☆ΞΩΨΦ0123456789ABCDEF_~#*+=!<>:;/\\';

export function DecryptedText({
  text,
  speed = 45,
  maxIterations = 8,
  sequential = true,
  revealDirection = 'start',
  characters = DEFAULT_CHARS,
  className = '',
  encryptedClassName = 'text-nebula-400/80',
  parentClassName = '',
  animateOn = 'mount',
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const iterationRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    iterationRef.current = 0;
    setIsDecrypted(false);

    const length = text.length;

    intervalRef.current = window.setInterval(() => {
      iterationRef.current += 1;
      const currentIteration = iterationRef.current;

      const newText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';

          let shouldReveal = false;
          if (sequential) {
            if (revealDirection === 'start') {
              shouldReveal = index < (currentIteration / maxIterations) * length;
            } else if (revealDirection === 'end') {
              shouldReveal = index > length - (currentIteration / maxIterations) * length;
            } else {
              const center = length / 2;
              const dist = Math.abs(index - center);
              shouldReveal = dist < (currentIteration / (maxIterations * 2)) * length;
            }
          } else {
            shouldReveal = currentIteration >= maxIterations;
          }

          if (shouldReveal) {
            return char;
          }

          const randomIndex = Math.floor(Math.random() * characters.length);
          return characters[randomIndex];
        })
        .join('');

      setDisplayText(newText);

      if (currentIteration >= maxIterations) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayText(text);
        setIsDecrypted(true);
      }
    }, speed);
  }, [text, speed, maxIterations, sequential, revealDirection, characters]);

  useEffect(() => {
    let timer: number | null = null;
    let observer: IntersectionObserver | null = null;

    if (animateOn === 'mount') {
      timer = window.setTimeout(() => {
        startAnimation();
      }, 20);
    } else if (animateOn === 'view') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAnimation();
            observer?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
    }

    return () => {
      if (timer !== null) clearTimeout(timer);
      if (observer) observer.disconnect();
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animateOn, startAnimation]);

  const handleMouseEnter = () => {
    if (animateOn === 'hover') {
      startAnimation();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block cursor-default font-mono ${parentClassName}`}
    >
      <span className={isDecrypted ? className : `${className} ${encryptedClassName}`}>
        {displayText}
      </span>
    </span>
  );
}
