import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { characters, races } from '../../data/characters';
import { ArrowLeft, X, Zap, Heart } from 'lucide-react';

export function CharacterBook() {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);

  const filtered = selectedRace
    ? characters.filter((c) => c.race === selectedRace)
    : characters;

  const selected = selectedChar !== null ? filtered[selectedChar] : null;

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">人物图鉴</h1>
          <p className="text-text-secondary text-sm">{characters.length}个角色 · 探索星灵世界中的众生相</p>
        </div>
      </div>

      {/* Race Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedRace(null)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            !selectedRace
              ? 'bg-nebula-500 text-white'
              : 'bg-cosmic-700/50 text-text-secondary hover:bg-cosmic-600/50'
          }`}
        >
          全部 ({characters.length})
        </button>
        {races.map((race) => {
          const count = characters.filter((c) => c.race === race.name).length;
          if (count === 0) return null;
          return (
            <button
              key={race.name}
              onClick={() => setSelectedRace(race.name)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedRace === race.name
                  ? 'bg-nebula-500 text-white'
                  : 'bg-cosmic-700/50 text-text-secondary hover:bg-cosmic-600/50'
              }`}
            >
              {race.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((char, idx) => (
          <motion.button
            key={idx}
            onClick={() => setSelectedChar(idx)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03 }}
            className="p-5 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30 hover:border-nebula-500/30 transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nebula-500 to-star-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {char.name[0]}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-text-primary truncate">{char.name}</h3>
                <p className="text-xs text-text-accent">{char.race} · {char.role}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2">
              {char.description.substring(0, 80)}...
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {char.volumes.slice(0, 5).map((v) => (
                <span
                  key={v}
                  className="px-1.5 py-0.5 rounded-full bg-cosmic-600/30 text-text-secondary text-xs"
                >
                  第{v}卷
                </span>
              ))}
              {char.volumes.length > 5 && (
                <span className="text-xs text-text-secondary">+{char.volumes.length - 5}</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Character Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedChar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cosmic-800 rounded-2xl border border-cosmic-600/50 max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-nebula-500 to-star-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {selected.name[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      {selected.name}
                      {selected.alias && (
                        <span className="text-sm text-text-secondary font-normal ml-2">
                          ({selected.alias})
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-text-accent">
                      {selected.race} · {selected.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChar(null)}
                  className="p-1 rounded-lg hover:bg-cosmic-700/50"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <p className="text-text-primary/90 leading-relaxed mb-4">
                {selected.description}
              </p>

              {selected.abilities && (
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-cosmic-700/30">
                  <Zap className="w-4 h-4 text-nebula-400" />
                  <span className="text-sm text-nebula-400 font-medium">权能:</span>
                  <span className="text-sm text-text-secondary">
                    {selected.abilities}
                  </span>
                </div>
              )}

              {selected.relationships && selected.relationships.length > 0 && (
                <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-cosmic-700/30">
                  <Heart className="w-4 h-4 text-aurora-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-aurora-400 font-medium">人物关系:</span>
                    <ul className="text-sm text-text-secondary mt-1 space-y-0.5">
                      {selected.relationships.map((rel, i) => (
                        <li key={i}>· {rel}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm text-text-secondary">登场卷:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selected.volumes.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 rounded-full bg-cosmic-600/50 text-text-secondary text-xs"
                    >
                      第{v}卷
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
