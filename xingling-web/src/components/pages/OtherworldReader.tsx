import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { otherworldData, type OtherworldChapter } from '../../data/otherworld';
import { useStore, useSettings, type ReaderTheme } from '../../store';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
  Compass,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { sfx } from '../../utils/sfx';

const THEMES: { label: string; value: ReaderTheme; dot: string; ring: string }[] = [
  { label: '深空', value: 'space', dot: '#0a0e27', ring: '#a78bfa' },
  { label: '纸墨', value: 'sepia', dot: '#efe3c6', ring: '#8a7a63' },
  { label: '纯黑', value: 'ink', dot: '#000000', ring: '#c8cdd8' },
];

const LINE_HEIGHTS = [
  { label: '紧凑', value: 1.8 },
  { label: '标准', value: 2.05 },
  { label: '宽松', value: 2.3 },
];

function readScrollMap(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem('xingling-otherworld-scroll') || '{}');
  } catch {
    return {};
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Paragraph fade-in reveal
function Reveal({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(!enabled);

  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <p ref={ref} className={shown ? 'reader-p reader-p-shown' : 'reader-p'}>
      {children}
    </p>
  );
}

export function OtherworldReader() {
  const { chapterIndex } = useParams<{ chapterIndex: string }>();
  const navigate = useNavigate();
  const cIdx = parseInt(chapterIndex ?? '0', 10);
  const totalChapters = otherworldData.chapters.length;

  const validIdx = Math.max(0, Math.min(totalChapters - 1, isNaN(cIdx) ? 0 : cIdx));
  const chapter: OtherworldChapter = otherworldData.chapters[validIdx];

  const {
    fontSize, setFontSize, theme, setTheme, lineHeight, setLineHeight,
    indent, setIndent, serif, setSerif, effects, setEffects,
    sfx: sfxEnabled, setSfx,
  } = useSettings();

  const { markOtherworldComplete, setOtherworldProgress, completedOtherworldChapters } = useStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const saveTimer = useRef<number | undefined>(undefined);
  const toastTimer = useRef<number | undefined>(undefined);
  const milestones = useRef({ half: false, done: false });

  const fx = effects && !prefersReducedMotion();

  // Scroll tracking, milestones, and auto-hide header
  useEffect(() => {
    milestones.current = { half: false, done: false };
    let lastY = window.scrollY;
    const fxOn = effects && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showToast = (msg: string) => {
      setToast(msg);
      sfx.playChime();
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), 1800);
    };

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const pct = h > 0 ? Math.min(100, Math.max(0, (y / h) * 100)) : 0;
      setProgress(pct);
      setChromeVisible(y < 120 || y < lastY);
      lastY = y;

      if (fxOn) {
        if (pct >= 50 && !milestones.current.half) {
          milestones.current.half = true;
          showToast('✦ 已过半');
        }
        if (pct >= 98 && !milestones.current.done) {
          milestones.current.done = true;
          showToast('✦ 本章完');
          markOtherworldComplete(validIdx);
        }
      }

      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          const map = readScrollMap();
          map[`chapter-${validIdx}`] = y;
          sessionStorage.setItem('xingling-otherworld-scroll', JSON.stringify(map));
        } catch {
          /* storage unavailable */
        }
      }, 300);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(saveTimer.current);
      window.clearTimeout(toastTimer.current);
    };
  }, [validIdx, effects, markOtherworldComplete]);

  // Set store progress and restore scroll
  useEffect(() => {
    setOtherworldProgress(validIdx);
    const saved = readScrollMap()[`chapter-${validIdx}`] ?? 0;
    const timer = setTimeout(() => {
      window.scrollTo({ top: saved > 100 ? saved : 0 });
    }, 80);
    return () => clearTimeout(timer);
  }, [validIdx, setOtherworldProgress]);

  const goToChapter = (nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= totalChapters) return;
    sfx.playPageTurn();
    navigate(`/otherworld/read/${nextIdx}`);
  };

  const paragraphs = useMemo(() => {
    return chapter.paragraphs.map((p) => p.trim()).filter(Boolean);
  }, [chapter]);

  // Dynamic theme styles
  const themeClass =
    theme === 'sepia'
      ? 'theme-sepia'
      : theme === 'ink'
      ? 'theme-ink'
      : 'theme-space';

  return (
    <div className={`min-h-screen relative transition-colors duration-300 ${themeClass}`}>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-cosmic-900/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-nebula-500 via-star-500 to-aurora-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Header */}
      <header
        className={`fixed top-1 left-0 right-0 z-40 transition-transform duration-300 ${
          chromeVisible ? 'translate-y-0' : '-translate-y-24'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between backdrop-blur-xl bg-cosmic-900/80 border-b border-cosmic-700/50 rounded-b-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <Link
              to="/otherworld"
              onClick={() => sfx.playClick()}
              className="p-2 rounded-lg hover:bg-cosmic-700/60 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="返回外传目录"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <button
              onClick={() => {
                sfx.playClick();
                setShowChapterList((prev) => !prev);
              }}
              className="text-left px-2.5 py-1 rounded-lg hover:bg-cosmic-700/50 transition-colors"
            >
              <div className="text-[10px] font-mono text-nebula-400 flex items-center gap-1">
                <span>外传 · 第 {chapter.id} / {totalChapters} 章</span>
              </div>
              <div className="text-sm font-bold text-text-primary truncate max-w-[180px] sm:max-w-xs">
                {chapter.title} {chapter.subtitle && `· ${chapter.subtitle}`}
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                sfx.playClick();
                setShowSettings((s) => !s);
              }}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? 'bg-nebula-500/20 text-nebula-300'
                  : 'hover:bg-cosmic-700/60 text-text-secondary hover:text-text-primary'
              }`}
              aria-label="阅读设置"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-1 font-mono text-xs text-text-secondary px-2">
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chapter Dropdown / Quick Navigator */}
      <AnimatePresence>
        {showChapterList && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-4 right-4 sm:left-auto sm:right-auto sm:max-w-md mx-auto z-40 p-4 rounded-2xl bg-cosmic-900/95 border border-cosmic-600/60 backdrop-blur-2xl shadow-2xl space-y-2 max-h-[75vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-cosmic-700/60 text-xs font-bold text-text-secondary">
              <span>《境界彼方》全部章节</span>
              <button
                onClick={() => setShowChapterList(false)}
                className="text-text-secondary hover:text-text-primary px-1"
              >
                ✕
              </button>
            </div>
            {otherworldData.chapters.map((c, idx) => {
              const isCurrent = idx === validIdx;
              const isDone = completedOtherworldChapters.includes(idx);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setShowChapterList(false);
                    goToChapter(idx);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-nebula-500/25 border border-nebula-400/50 text-white font-bold'
                      : 'hover:bg-cosmic-700/50 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-mono text-xs mr-2 text-nebula-400">0{c.id}</span>
                    <span className="text-sm">{c.title} {c.subtitle && `· ${c.subtitle}`}</span>
                  </div>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </m.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 sm:right-8 z-40 w-80 p-5 rounded-2xl bg-cosmic-900/95 border border-cosmic-600/60 backdrop-blur-2xl shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-cosmic-700/60 pb-2">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-nebula-400" /> 阅读偏好设置
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            {/* Theme */}
            <div className="space-y-1.5">
              <span className="text-xs text-text-secondary">背景主题</span>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => {
                      sfx.playClick();
                      setTheme(t.value);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      theme === t.value
                        ? 'border-nebula-400 bg-nebula-500/20 text-white font-semibold'
                        : 'border-cosmic-700/60 hover:border-cosmic-500 text-text-secondary'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.dot }} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-text-secondary">
                <span>字号</span>
                <span className="font-mono">{fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sfx.playClick();
                    setFontSize(Math.max(14, fontSize - 1));
                  }}
                  className="px-3 py-1 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600 text-xs font-bold text-text-primary"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="26"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="flex-1 accent-nebula-400"
                />
                <button
                  onClick={() => {
                    sfx.playClick();
                    setFontSize(Math.min(26, fontSize + 1));
                  }}
                  className="px-3 py-1 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600 text-xs font-bold text-text-primary"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-1.5">
              <span className="text-xs text-text-secondary">行高间距</span>
              <div className="grid grid-cols-3 gap-2">
                {LINE_HEIGHTS.map((lh) => (
                  <button
                    key={lh.label}
                    onClick={() => {
                      sfx.playClick();
                      setLineHeight(lh.value);
                    }}
                    className={`py-1 rounded-lg text-xs border transition-all ${
                      lineHeight === lh.value
                        ? 'border-nebula-400 bg-nebula-500/20 text-white font-semibold'
                        : 'border-cosmic-700/60 text-text-secondary hover:border-cosmic-500'
                    }`}
                  >
                    {lh.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-cosmic-700/60">
              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={indent}
                  onChange={(e) => setIndent(e.target.checked)}
                  className="accent-nebula-400 rounded"
                />
                <span>首行缩进</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={serif}
                  onChange={(e) => setSerif(e.target.checked)}
                  className="accent-nebula-400 rounded"
                />
                <span>衬线字体</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={effects}
                  onChange={(e) => setEffects(e.target.checked)}
                  className="accent-nebula-400 rounded"
                />
                <span>动效渲染</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={sfxEnabled}
                  onChange={(e) => setSfx(e.target.checked)}
                  className="accent-nebula-400 rounded"
                />
                <span>音效反馈</span>
              </label>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Main Reader Body */}
      <main className="max-w-3xl mx-auto px-5 pt-28 pb-24 relative z-10">
        {/* Chapter Header Card */}
        <div className="text-center mb-12 pb-8 border-b border-cosmic-700/40">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nebula-500/10 border border-nebula-500/20 text-nebula-300 text-xs font-mono mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>外传 · 第 {chapter.id} 章</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-text-primary tracking-tight">
            {chapter.title}
          </h1>

          {chapter.subtitle && (
            <h2 className="text-lg sm:text-xl text-text-secondary font-medium mb-4">
              {chapter.subtitle}
            </h2>
          )}

          <div className="flex items-center justify-center gap-4 text-xs text-text-secondary font-mono">
            <span>{chapter.wordCount} 字</span>
            <span>·</span>
            <span>约 {chapter.readingTimeMinutes} 分钟</span>
          </div>

          {chapter.quote && (
            <div className="mt-6 p-4 rounded-xl bg-cosmic-800/40 border-l-2 border-nebula-400 text-xs text-text-secondary text-left italic">
              {chapter.quote}
            </div>
          )}
        </div>

        {/* Paragraphs with custom styling */}
        <div
          className={`space-y-6 ${serif ? 'font-serif' : 'font-sans'}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          {paragraphs.map((p, pIdx) => {
            // Check if this paragraph is a ship log title like 【航行日志 025】
            if (p.startsWith('【航行日志')) {
              return (
                <div
                  key={pIdx}
                  className="my-6 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 shadow-md shadow-cyan-950/20 flex items-center gap-2.5 text-cyan-300 font-mono text-sm"
                >
                  <Terminal className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                  <span className="font-bold tracking-wider">{p}</span>
                </div>
              );
            }

            // Check if it's a quote starting with >
            if (p.startsWith('> ')) {
              return (
                <blockquote
                  key={pIdx}
                  className="my-4 p-4 rounded-xl bg-cosmic-800/50 border-l-4 border-nebula-400 text-text-primary/90 italic text-sm"
                >
                  {p.replace(/^>\s*/, '')}
                </blockquote>
              );
            }

            return (
              <Reveal key={pIdx} enabled={fx}>
                <span className={indent ? 'inline-block text-indent-2' : ''}>
                  {p}
                </span>
              </Reveal>
            );
          })}
        </div>

        {/* Chapter Finished Card */}
        <div className="mt-16 pt-8 border-t border-cosmic-700/60 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-nebula-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>— 本章完结 · 境界彼方 —</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            {validIdx > 0 ? (
              <button
                onClick={() => goToChapter(validIdx - 1)}
                className="flex-1 p-4 rounded-xl bg-cosmic-800/60 hover:bg-cosmic-700/70 border border-cosmic-600/40 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="text-[11px] font-mono text-text-secondary flex items-center gap-1 mb-1">
                  <ChevronLeft className="w-3.5 h-3.5" /> 上一章
                </div>
                <div className="text-sm font-bold text-text-primary truncate">
                  {otherworldData.chapters[validIdx - 1].title}
                </div>
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {validIdx < totalChapters - 1 ? (
              <button
                onClick={() => goToChapter(validIdx + 1)}
                className="flex-1 p-4 rounded-xl bg-gradient-to-r from-nebula-600/80 to-star-600/80 hover:from-nebula-500 hover:to-star-500 border border-nebula-400/40 text-right transition-all hover:scale-[1.02] active:scale-[0.98] text-white shadow-lg shadow-nebula-500/20"
              >
                <div className="text-[11px] font-mono text-nebula-200 flex items-center justify-end gap-1 mb-1">
                  下一章 <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {otherworldData.chapters[validIdx + 1].title}
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  sfx.playClick();
                  navigate('/otherworld');
                }}
                className="flex-1 p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-right transition-all text-white shadow-lg"
              >
                <div className="text-[11px] font-mono text-emerald-100 flex items-center justify-end gap-1 mb-1">
                  外传完结 <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-sm font-bold text-white truncate">
                  返回外传全景
                </div>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-cosmic-800/90 border border-nebula-400/50 text-nebula-300 text-xs font-medium shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <span>{toast}</span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
