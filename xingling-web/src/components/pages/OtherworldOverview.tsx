import { useState } from 'react';
import { m } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { otherworldData } from '../../data/otherworld';
import { useStore } from '../../store';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Compass,
  Radio,
  Clock,
  CheckCircle2,
  Bookmark,
  Users,
  Globe,
  Star,
  ChevronRight,
} from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyText } from '../ui/ShinyText';
import { DecryptedText } from '../ui/DecryptedText';
import { BlurText } from '../ui/BlurText';
import { sfx } from '../../utils/sfx';

export function OtherworldOverview() {
  const navigate = useNavigate();
  const { otherworldProgress, completedOtherworldChapters } = useStore();
  const [activeTab, setActiveTab] = useState<'chapters' | 'characters' | 'lore'>('chapters');

  const continueChapter = otherworldProgress ?? 0;
  const isStarted = otherworldProgress !== null;
  const completedCount = completedOtherworldChapters.length;
  const totalChapters = otherworldData.chapters.length;

  const characters = [
    {
      name: '艾丝特 (Esther)',
      role: '外传主角 / 深空先驱 / 阿波罗号舰长',
      tag: '先驱者',
      desc: '黄金圣城耶路纳德尔名门与群星教大主教之女。不甘于被规训的温室，考入卡罗拉多大学师从开普勒教授，驾驶阿波罗号独自穿越78万光年拉尼亚星云。在绝望与苦难中坚守至彼方。',
      icon: '✨',
    },
    {
      name: '开普勒教授 (Kepler)',
      role: '天体物理学泰斗 / “境界彼方”理论创立者',
      tag: '学者',
      desc: '星灵纪元1857年以色散与引力透镜模型论证了拉尼亚星云外隐秘星系的存在。痛失参与首批先遣队的亲生女儿，后将女儿留下的星芒项链赠予艾丝特，毕生守望星海。',
      icon: '🔭',
    },
    {
      name: '罗素 (Russell)',
      role: '阿波罗号伴生高维量子AI',
      tag: '人工智能',
      desc: '阿波罗号的伴生人工智能。在艾丝特濒临精神崩溃与自绝的危难关头，超频并牺牲认知算力为艾丝特提供全息慰藉与生存希望，展现超越机器逻辑的温柔守护。',
      icon: '🤖',
    },
    {
      name: '霍普 (Hope)',
      role: '艾丝特的爱犬 / 忠诚伙伴',
      tag: '伴侣生灵',
      desc: '艾丝特深空航行中唯一的生物伴侣，一只雪白的小狗。在频繁出入曲率泡的时空应力下衰老离世，成为艾丝特深空孤航中最痛心的割舍。',
      icon: '🐕',
    },
  ];

  const loreItems = [
    {
      name: '拉尼亚星云 (Rania Nebula)',
      category: '星域',
      desc: '包裹着拉提麦尔星系的巨大游离气体与高能尘埃星云，内部充斥着狂暴无序的暗物质力场与量子退相干死区，横跨七十八万光年，曾吞噬五批探索先遣队。',
    },
    {
      name: '耶路纳德尔 (Jerunader)',
      category: '黄金圣城',
      desc: '萨尔扎哈地区悬浮于云端之上的“黄金圣城”，群星教的圣地。建有直插苍穹的巴别塔黄金阶梯，艾丝特的故乡。',
    },
    {
      name: '阿波罗号 (Apollo)',
      category: '深空星舰',
      desc: '搭载紫晶曲率引擎与高维量子AI罗素的远征旗舰，艾丝特驾驶它完成拉尼亚星云的终极穿越。',
    },
    {
      name: '境界彼方 (The Other World)',
      category: '终极彼岸',
      desc: '开普勒教授在星灵纪元1857年推算出的隐秘星系。终点并不像想象的那么重要，真正的“境界彼方”是穿越整场黑暗旅途的心灵蜕变。',
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto relative z-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          to="/"
          onClick={() => sfx.playClick()}
          className="p-2.5 rounded-xl bg-cosmic-700/50 hover:bg-cosmic-600/60 border border-cosmic-600/40 text-text-primary transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
          aria-label="返回首页"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">星灵主站</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/volumes"
            onClick={() => sfx.playClick()}
            className="px-3 py-1.5 rounded-xl bg-cosmic-700/40 hover:bg-cosmic-600/50 border border-cosmic-600/30 text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-nebula-400" />
            <span>正传目录 (16卷)</span>
          </Link>
          <Link
            to={`/otherworld/read/${continueChapter}`}
            onClick={() => sfx.playClick()}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-nebula-500 to-star-500 hover:from-nebula-400 hover:to-star-400 text-white text-xs font-semibold shadow-md shadow-nebula-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isStarted ? `继续阅读 · 第${continueChapter + 1}章` : '从头开始阅读'}</span>
          </Link>
        </div>
      </div>

      {/* Hero Banner Section */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 relative"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-nebula-500/40 bg-nebula-500/10 backdrop-blur-md mb-4 shadow-sm shadow-nebula-500/20">
          <Sparkles className="w-3.5 h-3.5 text-nebula-400 animate-pulse" />
          <span className="text-xs font-medium text-nebula-300 tracking-wider">
            {otherworldData.series} · {otherworldData.badge}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tight drop-shadow-[0_0_30px_rgba(167,139,250,0.3)]">
          <ShinyText text={otherworldData.title} speed={5} className="font-serif tracking-wider" />
        </h1>

        <div className="h-7 flex items-center justify-center mb-3">
          <DecryptedText
            text={otherworldData.englishTitle.toUpperCase()}
            speed={35}
            maxIterations={8}
            className="text-sm md:text-lg text-star-300 font-mono tracking-[0.3em]"
            encryptedClassName="text-nebula-400/60"
            animateOn="mount"
          />
        </div>

        <div className="flex justify-center mt-2 mb-6">
          <BlurText
            text={otherworldData.subtitle}
            delay={25}
            className="text-sm md:text-base text-text-secondary max-w-2xl text-center font-medium"
            animateBy="words"
            direction="top"
          />
        </div>

        {/* Stats Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-2.5 rounded-2xl bg-cosmic-800/70 border border-cosmic-600/40 backdrop-blur-md text-xs text-text-secondary">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-nebula-400" />
            <span>全 <strong className="text-text-primary">{otherworldData.meta.totalChapters}</strong> 章精修</span>
          </div>
          <span className="text-cosmic-600">|</span>
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-star-400" />
            <span>约 <strong className="text-text-primary">{otherworldData.meta.totalWords.toLocaleString()}</strong> 字</span>
          </div>
          <span className="text-cosmic-600">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-aurora-400" />
            <span>深空航程 <strong className="text-text-primary">{otherworldData.meta.timeline}</strong></span>
          </div>
          {completedCount > 0 && (
            <>
              <span className="text-cosmic-600">|</span>
              <div className="flex items-center gap-1.5 text-nebula-300">
                <CheckCircle2 className="w-4 h-4 text-nebula-400" />
                <span>已读 <strong className="text-white">{completedCount}/{totalChapters}</strong> 章</span>
              </div>
            </>
          )}
        </div>
      </m.div>

      {/* Epigraph Quotation Card */}
      <m.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-b from-cosmic-800/80 to-cosmic-900/90 border border-nebula-500/30 shadow-xl backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-nebula-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -top-8 w-48 h-48 bg-star-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-nebula-400 flex items-center gap-2">
              <Star className="w-3.5 h-3.5" />
              <span>先驱箴言 · 罗曼·耶和华</span>
            </div>
            <p className="text-lg md:text-xl font-serif text-text-primary italic leading-relaxed">
              “{otherworldData.epigraph.text}”
            </p>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-3xl">
              {otherworldData.closingEpigraph.text}
            </p>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              navigate(`/otherworld/read/${continueChapter}`);
            }}
            className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-nebula-500 to-star-500 hover:from-nebula-400 hover:to-star-400 text-white font-medium text-sm shadow-lg shadow-nebula-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>{isStarted ? '继续深空航程' : '踏上深空孤航'}</span>
          </button>
        </div>
      </m.div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-cosmic-600/40 mb-8">
        <button
          onClick={() => {
            sfx.playClick();
            setActiveTab('chapters');
          }}
          className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === 'chapters'
              ? 'text-nebula-300'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>章节目录 ({otherworldData.chapters.length})</span>
          {activeTab === 'chapters' && (
            <m.div
              layoutId="otherworld-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nebula-400 to-star-400"
            />
          )}
        </button>

        <button
          onClick={() => {
            sfx.playClick();
            setActiveTab('characters');
          }}
          className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === 'characters'
              ? 'text-nebula-300'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>核心人物 ({characters.length})</span>
          {activeTab === 'characters' && (
            <m.div
              layoutId="otherworld-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nebula-400 to-star-400"
            />
          )}
        </button>

        <button
          onClick={() => {
            sfx.playClick();
            setActiveTab('lore');
          }}
          className={`pb-3 px-4 text-sm font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === 'lore'
              ? 'text-nebula-300'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>世界观设定 ({loreItems.length})</span>
          {activeTab === 'lore' && (
            <m.div
              layoutId="otherworld-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-nebula-400 to-star-400"
            />
          )}
        </button>
      </div>

      {/* Tab 1: Chapters Grid */}
      {activeTab === 'chapters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {otherworldData.chapters.map((chapter, idx) => {
            const isCompleted = completedOtherworldChapters.includes(idx);
            const isCurrent = otherworldProgress === idx;

            return (
              <Link
                key={chapter.id}
                to={`/otherworld/read/${idx}`}
                onClick={() => sfx.playCardSelect()}
                className="group block"
              >
                <SpotlightCard
                  spotlightColor="rgba(167, 139, 250, 0.22)"
                  className="h-full p-6 flex flex-col justify-between border-cosmic-600/40 hover:border-nebula-400/60 transition-all duration-300"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-nebula-500/10 text-nebula-300 border border-nebula-500/20">
                        CHAPTER 0{chapter.id}
                      </span>
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> 已读完
                          </span>
                        ) : isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                            <Bookmark className="w-3 h-3" /> 阅读中
                          </span>
                        ) : null}
                        <span className="text-[11px] font-mono text-text-secondary">
                          {chapter.wordCount} 字
                        </span>
                      </div>
                    </div>

                    {/* Chapter Title */}
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-nebula-300 transition-colors mb-2 flex items-center gap-2">
                      <span>{chapter.title}</span>
                      {chapter.subtitle && (
                        <span className="text-sm font-normal text-text-secondary">
                          · {chapter.subtitle}
                        </span>
                      )}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 mb-4">
                      {chapter.summary}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-cosmic-700/60 flex items-center justify-between text-xs text-text-secondary group-hover:text-nebula-300 transition-colors">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      约 {chapter.readingTimeMinutes} 分钟
                    </span>
                    <span className="flex items-center gap-1 font-medium text-nebula-400 group-hover:translate-x-1 transition-transform">
                      进入阅读 <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            );
          })}
        </div>
      )}

      {/* Tab 2: Characters */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {characters.map((char) => (
            <SpotlightCard
              key={char.name}
              spotlightColor="rgba(96, 165, 250, 0.2)"
              className="p-6 border-cosmic-600/40"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cosmic-700/60 border border-cosmic-600/50 flex items-center justify-center text-2xl shrink-0">
                  {char.icon}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-text-primary text-base">{char.name}</h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-star-500/10 text-star-300 border border-star-500/20">
                      {char.tag}
                    </span>
                  </div>
                  <p className="text-xs text-nebula-400 font-medium">{char.role}</p>
                  <p className="text-xs text-text-secondary leading-relaxed pt-1">{char.desc}</p>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Tab 3: Lore & Setting */}
      {activeTab === 'lore' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {loreItems.map((item) => (
            <SpotlightCard
              key={item.name}
              spotlightColor="rgba(52, 211, 153, 0.2)"
              className="p-6 border-cosmic-600/40"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-primary text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-aurora-400" />
                    <span>{item.name}</span>
                  </h4>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-aurora-500/10 text-aurora-300 border border-aurora-500/20">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Bottom Cross-Navigation */}
      <div className="mt-12 pt-8 border-t border-cosmic-600/40 flex flex-wrap items-center justify-between gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-3">
          <Link
            to="/characters"
            onClick={() => sfx.playClick()}
            className="hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-star-400" />
            <span>完整人物图鉴</span>
          </Link>
          <span>·</span>
          <Link
            to="/world"
            onClick={() => sfx.playClick()}
            className="hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-aurora-400" />
            <span>世界观百科</span>
          </Link>
          <span>·</span>
          <Link
            to="/timeline"
            onClick={() => sfx.playClick()}
            className="hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>星灵编年史</span>
          </Link>
        </div>

        <span className="font-mono text-cosmic-500">
          XINGLING ODYSSEY · THE OTHER WORLD
        </span>
      </div>
    </div>
  );
}
