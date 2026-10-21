import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { volumes } from '../../data/novel';
import { useStore } from '../../store';
import { ChevronRight, BookOpen, ArrowLeft, Sparkles } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyText } from '../ui/ShinyText';
import { sfx } from '../../utils/sfx';

const volumeThemes: Record<number, { gradient: string; accent: string; spotlight: string; icon: string }> = {
  0: { gradient: 'from-blue-600 to-cyan-400', accent: 'text-cyan-400', spotlight: 'rgba(34, 211, 238, 0.22)', icon: '❄️' },
  1: { gradient: 'from-purple-600 to-pink-400', accent: 'text-pink-400', spotlight: 'rgba(244, 114, 182, 0.22)', icon: '🌪️' },
  2: { gradient: 'from-green-600 to-emerald-400', accent: 'text-emerald-400', spotlight: 'rgba(52, 211, 153, 0.22)', icon: '💊' },
  3: { gradient: 'from-sky-500 to-blue-300', accent: 'text-sky-300', spotlight: 'rgba(125, 211, 252, 0.22)', icon: '💙' },
  4: { gradient: 'from-amber-600 to-orange-400', accent: 'text-orange-400', spotlight: 'rgba(251, 146, 60, 0.22)', icon: '🏠' },
  5: { gradient: 'from-green-700 to-lime-400', accent: 'text-lime-400', spotlight: 'rgba(163, 230, 53, 0.22)', icon: '🌲' },
  6: { gradient: 'from-violet-600 to-purple-400', accent: 'text-purple-400', spotlight: 'rgba(192, 132, 252, 0.22)', icon: '🚪' },
  7: { gradient: 'from-indigo-600 to-violet-400', accent: 'text-violet-400', spotlight: 'rgba(167, 139, 250, 0.22)', icon: '🔮' },
  8: { gradient: 'from-teal-600 to-cyan-400', accent: 'text-cyan-400', spotlight: 'rgba(45, 212, 191, 0.22)', icon: '🌊' },
  9: { gradient: 'from-gray-600 to-slate-400', accent: 'text-slate-400', spotlight: 'rgba(148, 163, 184, 0.22)', icon: '👤' },
  10: { gradient: 'from-red-600 to-orange-400', accent: 'text-red-400', spotlight: 'rgba(248, 113, 113, 0.22)', icon: '⚡' },
  11: { gradient: 'from-orange-600 to-yellow-400', accent: 'text-yellow-400', spotlight: 'rgba(250, 204, 21, 0.22)', icon: '🔥' },
  12: { gradient: 'from-rose-600 to-pink-400', accent: 'text-rose-400', spotlight: 'rgba(251, 113, 133, 0.22)', icon: '💔' },
  13: { gradient: 'from-yellow-500 to-amber-300', accent: 'text-amber-300', spotlight: 'rgba(252, 211, 77, 0.22)', icon: '🤝' },
  14: { gradient: 'from-blue-800 to-indigo-600', accent: 'text-indigo-400', spotlight: 'rgba(129, 140, 248, 0.22)', icon: '🌙' },
  15: { gradient: 'from-slate-800 to-gray-600', accent: 'text-gray-400', spotlight: 'rgba(156, 163, 175, 0.22)', icon: '⭐' },
};

