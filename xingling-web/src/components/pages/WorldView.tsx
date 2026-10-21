import { useState } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { locations, artifacts, organizations, technologies } from '../../data/world';
import { races } from '../../data/characters';
import { ArrowLeft, MapPin, Sparkles, Globe, Building2, Cpu } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyText } from '../ui/ShinyText';
import { sfx } from '../../utils/sfx';

export function WorldView() {
  const [activeTab, setActiveTab] = useState<'locations' | 'artifacts' | 'organizations' | 'races' | 'tech'>('locations');

  const tabs = [
    { key: 'locations' as const, label: '地点', icon: MapPin },
    { key: 'artifacts' as const, label: '神器', icon: Sparkles },
    { key: 'organizations' as const, label: '组织', icon: Building2 },
    { key: 'races' as const, label: '种族', icon: Globe },
    { key: 'tech' as const, label: '科技', icon: Cpu },
  ];

  const TabIcon = tabs.find((t) => t.key === activeTab)?.icon || MapPin;

  // Group locations by type
  const locationTypes = [...new Set(locations.map((l) => l.type).filter(Boolean))];

  const handleTabChange = (key: typeof activeTab) => {
    sfx.playClick();
    setActiveTab(key);
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
            <ShinyText text="世界观" speed={6} />
            <span className="text-xs font-mono font-normal text-aurora-400 px-2.5 py-0.5 rounded-full bg-aurora-500/10 border border-aurora-500/20">
              ENCYCLOPEDIA
            </span>
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">
            探索星灵的世界 — {locations.length}个地点 · {artifacts.length}件神器 · {organizations.length}个组织
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-cosmic-600/40 pb-4">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-nebula-500/25 to-aurora-500/25 text-white border border-nebula-400/40 shadow-sm shadow-nebula-500/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-cosmic-700/40 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-nebula-300' : 'text-text-secondary'}`} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Locations */}
      {activeTab === 'locations' && (
        <div className="space-y-8">
          {locationTypes.map((type) => {
            const locs = locations.filter((l) => l.type === type);
            return (
              <div key={type}>
                <h3 className="text-lg font-bold text-text-accent mb-3 flex items-center gap-2">
                  <TabIcon className="w-4 h-4 text-star-400" />
                  {type}
                  <span className="text-xs text-text-secondary font-normal font-mono">
                    ({locs.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locs.map((loc, idx) => (
                    <m.div
                      key={loc.name}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <SpotlightCard
                        spotlightColor="rgba(56, 189, 248, 0.22)"
                        className="p-5 h-full border-cosmic-600/40 hover:border-star-400/50"
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-star-400 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="text-lg font-bold text-text-primary mb-1">
                              {loc.name}
                            </h4>
                            <p className="text-sm text-text-secondary leading-relaxed">
                              {loc.description}
                            </p>
                            {loc.volume && (
                              <span className="inline-block mt-3 text-xs px-2.5 py-0.5 rounded-full bg-cosmic-700/60 text-star-300 font-mono border border-cosmic-600/40">
                                第{loc.volume}卷
                              </span>
                            )}
                          </div>
                        </div>
                      </SpotlightCard>
                    </m.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Artifacts */}
      {activeTab === 'artifacts' && (
        <div className="space-y-8">
          {['星之键', '神器', '灵武', '药物', '通讯设备', '武器', '黑客工具', '力场系统', '能量', '材料', '能源', '装备', '纪念品'].map((type) => {
            const items = artifacts.filter((a) => a.type === type);
            if (items.length === 0) return null;
            return (
              <div key={type}>
                <h3 className="text-lg font-bold text-text-accent mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-aurora-400" />
                  {type}
                  <span className="text-xs text-text-secondary font-normal font-mono">
                    ({items.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((art, idx) => (
                    <m.div
                      key={art.name}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <SpotlightCard
                        spotlightColor="rgba(52, 211, 153, 0.22)"
                        className="p-5 h-full border-cosmic-600/40 hover:border-aurora-400/50"
                      >
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-aurora-400 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="text-lg font-bold text-text-primary mb-1">
                              {art.name}
                            </h4>
                            <p className="text-sm text-text-secondary leading-relaxed">
                              {art.description}
                            </p>
                          </div>
                        </div>
                      </SpotlightCard>
                    </m.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Organizations */}
      {activeTab === 'organizations' && (
        <div className="space-y-8">
          {['政府', '秘密组织', '反抗组织', '企业', '等级', '学术', '执法'].map((type) => {
            const orgs = organizations.filter((o) => o.type === type);
            if (orgs.length === 0) return null;
            return (
              <div key={type}>
                <h3 className="text-lg font-bold text-text-accent mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  {type}
                  <span className="text-xs text-text-secondary font-normal font-mono">
                    ({orgs.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orgs.map((org, idx) => (
                    <m.div
                      key={org.name}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <SpotlightCard
                        spotlightColor="rgba(251, 146, 60, 0.22)"
                        className="p-5 h-full border-cosmic-600/40 hover:border-amber-400/50"
                      >
                        <h4 className="text-lg font-bold text-text-primary mb-2">
                          {org.name}
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {org.description}
                        </p>
                      </SpotlightCard>
                    </m.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Races */}
      {activeTab === 'races' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {races.map((race, idx) => (
            <m.div
              key={race.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <SpotlightCard
                spotlightColor="rgba(167, 139, 250, 0.22)"
                className="p-6 h-full border-cosmic-600/40 hover:border-nebula-400/50"
              >
                <h3 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-nebula-400" />
                  {race.name}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {race.description}
                </p>
              </SpotlightCard>
            </m.div>
          ))}
        </div>
      )}

      {/* Technology */}
      {activeTab === 'tech' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technologies.map((tech, idx) => (
            <m.div
              key={tech.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <SpotlightCard
                spotlightColor="rgba(96, 165, 250, 0.22)"
                className="p-5 h-full border-cosmic-600/40 hover:border-star-400/50"
              >
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-star-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-text-primary mb-1">
                      {tech.name}
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </m.div>
          ))}
        </div>
      )}
    </div>
  );
}
