import { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Sparkles, Sliders, X } from 'lucide-react';
import { useSettings } from '../../store';
import { sfx } from '../../utils/sfx';

export function AudioController() {
  const { sfx: sfxEnabled, bgm: bgmEnabled, volume, setSfx, setBgm, setVolume } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleSfx = () => {
    const next = !sfxEnabled;
    setSfx(next);
    if (next) {
      setTimeout(() => sfx.playClick(), 50);
    }
  };

  const toggleBgm = () => {
    sfx.unlockAudio();
    const next = !bgmEnabled;
    setBgm(next);
    if (next) {
      sfx.playChime();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  const isMuted = !sfxEnabled && !bgmEnabled;

  return (
    <div ref={panelRef} className="fixed bottom-5 right-5 z-40 select-none">
      {/* Popover Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-3 w-72 rounded-2xl border border-cosmic-600/60 bg-cosmic-900/90 p-4 shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cosmic-700/60">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-nebula-400" />
                <span className="text-sm font-semibold text-text-primary tracking-wide">
                  星际音频中枢
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-cosmic-700/50 transition-colors"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Controls */}
            <div className="mt-4 space-y-4">
              {/* SFX Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-star-400" />
                  <span className="text-xs text-text-primary font-medium">交互音效</span>
                </div>
                <button
                  onClick={toggleSfx}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sfxEnabled ? 'bg-nebula-500' : 'bg-cosmic-700'
                  }`}
                  aria-label="切换交互音效"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sfxEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* BGM Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-aurora-400" />
                  <div>
                    <span className="text-xs text-text-primary font-medium">星空旋律</span>
                    {bgmEnabled && (
                      <span className="block text-[10px] text-aurora-400/80 animate-pulse">
                        播放中 · Episode 1
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={toggleBgm}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    bgmEnabled ? 'bg-aurora-500' : 'bg-cosmic-700'
                  }`}
                  aria-label="切换背景音乐"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      bgmEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Master Volume */}
              <div className="pt-2 border-t border-cosmic-700/40">
                <div className="flex items-center justify-between text-xs text-text-secondary mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-text-secondary" />
                    <span>主音量</span>
                  </div>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-nebula-400 h-1.5 bg-cosmic-700 rounded-lg cursor-pointer appearance-none"
                />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Trigger Pill Button */}
      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sfx.unlockAudio();
          sfx.playClick();
          setIsOpen(!isOpen);
        }}
        className={`group flex items-center gap-2 px-3 py-2 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 ${
          bgmEnabled
            ? 'bg-nebula-600/30 border-nebula-400/50 shadow-nebula-500/20 text-nebula-300'
            : isMuted
            ? 'bg-cosmic-800/80 border-cosmic-600/50 text-text-secondary hover:text-text-primary'
            : 'bg-cosmic-800/90 border-cosmic-600/60 text-text-primary hover:border-nebula-500/40'
        }`}
        aria-label="音频设置"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-text-secondary" />
        ) : bgmEnabled ? (
          <div className="flex items-end gap-0.5 h-4 w-4 pb-0.5 justify-center">
            <span className="w-0.5 h-2.5 bg-aurora-400 rounded-full animate-equalizer-1" />
            <span className="w-0.5 h-3.5 bg-aurora-400 rounded-full animate-equalizer-2" />
            <span className="w-0.5 h-1.5 bg-aurora-400 rounded-full animate-equalizer-3" />
          </div>
        ) : (
          <Volume2 className="w-4 h-4 text-nebula-400 group-hover:scale-110 transition-transform" />
        )}
        <span className="text-xs font-medium pr-0.5">
          {bgmEnabled ? '旋律奏鸣' : sfxEnabled ? '音效已开' : '静音'}
        </span>
      </m.button>
    </div>
  );
}
