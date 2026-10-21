import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Globe, Clock, Sparkles, ExternalLink, Key } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';
import { DecryptedText } from '../ui/DecryptedText';
import { ShinyText } from '../ui/ShinyText';
import { BlurText } from '../ui/BlurText';
import { StarBorder } from '../ui/StarBorder';
import { sfx } from '../../utils/sfx';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Hero Title Section */}
      <m.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="text-center mb-12 relative z-10"
      >
        {/* Badge */}
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-nebula-500/40 bg-nebula-500/10 backdrop-blur-md mb-6 shadow-sm shadow-nebula-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-nebula-400 animate-pulse" />
          <span className="text-xs font-medium text-nebula-300 tracking-wider">
            中文科幻奇幻长篇互动宇宙
          </span>
        </m.div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 tracking-tight drop-shadow-[0_0_35px_rgba(167,139,250,0.35)]">
          <ShinyText text="星灵" speed={5} className="font-serif tracking-wider" />
        </h1>

        {/* Decrypted Subtitle */}
        <div className="h-8 flex items-center justify-center mb-3">
          <DecryptedText
            text="STAR SPIRIT · XINGLING"
            speed={40}
            maxIterations={10}
            className="text-lg md:text-2xl text-star-300 font-mono tracking-[0.25em]"
            encryptedClassName="text-nebula-400/70"
            animateOn="mount"
          />
        </div>

        {/* Blur Text Tagline */}
        <div className="flex justify-center mt-3">
          <BlurText
            text="✦ 十六卷史诗 · 二百章旅程 · 探索拉提麦尔星系 ✦"
            delay={35}
            className="text-sm md:text-base text-text-secondary/90 font-medium"
            animateBy="words"
            direction="top"
          />
        </div>
      </m.div>

      {/* Main Navigation Grid with SpotlightCards */}
      <m.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mb-12 relative z-10"
      >
        {/* Card 1: Read */}
        <Link
          to="/volumes"
          className="group block"
          onClick={() => {
            sfx.playClick();
          }}
        >
          <SpotlightCard
            spotlightColor="rgba(167, 139, 250, 0.25)"
            className="h-full p-6 flex flex-col items-center text-center border-cosmic-600/40 hover:border-nebula-400/60"
          >
            <div className="w-14 h-14 rounded-2xl bg-nebula-500/15 border border-nebula-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-nebula-500/25 transition-all duration-300 shadow-inner">
              <BookOpen className="w-7 h-7 text-nebula-400 group-hover:text-nebula-300 transition-colors" />
            </div>
            <span className="text-text-primary font-bold text-lg mb-1">开始阅读</span>
            <span className="text-text-secondary text-xs">十六卷正文 · 全本畅读</span>
            <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-nebula-500/10 text-nebula-300 border border-nebula-500/20">
              VOLUMES 1-16
            </span>
          </SpotlightCard>
        </Link>

        {/* Card 2: Characters */}
        <Link
          to="/characters"
          className="group block"
          onClick={() => {
            sfx.playClick();
          }}
        >
          <SpotlightCard
            spotlightColor="rgba(96, 165, 250, 0.25)"
            className="h-full p-6 flex flex-col items-center text-center border-cosmic-600/40 hover:border-star-400/60"
          >
            <div className="w-14 h-14 rounded-2xl bg-star-500/15 border border-star-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-star-500/25 transition-all duration-300 shadow-inner">
              <Users className="w-7 h-7 text-star-400 group-hover:text-star-300 transition-colors" />
            </div>
            <span className="text-text-primary font-bold text-lg mb-1">人物图鉴</span>
            <span className="text-text-secondary text-xs">角色百科 · 关系图谱</span>
            <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-star-500/10 text-star-300 border border-star-500/20">
              CHARACTERS
            </span>
          </SpotlightCard>
        </Link>

        {/* Card 3: World */}
        <Link
          to="/world"
          className="group block"
          onClick={() => {
            sfx.playClick();
          }}
        >
          <SpotlightCard
            spotlightColor="rgba(52, 211, 153, 0.25)"
            className="h-full p-6 flex flex-col items-center text-center border-cosmic-600/40 hover:border-aurora-400/60"
          >
            <div className="w-14 h-14 rounded-2xl bg-aurora-500/15 border border-aurora-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-aurora-500/25 transition-all duration-300 shadow-inner">
              <Globe className="w-7 h-7 text-aurora-400 group-hover:text-aurora-300 transition-colors" />
            </div>
            <span className="text-text-primary font-bold text-lg mb-1">世界观</span>
            <span className="text-text-secondary text-xs">星系架构 · 权能体系</span>
            <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-aurora-500/10 text-aurora-300 border border-aurora-500/20">
              WORLD ENCYCLOPEDIA
            </span>
          </SpotlightCard>
        </Link>

        {/* Card 4: Timeline */}
        <Link
          to="/timeline"
          className="group block"
          onClick={() => {
            sfx.playClick();
          }}
        >
          <SpotlightCard
            spotlightColor="rgba(245, 158, 11, 0.25)"
            className="h-full p-6 flex flex-col items-center text-center border-cosmic-600/40 hover:border-amber-400/60"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500/25 transition-all duration-300 shadow-inner">
              <Clock className="w-7 h-7 text-amber-400 group-hover:text-amber-300 transition-colors" />
            </div>
            <span className="text-text-primary font-bold text-lg mb-1">时间线</span>
            <span className="text-text-secondary text-xs">千年编年史 · 历史事件</span>
            <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              CHRONOLOGY
            </span>
          </SpotlightCard>
        </Link>
      </m.div>

      {/* Featured Callout Banner with StarBorder */}
      <m.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-4xl w-full mb-14 relative z-10"
      >
        <StarBorder color="#a78bfa" speed="7s" className="w-full">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-nebula-400 animate-bounce" />
                <h3 className="text-lg md:text-xl font-bold text-text-primary">
                  星灵纪元，权能觉醒
                </h3>
              </div>
              <p className="text-sm text-text-secondary max-w-xl leading-relaxed">
                在拉提麦尔星系中寻找散落的六把星之键。经历千次轮回与圣皇战争，见证凯奥斯、安培尔、托尼在虚数奇点下的羁绊与救赎。
              </p>
            </div>
            <Link
              to="/volumes"
              className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-gradient-to-r from-nebula-500 to-star-500 text-white font-semibold text-sm hover:from-nebula-400 hover:to-star-400 transition-all duration-300 shadow-lg shadow-nebula-500/25 hover:shadow-nebula-500/40 hover:scale-105 active:scale-95"
              onClick={() => sfx.playClick()}
            >
              开启第一卷 →
            </Link>
          </div>
        </StarBorder>
      </m.div>

      {/* Universe Telemetry Badges */}
      <m.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full mb-14 text-center relative z-10"
      >
        <div className="p-3.5 rounded-xl bg-cosmic-800/40 border border-cosmic-600/30 backdrop-blur-sm">
          <div className="text-xl font-mono font-bold text-nebula-400">16 卷</div>
          <div className="text-xs text-text-secondary mt-0.5">全本中文史诗</div>
        </div>
        <div className="p-3.5 rounded-xl bg-cosmic-800/40 border border-cosmic-600/30 backdrop-blur-sm">
          <div className="text-xl font-mono font-bold text-star-400">200+ 章</div>
          <div className="text-xs text-text-secondary mt-0.5">沉浸式阅读进度</div>
        </div>
        <div className="p-3.5 rounded-xl bg-cosmic-800/40 border border-cosmic-600/30 backdrop-blur-sm">
          <div className="text-xl font-mono font-bold text-aurora-400">4 大种族</div>
          <div className="text-xs text-text-secondary mt-0.5">安吉拉 · 卡普拉 · 泰坦 · 精灵</div>
        </div>
        <div className="p-3.5 rounded-xl bg-cosmic-800/40 border border-cosmic-600/30 backdrop-blur-sm">
          <div className="text-xl font-mono font-bold text-amber-400">12,403 次</div>
          <div className="text-xs text-text-secondary mt-0.5">艾萨克拯救世界轮回</div>
        </div>
      </m.div>

      {/* Author and Project Meta */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
        className="text-center relative z-10 max-w-md"
      >
        <p className="text-text-secondary text-sm mb-1.5">
          作者：<span className="text-text-primary font-medium">周子航</span>
          <span className="mx-2 text-cosmic-500">|</span>
          <span className="text-text-secondary text-xs">清华大学生物物理博士</span>
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <a
            href="https://space.bilibili.com/492814737?spm_id_from=333.1007.0.0"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sfx.playClick()}
            className="inline-flex items-center gap-1.5 text-xs text-bilibili-400 hover:text-bilibili-300 transition-colors px-4 py-2 rounded-full border border-bilibili-500/30 hover:border-bilibili-400/50 bg-bilibili-500/10 hover:bg-bilibili-500/20 backdrop-blur-sm shadow-sm"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
            </svg>
            B站主页
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href="https://github.com/Tonystarkw12/xingling"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sfx.playClick()}
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors px-4 py-2 rounded-full border border-cosmic-600/50 hover:border-nebula-400/50 bg-cosmic-800/40 backdrop-blur-sm"
          >
            <span className="font-semibold text-text-primary">GH</span>
            GitHub 项目
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <p className="mt-3 text-text-secondary/80 text-[11px]">
          GitHub Releases 提供 Android、Windows、macOS、Linux 多端安装包
        </p>
      </m.div>
    </div>
  );
}
