import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { volumes } from '../../data/novel';
import { useStore } from '../../store';
import { ChevronRight, BookOpen, ArrowLeft } from 'lucide-react';

const volumeThemes: Record<number, { gradient: string; accent: string; icon: string }> = {
  0: { gradient: 'from-blue-600 to-cyan-400', accent: 'text-cyan-400', icon: '❄️' },
  1: { gradient: 'from-purple-600 to-pink-400', accent: 'text-pink-400', icon: '🌪️' },
  2: { gradient: 'from-green-600 to-emerald-400', accent: 'text-emerald-400', icon: '💊' },
  3: { gradient: 'from-sky-500 to-blue-300', accent: 'text-sky-300', icon: '💙' },
  4: { gradient: 'from-amber-600 to-orange-400', accent: 'text-orange-400', icon: '🏠' },
  5: { gradient: 'from-green-700 to-lime-400', accent: 'text-lime-400', icon: '🌲' },
  6: { gradient: 'from-violet-600 to-purple-400', accent: 'text-purple-400', icon: '🚪' },
  7: { gradient: 'from-indigo-600 to-violet-400', accent: 'text-violet-400', icon: '🔮' },
  8: { gradient: 'from-teal-600 to-cyan-400', accent: 'text-cyan-400', icon: '🌊' },
  9: { gradient: 'from-gray-600 to-slate-400', accent: 'text-slate-400', icon: '👤' },
  10: { gradient: 'from-red-600 to-orange-400', accent: 'text-red-400', icon: '⚡' },
  11: { gradient: 'from-orange-600 to-yellow-400', accent: 'text-yellow-400', icon: '🔥' },
  12: { gradient: 'from-rose-600 to-pink-400', accent: 'text-rose-400', icon: '💔' },
  13: { gradient: 'from-yellow-500 to-amber-300', accent: 'text-amber-300', icon: '🤝' },
  14: { gradient: 'from-blue-800 to-indigo-600', accent: 'text-indigo-400', icon: '🌙' },
  15: { gradient: 'from-slate-800 to-gray-600', accent: 'text-gray-400', icon: '⭐' },
};

export function VolumeSelector() {
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);
  const { readingProgress } = useStore();

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">选择卷</h1>
          {readingProgress && (
            <p className="text-text-secondary text-sm mt-1">
              上次阅读至 第{readingProgress.volume + 1}卷 第{readingProgress.chapter + 1}章
            </p>
          )}
        </div>
      </div>

      {/* Volume Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {volumes.map((volume, idx) => {
          const theme = volumeThemes[idx] || volumeThemes[0];
          const isSelected = selectedVolume === idx;
          const chapterCount = volume.chapters.length;

          return (
            <m.button
              key={volume.title}
              onClick={() => setSelectedVolume(isSelected ? null : idx)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-5 rounded-xl border text-left transition-all duration-300 ${
                isSelected
                  ? 'bg-cosmic-600/80 border-nebula-500/50 shadow-lg shadow-nebula-500/20'
                  : 'bg-cosmic-700/30 border-cosmic-600/30 hover:bg-cosmic-700/50 hover:border-cosmic-500/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-2xl`}>{theme.icon}</span>
                {readingProgress?.volume === idx && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-nebula-500/20 text-nebula-400">
                    继续阅读
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-1">
                {volume.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {chapterCount} 章
              </p>
            </m.button>
          );
        })}
      </div>

      {/* Chapter List */}
      <AnimatePresence>
        {selectedVolume !== null && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 bg-cosmic-800/80 rounded-2xl border border-cosmic-600/30 overflow-hidden"
          >
            <div className="p-6 border-b border-cosmic-600/30">
              <h2 className="text-2xl font-bold text-text-primary">
                {volumes[selectedVolume].title}
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                共 {volumes[selectedVolume].chapters.length} 章
              </p>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
              {volumes[selectedVolume].chapters.map((chapter, chIdx) => (
                <Link
                  key={chIdx}
                  to={`/read/${selectedVolume}/${chIdx}`}
                  onClick={() => useStore.getState().setProgress(selectedVolume, chIdx)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-cosmic-700/30 hover:bg-cosmic-600/50 transition-colors group"
                >
                  <BookOpen className="w-4 h-4 text-nebula-400 group-hover:text-nebula-300" />
                  <span className="text-text-primary text-sm flex-1 truncate">
                    {chapter.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-nebula-400 transition-colors" />
                </Link>
              ))}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
