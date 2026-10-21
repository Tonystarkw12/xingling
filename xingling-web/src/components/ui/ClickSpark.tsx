import { useRef, useEffect, useCallback } from 'react';
import { sfx } from '../../utils/sfx';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

export function ClickSpark({
  sparkColor = '#a78bfa',
  sparkSize = 10,
  sparkRadius = 25,
  sparkCount = 8,
  duration = 450,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameId = useRef<number | null>(null);
  const renderLoopRef = useRef<(time: number) => void>(() => {});

  useEffect(() => {
    renderLoopRef.current = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = time - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const distance = easeProgress * sparkRadius;
        const lineLength = sparkSize * (1 - easeProgress);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2 * (1 - easeProgress);
        ctx.lineCap = 'round';
        ctx.shadowColor = sparkColor;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animFrameId.current = requestAnimationFrame((t) => renderLoopRef.current(t));
      }
    };
  }, [duration, sparkColor, sparkRadius, sparkSize]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      sfx.unlockAudio();

      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();

      const newSparks: Spark[] = [];
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i * 2 * Math.PI) / sparkCount + (Math.random() - 0.5) * 0.4;
        newSparks.push({ x, y, angle, startTime: now });
      }

      const wasEmpty = sparksRef.current.length === 0;
      sparksRef.current.push(...newSparks);

      if (wasEmpty) {
        if (animFrameId.current !== null) cancelAnimationFrame(animFrameId.current);
        animFrameId.current = requestAnimationFrame((t) => renderLoopRef.current(t));
      }
    },
    [sparkCount]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handleClick);
      if (animFrameId.current !== null) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [handleClick]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />
      {children}
    </>
  );
}
