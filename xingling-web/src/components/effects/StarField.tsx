import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../store';

// Background palettes; non-space themes drop the star layer entirely.
const PALETTES = {
  space: ['#0a0e27', '#0f1535', '#1a1f4e'],
  sepia: ['#f7f0dd', '#f2e7cd', '#eadcb8'],
  ink: ['#000000', '#000000', '#060608'],
} as const;

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

const WARP_MS = 900;

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useSettings((s) => s.theme);
  const effects = useSettings((s) => s.effects);
  const location = useLocation();
  // Theme is a reading-mode setting: the rest of the site stays cosmic.
  const reading = location.pathname.startsWith('/read/');
  const activeTheme = reading ? theme : 'space';
  const palette = PALETTES[activeTheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars: Star[] = [];
    const meteors: Meteor[] = [];
    const sparks: Spark[] = [];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let warpUntil = 0;
    let nextMeteorAt = performance.now() + 4000 + Math.random() * 6000;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    if (activeTheme === 'space') {
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.3 + 0.05,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    }

    // Chapter transitions: stars streak into warp speed for a moment.
    const onWarp = () => {
      if (effects && !reduced) warpUntil = performance.now() + WARP_MS;
    };
    // Clicks in the reading area: a small burst of stardust.
    const onBurst = (e: Event) => {
      if (!effects || reduced) return;
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 1 + Math.random() * 2,
        });
      }
      if (sparks.length > 120) sparks.splice(0, sparks.length - 120);
    };
    window.addEventListener('xingling:warp', onWarp);
    window.addEventListener('xingling:burst', onBurst);

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
      gradient.addColorStop(0, palette[0]);
      gradient.addColorStop(0.5, palette[1]);
      gradient.addColorStop(1, palette[2]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const draw = () => {
      const now = performance.now();
      drawBackground();

      // While reading, calm the backdrop: slower drift, dimmer stars.
      const speedFactor = reading ? 0.25 : 1;
      const alphaFactor = reading ? 0.45 : 1;
      const warping = now < warpUntil;
      const warpK = warping ? 1 - (warpUntil - now) / WARP_MS : 0;

      if (activeTheme === 'space') {
        for (const star of stars) {
          star.opacity += star.twinkleSpeed;
          if (star.opacity > 1 || star.opacity < 0.1) star.twinkleSpeed *= -1;

          const vy = star.speed * speedFactor * (warping ? 1 + 20 * warpK : 1);
          if (warping) {
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x, star.y - vy * 7);
            ctx.strokeStyle = `rgba(200, 210, 255, ${star.opacity * 0.7 * alphaFactor})`;
            ctx.lineWidth = star.size;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8 * alphaFactor})`;
            ctx.fill();

            if (star.size > 1.5) {
              ctx.beginPath();
              ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(139, 92, 246, ${star.opacity * 0.1 * alphaFactor})`;
              ctx.fill();
            }
          }

          star.y += vy;
          if (star.y > window.innerHeight) {
            star.y = 0;
            star.x = Math.random() * window.innerWidth;
          }
        }

        // Occasional shooting star (rarer and dimmer while reading).
        if (effects && now > nextMeteorAt) {
          meteors.push({
            x: Math.random() * window.innerWidth,
            y: -20,
            vx: (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 4),
            vy: 6 + Math.random() * 4,
            life: 1,
          });
          nextMeteorAt = now + (reading ? 18000 : 8000) + Math.random() * (reading ? 18000 : 10000);
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx;
          m.y += m.vy;
          m.life -= 0.012;
          if (m.life <= 0 || m.y > window.innerHeight + 40 || m.x < -60 || m.x > window.innerWidth + 60) {
            meteors.splice(i, 1);
            continue;
          }
          const tail = 14;
          const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
          grad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * m.life * alphaFactor})`);
          grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
          ctx.stroke();
        }
      }

      // Interaction stardust (any theme).
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.life -= 0.03;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${s.life})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    if (reduced) {
      drawBackground();
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('xingling:warp', onWarp);
      window.removeEventListener('xingling:burst', onBurst);
    };
  }, [activeTheme, reading, effects, palette]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}
