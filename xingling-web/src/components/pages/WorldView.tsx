import { useState } from 'react';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { locations, artifacts, organizations, technologies } from '../../data/world';
import { races } from '../../data/characters';
import { ArrowLeft, MapPin, Sparkles, Globe, Building2, Cpu } from 'lucide-react';

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

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">世界观</h1>
          <p className="text-text-secondary text-sm">探索星灵的世界 — {locations.length}个地点 · {artifacts.length}件神器 · {organizations.length}个组织</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-cosmic-600/30 pb-4">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === key
                ? 'bg-nebula-500/20 text-nebula-400'
                : 'text-text-secondary hover:bg-cosmic-700/30'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Locations */}
      {activeTab === 'locations' && (
        <div className="space-y-8">
          {locationTypes.map((type) => {
            const locs = locations.filter((l) => l.type === type);
            return (
              <div key={type}>
                <h3 className="text-lg font-bold text-text-accent mb-3 flex items-center gap-2">
                  <TabIcon className="w-5 h-5" />
                  {type}
                  <span className="text-sm text-text-secondary font-normal">({locs.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locs.map((loc, idx) => (
                    <m.div
                      key={loc.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-5 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30 hover:border-star-500/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-star-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-bold text-text-primary mb-1">{loc.name}</h4>
                          <p className="text-sm text-text-secondary leading-relaxed">{loc.description}</p>
                          {loc.volume && (
                            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-cosmic-600/50 text-text-accent">
                              第{loc.volume}卷
                            </span>
                          )}
                        </div>
                      </div>
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
                  <Sparkles className="w-5 h-5 text-aurora-400" />
                  {type}
                  <span className="text-sm text-text-secondary font-normal">({items.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((art, idx) => (
                    <m.div
                      key={art.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-5 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30 hover:border-aurora-500/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-aurora-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-lg font-bold text-text-primary mb-1">{art.name}</h4>
                          <p className="text-sm text-text-secondary leading-relaxed">{art.description}</p>
                        </div>
                      </div>
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
                  <Building2 className="w-5 h-5 text-star-400" />
                  {type}
                  <span className="text-sm text-text-secondary font-normal">({orgs.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orgs.map((org, idx) => (
                    <m.div
                      key={org.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-5 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30"
                    >
                      <h4 className="text-lg font-bold text-text-primary mb-2">{org.name}</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">{org.description}</p>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30"
            >
              <h3 className="text-xl font-bold text-text-primary mb-2">{race.name}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{race.description}</p>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-5 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30"
            >
              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 text-star-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-text-primary mb-1">{tech.name}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{tech.description}</p>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      )}
    </div>
  );
}