export function VolumeSelector() {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const { readingProgress } = useStore();

  const handleSelectVolume = (idx: number) => {
    sfx.playCardSelect();
    setSelectedVolume(selectedVolume === idx ? null : idx);
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          onClick={() => sfx.playClick()}
          className="p-2.5 rounded-xl bg-cosmic-700/50 hover:bg-cosmic-600/60 border border-cosmic-600/40 text-text-primary transition-all hover:scale-105 active:scale-95"
          aria-label="返回首页"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <ShinyText text="选择卷" speed={6} />
            <span className="text-xs font-mono font-normal text-nebula-400 px-2.5 py-0.5 rounded-full bg-nebula-500/10 border border-nebula-500/20">
              16 VOLUMES
            </span>
          </h1>
          {readingProgress && (
            <p className="text-text-secondary text-sm mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-nebula-400" />
              上次阅读至 第{readingProgress.volume + 1}卷 第{readingProgress.chapter + 1}章
            </p>
          )}
        </div>
      </div>

      {/* Gaiden Banner */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cosmic-800/90 via-nebula-950/50 to-cosmic-800/90 border border-nebula-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-nebula-500/20 border border-nebula-500/30 flex items-center justify-center text-nebula-300 shrink-0">
            <Sparkles className="w-5 h-5 text-nebula-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-nebula-300 flex items-center gap-2">
              <span>官方独立外传</span>
              <span className="text-[10px] font-mono text-star-400 bg-star-500/10 px-2 py-0.5 rounded-full border border-star-500/20">
                THE OTHER WORLD
              </span>
            </div>
            <p className="text-sm font-semibold text-text-primary mt-0.5">
              《境界彼方》— 78万光年深空先驱孤航史诗 · 全六章精修典藏版
            </p>
          </div>
        </div>
        <Link
          to="/otherworld"
          onClick={() => sfx.playClick()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-nebula-500 to-star-500 hover:from-nebula-400 hover:to-star-400 text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-nebula-500/20"
        >
          <span>进入外传</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>


      {/* Volume Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {volumes.map((volume, idx) => {
          const theme = volumeThemes[idx] || volumeThemes[0];
          const isSelected = selectedVolume === idx;
          const chapterCount = volume.chapters.length;

          return (
            <m.div
              key={volume.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="cursor-pointer"
              onClick={() => handleSelectVolume(idx)}
            >
              <SpotlightCard
                spotlightColor={theme.spotlight}
                className={`p-5 transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-nebula-400/80 bg-cosmic-700/80 shadow-lg shadow-nebula-500/20'
                    : 'bg-cosmic-800/40 hover:bg-cosmic-700/40'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl filter drop-shadow">{theme.icon}</span>
                  {readingProgress?.volume === idx ? (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-nebula-500/25 text-nebula-300 border border-nebula-500/30 animate-pulse">
                      继续阅读
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-text-secondary/80">
                      VOL.{idx + 1}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1 tracking-tight">
                  {volume.title}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-secondary">
                    {chapterCount} 个章节
                  </span>
                  <span className={`text-xs font-medium ${theme.accent}`}>
                    {isSelected ? '展开中 ▼' : '点击浏览 →'}
                  </span>
                </div>
              </SpotlightCard>
            </m.div>
          );
        })}
      </div>

      {/* Chapter List Modal/Drawer */}
      <AnimatePresence>
        {selectedVolume !== null && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="mt-8 bg-cosmic-800/90 rounded-2xl border border-cosmic-600/50 overflow-hidden shadow-2xl backdrop-blur-xl"
          >
            <div className="p-6 border-b border-cosmic-600/40 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                  <span>{volumeThemes[selectedVolume]?.icon}</span>
                  <span>{volumes[selectedVolume].title}</span>
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  共 {volumes[selectedVolume].chapters.length} 章 · 点击章节进入沉浸阅读
                </p>
              </div>
              <button
                onClick={() => {
                  sfx.playClick();
                  setSelectedVolume(null);
                }}
                className="text-xs text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-700 transition-colors"
              >
                收起列表
              </button>
            </div>
            <div className="p-4 max-h-[28rem] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {volumes[selectedVolume].chapters.map((chapter, chIdx) => (
                <Link
                  key={chIdx}
                  to={`/read/${selectedVolume}/${chIdx}`}
                  onMouseEnter={() => sfx.playHover()}
                  onClick={() => {
                    sfx.playPageTurn();
                    useStore.getState().setProgress(selectedVolume, chIdx);
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-cosmic-700/30 hover:bg-cosmic-600/50 border border-cosmic-600/20 hover:border-nebula-500/40 transition-all group"
                >
                  <BookOpen className="w-4 h-4 text-nebula-400 group-hover:text-nebula-300 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="text-text-primary text-sm font-medium flex-1 truncate">
                    {chapter.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-nebula-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
