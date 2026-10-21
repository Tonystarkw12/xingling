import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { sfx } from '../../utils/sfx';

interface PromoVideoProps {
  src: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * 宣传片播放器。
 *
 * - 仅在滚动进入视口后才挂载 src，避免首屏就下载整段视频
 * - 自动播放必须静音（浏览器策略），提供手动取消静音按钮
 * - 尊重系统「减少动态效果」偏好：该模式下不自动播放
 * - 点击画面可暂停/继续
 */

const SUPPORTS_IO = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export function PromoVideo({
  src,
  poster,
  title = '星灵宣传片',
  subtitle = 'THE HOLY EMPEROR WAR',
  className = '',
}: PromoVideoProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(!SUPPORTS_IO);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // 进入视口后才加载视频
  useEffect(() => {
    const el = shellRef.current;
    if (!el || !SUPPORTS_IO) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 自动播放（静音），并尊重「减少动态效果」偏好
  useEffect(() => {
    if (!inView) return;
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const p = v.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [inView]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    } else {
      v.pause();
      setPlaying(false);
    }
    sfx.playClick();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    sfx.playClick();
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  return (
    <div
      ref={shellRef}
      className={`relative overflow-hidden rounded-2xl border border-cosmic-600/40 bg-cosmic-800/60 backdrop-blur-md shadow-xl shadow-cosmic-900/50 ${className}`}
    >
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          poster={poster}
          preload="none"
          playsInline
          loop
          muted={muted}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          className="absolute inset-0 h-full w-full cursor-pointer object-cover"
          {...(inView ? { src } : {})}
        />

        {/* 未播放时的中央播放按钮 */}
        {inView && !playing && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="播放宣传片"
            className="absolute inset-0 z-20 flex items-center justify-center bg-cosmic-900/30 transition-colors hover:bg-cosmic-900/20"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-nebula-400/50 bg-cosmic-800/70 text-nebula-300 backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:border-nebula-300/70">
              <Play className="ml-1 h-7 w-7" />
            </span>
          </button>
        )}

        {/* 底部标题条 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-cosmic-900/90 via-cosmic-900/40 to-transparent px-5 pb-4 pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-bold tracking-wide text-text-primary">{title}</div>
              <div className="mt-0.5 font-mono text-[10px] tracking-[0.25em] text-nebula-300/80">
                {subtitle}
              </div>
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              {inView && (
                <>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? '暂停' : '播放'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-cosmic-600/50 bg-cosmic-800/70 text-text-secondary backdrop-blur-md transition-colors hover:border-nebula-400/60 hover:text-nebula-300"
                  >
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? '取消静音' : '静音'}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-cosmic-600/50 bg-cosmic-800/70 text-text-secondary backdrop-blur-md transition-colors hover:border-nebula-400/60 hover:text-nebula-300"
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 播放进度条 */}
        <div className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-cosmic-700/60">
          <div
            className="h-full bg-gradient-to-r from-nebula-500 to-star-400 transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
