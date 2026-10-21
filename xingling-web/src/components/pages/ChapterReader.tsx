import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { volumes } from '../../data/novel';
import { useStore, useSettings, type ReaderTheme } from '../../store';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Type, Settings, Volume2, Music } from 'lucide-react';
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
    return JSON.parse(sessionStorage.getItem('xingling-scroll') || '{}');
  } catch {
    return {};
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Paragraph that fades in the first time it scrolls into view.
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

export function ChapterReader() {
  const { volumeIndex, chapterIndex } = useParams<{ volumeIndex: string; chapterIndex: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const vIdx = parseInt(volumeIndex!, 10);
  const cIdx = parseInt(chapterIndex!, 10);
  const { markComplete } = useStore();
  const {
    fontSize, setFontSize, theme, setTheme, lineHeight, setLineHeight,
    indent, setIndent, serif, setSerif, effects, setEffects,
    sfx: sfxEnabled, setSfx, bgm: bgmEnabled, setBgm, volume: audioVol, setVolume: setAudioVol,
  } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const saveTimer = useRef<number | undefined>(undefined);
  const toastTimer = useRef<number | undefined>(undefined);
  const milestones = useRef({ half: false, done: false });

  const volume = volumes[vIdx];
  const chapter = volume?.chapters[cIdx];
  // Direction of the chapter transition: 1 next, -1 prev, 0 none.
  const dir = (location.state as { dir?: number } | null)?.dir ?? 0;
  const fx = effects && !prefersReducedMotion();

  // Reading progress + auto-hide top bar + scroll position memory + milestones
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
        if (pct >= 99 && !milestones.current.done) {
          milestones.current.done = true;
          showToast('✦ 本章完');
        }
      }
      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        try {
          const map = readScrollMap();
          map[`${vIdx}-${cIdx}`] = y;
          sessionStorage.setItem('xingling-scroll', JSON.stringify(map));
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
  }, [vIdx, cIdx, effects]);

  useEffect(() => {
    useStore.getState().setProgress(vIdx, cIdx);
    const saved = readScrollMap()[`${vIdx}-${cIdx}`] ?? 0;
    const timer = setTimeout(() => {
      window.scrollTo({ top: saved > 100 ? saved : 0 });
    }, 80);
    return () => clearTimeout(timer);
  }, [vIdx, cIdx]);

  // Mark as complete when navigating away
  useEffect(() => {
    return () => {
      markComplete(vIdx, cIdx);
    };
  }, [vIdx, cIdx, markComplete]);

  // Keyboard: ←/→ switch chapters, Esc closes settings
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false);
        return;
      }
      if (showSettings) return;
      if (e.key === 'ArrowRight' && volume && cIdx < volume.chapters.length - 1) gotoChapter(cIdx + 1, 1);
      if (e.key === 'ArrowLeft' && cIdx > 0) gotoChapter(cIdx - 1, -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSettings, vIdx, cIdx, volume, navigate, effects]);

  const formattedContent = useMemo(() => {
    if (!chapter) return [];
    return chapter.content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line, i) => {
        if (line.startsWith('# ') || line.startsWith('## ')) return null;
        return (
          <Reveal key={i} enabled={fx}>
            {line}
          </Reveal>
        );
      });
  }, [chapter, fx]);

  const hasNext = volume && cIdx < volume.chapters.length - 1;
  const hasPrev = cIdx > 0;
  const nextChapter = volume && hasNext ? volume.chapters[cIdx + 1] : null;
  const prevChapter = hasPrev ? volume!.chapters[cIdx - 1] : null;

  function gotoChapter(c: number, d: number) {
    if (fx) {
      window.dispatchEvent(new CustomEvent('xingling:warp'));
      sfx.playWarp();
    } else {
      sfx.playPageTurn();
    }
    navigate(`/read/${vIdx}/${c}`, { state: { dir: d } });
  }

  function onArticleClick(e: React.MouseEvent) {
    if (!fx) return;
    if ((e.target as HTMLElement).closest('a,button,input')) return;
    sfx.playClick();
    window.dispatchEvent(new CustomEvent('xingling:burst', { detail: { x: e.clientX, y: e.clientY } }));
  }

  if (!chapter || !volume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">章节未找到</p>
      </div>
    );
  }

  return (
    <div
      className="reader-shell"
      data-theme={theme}
      data-indent={indent}
      data-font={serif ? 'serif' : 'sans'}
      data-effects={effects}
    >
      {/* Reading progress with comet head */}
      <div className={`reader-progress ${progress > 1 ? 'reader-progress-lit' : ''}`} style={{ width: `${progress}%` }} />

      {/* Milestone toast */}
      <div className="reader-toast-wrap">
        {toast && <div className="reader-toast">{toast}</div>}
      </div>

      {/* Top bar — hides on scroll down, returns on scroll up */}
      <div
        className={`reader-topbar sticky top-0 z-50 backdrop-blur-md transition-transform duration-300 ${
          chromeVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/volumes"
              onClick={() => sfx.playClick()}
              className="reader-iconbtn p-2 rounded-lg transition-colors hover:scale-105 active:scale-95"
              aria-label="返回目录"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <p className="text-sm reader-accent truncate font-medium">《{volume.title}》</p>
              <p className="text-xs reader-muted truncate">{chapter.title}</p>
            </div>
          </div>
          <div className="relative shrink-0">
            <button
              onClick={() => {
                sfx.playClick();
                setShowSettings(!showSettings);
              }}
              className="reader-iconbtn p-2 rounded-lg transition-colors hover:scale-105 active:scale-95"
              aria-label="阅读设置"
            >
              <Settings className="w-5 h-5" />
            </button>
            {showSettings && (
              <div className="reader-panel absolute right-0 top-full mt-2 p-4 rounded-2xl shadow-2xl w-80 space-y-4 border border-cosmic-600/40 backdrop-blur-xl">
                {/* Visual effects toggle */}
                <div className="flex items-center justify-between text-xs">
                  <span className="reader-text flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    星空视觉动效
                  </span>
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setEffects(!effects);
                    }}
                    className={`reader-toggle w-9 h-5 rounded-full transition-colors ${effects ? 'reader-toggle-on' : ''}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        effects ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* SFX toggle */}
                <div className="flex items-center justify-between text-xs">
                  <span className="reader-text flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5" />
                    交互音效反馈
                  </span>
                  <button
                    onClick={() => {
                      const next = !sfxEnabled;
                      setSfx(next);
                      if (next) sfx.playClick();
                    }}
                    className={`reader-toggle w-9 h-5 rounded-full transition-colors ${sfxEnabled ? 'reader-toggle-on' : ''}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        sfxEnabled ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* BGM toggle */}
                <div className="flex items-center justify-between text-xs">
                  <span className="reader-text flex items-center gap-2">
                    <Music className="w-3.5 h-3.5" />
                    宇宙环境旋律 (BGM)
                  </span>
                  <button
                    onClick={() => {
                      sfx.unlockAudio();
                      const next = !bgmEnabled;
                      setBgm(next);
                    }}
                    className={`reader-toggle w-9 h-5 rounded-full transition-colors ${bgmEnabled ? 'reader-toggle-on' : ''}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        bgmEnabled ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="pt-2 border-t border-cosmic-700/40">
                  <div className="text-xs reader-muted flex items-center justify-between mb-1.5">
                    <span>音量</span>
                    <span>{Math.round(audioVol * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioVol}
                    onChange={(e) => setAudioVol(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg cursor-pointer appearance-none"
                    style={{ accentColor: 'var(--r-accent)' }}
                  />
                </div>

                {/* Theme options */}
                <div className="pt-2 border-t border-cosmic-700/40">
                  <div className="text-xs reader-muted mb-2">主题风格</div>
                  <div className="flex gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => {
                          sfx.playClick();
                          setTheme(t.value);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                          theme === t.value ? '' : 'reader-btn opacity-70 hover:opacity-100'
                        }`}
                        style={theme === t.value ? { boxShadow: `0 0 0 1.5px ${t.ring}`, color: 'var(--r-text)' } : undefined}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-current shrink-0"
                          style={{ background: t.dot }}
                        />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-xs reader-muted flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" />
                    字号 {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="28"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="w-full mt-1.5"
                    style={{ accentColor: 'var(--r-accent)' }}
                  />
                </div>

                {/* Line Height */}
                <div>
                  <div className="text-xs reader-muted mb-1.5">行距</div>
                  <div className="flex gap-1">
                    {LINE_HEIGHTS.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => {
                          sfx.playClick();
                          setLineHeight(l.value);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs transition-colors ${
                          lineHeight === l.value ? 'reader-btn-active' : 'reader-btn'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Indent & Serif */}
                <div className="flex items-center justify-between text-xs">
                  <span className="reader-text">首行缩进</span>
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setIndent(!indent);
                    }}
                    className={`reader-toggle w-9 h-5 rounded-full transition-colors ${indent ? 'reader-toggle-on' : ''}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        indent ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="reader-text">衬线字体</span>
                  <button
                    onClick={() => {
                      sfx.playClick();
                      setSerif(!serif);
                    }}
                    className={`reader-toggle w-9 h-5 rounded-full transition-colors ${serif ? 'reader-toggle-on' : ''}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                        serif ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <m.article
        key={`${vIdx}-${cIdx}`}
        initial={{ opacity: 0, y: dir ? 0 : 20, x: dir * 32 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onArticleClick}
        className="reader-article max-w-3xl mx-auto px-5 md:px-6 py-12"
        style={{ fontSize: `${fontSize}px`, lineHeight }}
      >
        <header
          className="text-center mb-12 pb-6 border-b"
          style={{ borderColor: 'var(--r-border)' }}
        >
          <p className="reader-muted text-sm mb-3">《{volume.title}》</p>
          <m.h1
            initial={{ opacity: 0, letterSpacing: '0.35em' }}
            animate={{ opacity: 1, letterSpacing: '0.02em' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="text-2xl md:text-3xl font-bold reader-text"
          >
            {chapter.title}
          </m.h1>
          <div className="reader-accent reader-divider mt-4 text-sm tracking-[0.5em]">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
          </div>
        </header>
        <div className="reader-body">{formattedContent}</div>

        {/* End-of-chapter continue card */}
        {nextChapter && (
          <button
            onMouseEnter={() => sfx.playHover()}
            onClick={() => gotoChapter(cIdx + 1, 1)}
            className="reader-btn reader-endcard block w-full text-center rounded-2xl py-5 mt-12 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border"
            style={{ borderColor: 'var(--r-border)' }}
          >
            <span className="reader-muted text-xs block mb-1.5 font-medium tracking-wide">
              ✦ 本章已阅 · 点击继续下篇 ✦
            </span>
            <span className="reader-accent text-base font-bold flex items-center justify-center gap-1.5">
              <span>{nextChapter.title}</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </button>
        )}
      </m.article>

      {/* Navigation Footer */}
      <div
        className="max-w-3xl mx-auto px-5 md:px-6 pb-16 flex items-center justify-between border-t pt-8"
        style={{ borderColor: 'var(--r-border)' }}
      >
        {prevChapter ? (
          <button
            onMouseEnter={() => sfx.playHover()}
            onClick={() => gotoChapter(cIdx - 1, -1)}
            className="reader-btn flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">上一章</span>
          </button>
        ) : (
          <div />
        )}

        <Link
          to="/volumes"
          onMouseEnter={() => sfx.playHover()}
          onClick={() => sfx.playClick()}
          className="text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ color: 'var(--r-accent)', background: 'var(--r-btn)' }}
        >
          返回卷列表
        </Link>

        {nextChapter ? (
          <button
            onMouseEnter={() => sfx.playHover()}
            onClick={() => gotoChapter(cIdx + 1, 1)}
            className="reader-btn flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <span className="text-sm font-medium">下一章</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
