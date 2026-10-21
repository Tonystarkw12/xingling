import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { characters, races } from '../../data/characters';
import { ArrowLeft, X, Zap, Heart } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyText } from '../ui/ShinyText';
import { DecryptedText } from '../ui/DecryptedText';
import { sfx } from '../../utils/sfx';

const RACE_SPOTLIGHTS: Record<string, string> = {
  '安吉拉': 'rgba(250, 204, 21, 0.25)', // Gold
  '卡普拉': 'rgba(244, 114, 182, 0.25)', // Pink
  '泰坦': 'rgba(249, 115, 22, 0.25)',   // Orange
  '精灵': 'rgba(52, 211, 153, 0.25)',   // Emerald
  '人类': 'rgba(96, 165, 250, 0.25)',   // Sky
};

export function CharacterBook() {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [novelFilter, setNovelFilter] = useState<'all' | 'main' | 'otherworld'>('all');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const filtered = characters
    .filter((c) => {
      if (novelFilter === 'main' && c.isSideStory) return false;
      if (novelFilter === 'otherworld' && !c.isSideStory) return false;
      if (selectedRace && c.race !== selectedRace) return false;
      return true;
    });

  const selected = characters.find((character) => character.name === selectedChar) ?? null;

  const handleCharClick = (charName: string) => {
    sfx.playCardSelect();
    setSelectedChar(charName);
  };

  const handleCloseModal = () => {
    sfx.playClick();
    setSelectedChar(null);
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
            <ShinyText text="人物图鉴" speed={6} />
            <span className="text-xs font-mono font-normal text-star-400 px-2.5 py-0.5 rounded-full bg-star-500/10 border border-star-500/20">
              {characters.length} CHARACTERS
            </span>
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">
            探索星灵世界中的众生相 · 四大种族与千年来交织的命运
          </p>
        </div>
      </div>

            {/* Novel Source Switcher */}
      <div className="flex items-center gap-2 mb-4 p-1 rounded-2xl bg-cosmic-800/60 border border-cosmic-600/40 w-fit">
        <button
          onClick={() => {
            sfx.playClick();
            setNovelFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            novelFilter === 'all'
              ? 'bg-nebula-500 text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          全部角色 ({characters.length})
        </button>
        <button
          onClick={() => {
            sfx.playClick();
            setNovelFilter('main');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            novelFilter === 'main'
              ? 'bg-nebula-500 text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          正传 (16卷)
        </button>
        <button
          onClick={() => {
            sfx.playClick();
            setNovelFilter('otherworld');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            novelFilter === 'otherworld'
              ? 'bg-gradient-to-r from-nebula-500 to-star-500 text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <span>外传 · 境界彼方</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/20">6</span>
        </button>
      </div>
      {/* Race Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            sfx.playClick();
            setSelectedRace(null);
          }}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
            !selectedRace
              ? 'bg-gradient-to-r from-nebula-500 to-star-500 text-white shadow-md shadow-nebula-500/30 scale-105'
              : 'bg-cosmic-700/50 text-text-secondary hover:bg-cosmic-600/60 hover:text-text-primary border border-cosmic-600/40'
          }`}
        >
          全部 ({characters.length})
        </button>
        {races.map((race) => {
          const count = characters.filter((c) => c.race === race.name).length;
          if (count === 0) return null;
          const isSelected = selectedRace === race.name;
          return (
            <button
              key={race.name}
              onClick={() => {
                sfx.playClick();
                setSelectedRace(race.name);
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                isSelected
                  ? 'bg-nebula-500 text-white shadow-md shadow-nebula-500/30 scale-105'
                  : 'bg-cosmic-700/50 text-text-secondary hover:bg-cosmic-600/60 hover:text-text-primary border border-cosmic-600/40'
              }`}
            >
              {race.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((char, idx) => {
          const spotlight = RACE_SPOTLIGHTS[char.race] || 'rgba(167, 139, 250, 0.22)';
          return (
            <m.div
              key={char.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.02 }}
              onClick={() => handleCharClick(char.name)}
              className="cursor-pointer"
            >
              <SpotlightCard
                spotlightColor={spotlight}
                className="p-5 h-full flex flex-col justify-between border-cosmic-600/40 hover:border-nebula-400/50"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-nebula-500 to-star-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md shadow-nebula-500/20">
                      {char.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-text-primary truncate">
                        {char.name}
                      </h3>
                      <p className="text-xs text-nebula-400 font-medium">
                        {char.race} · {char.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                    {char.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-cosmic-700/40">
                  {char.isSideStory && (
                    <span className="px-2 py-0.5 rounded-full bg-nebula-500/20 text-nebula-300 text-[11px] font-mono border border-nebula-500/30">
                      外传 · 境界彼方
                    </span>
                  )}
                  {char.volumes.filter((v) => v > 0).slice(0, 5).map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded-full bg-cosmic-700/60 text-text-secondary text-[11px] font-mono border border-cosmic-600/30"
                    >
                      第{v}卷
                    </span>
                  ))}
                  {char.volumes.length > 5 && (
                    <span className="text-[11px] text-text-secondary self-center">
                      +{char.volumes.length - 5}
                    </span>
                  )}
                </div>
              </SpotlightCard>
            </m.div>
          );
        })}
      </div>

      {/* Character Detail Modal */}
      <AnimatePresence>
        {selected && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <m.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cosmic-800/95 rounded-2xl border border-cosmic-600/60 max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-nebula-500 to-star-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg shadow-nebula-500/25">
                    {selected.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                      <span>{selected.name}</span>
                      {selected.alias && (
                        <span className="text-sm text-text-secondary font-normal">
                          ({selected.alias})
                        </span>
                      )}
                    </h2>
                    <div className="text-sm text-nebula-400 font-medium">
                      <DecryptedText
                        text={`${selected.race} · ${selected.role}`}
                        speed={30}
                        maxIterations={6}
                        animateOn="mount"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-xl bg-cosmic-700/50 hover:bg-cosmic-700 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-text-primary/95 leading-relaxed mb-4 text-sm md:text-base">
                {selected.description}
              </p>

              {selected.abilities && (
                <div className="flex items-center gap-2.5 mb-4 p-3.5 rounded-xl bg-cosmic-700/40 border border-cosmic-600/30">
                  <Zap className="w-4 h-4 text-nebula-400 flex-shrink-0 animate-pulse" />
                  <span className="text-xs text-nebula-400 font-bold uppercase tracking-wider">
                    权能:
                  </span>
                  <span className="text-xs text-text-primary font-medium">
                    {selected.abilities}
                  </span>
                </div>
              )}

              {selected.relationships && selected.relationships.length > 0 && (
                <div className="flex items-start gap-2.5 mb-4 p-3.5 rounded-xl bg-cosmic-700/40 border border-cosmic-600/30">
                  <Heart className="w-4 h-4 text-aurora-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-aurora-400 font-bold uppercase tracking-wider">
                      人物羁绊:
                    </span>
                    <ul className="text-xs text-text-secondary mt-1.5 space-y-1">
                      {selected.relationships.map((rel) => (
                        <li key={rel} className="leading-relaxed">
                          · {rel}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-cosmic-700/50">
                <span className="text-xs text-text-secondary font-medium">登场卷轴:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selected.volumes.map((v) => (
                    <span
                      key={v}
                      className="px-2.5 py-0.5 rounded-full bg-cosmic-700/80 text-text-secondary text-xs font-mono border border-cosmic-600/40"
                    >
                      第{v}卷
                    </span>
                  ))}
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
