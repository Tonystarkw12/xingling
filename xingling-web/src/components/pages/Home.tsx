import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Globe, Clock, Sparkles, ExternalLink } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center mb-16"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-nebula-400 via-star-400 to-aurora-400 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        >
          星灵
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-text-secondary tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          STAR SPIRIT
        </motion.p>
        <motion.div
          className="mt-4 text-nebula-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          ✦ 十六卷史诗 · 二百章旅程 ✦
        </motion.div>
      </motion.div>

      {/* Navigation Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full"
      >
        <Link
          to="/volumes"
          className="group flex flex-col items-center p-6 rounded-2xl bg-cosmic-700/50 border border-cosmic-600/50 hover:border-nebula-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-nebula-500/20"
        >
          <BookOpen className="w-8 h-8 text-nebula-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-text-primary font-medium">开始阅读</span>
          <span className="text-text-secondary text-xs mt-1">十六卷</span>
        </Link>

        <Link
          to="/characters"
          className="group flex flex-col items-center p-6 rounded-2xl bg-cosmic-700/50 border border-cosmic-600/50 hover:border-star-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-star-500/20"
        >
          <Users className="w-8 h-8 text-star-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-text-primary font-medium">人物图鉴</span>
          <span className="text-text-secondary text-xs mt-1">角色百科</span>
        </Link>

        <Link
          to="/world"
          className="group flex flex-col items-center p-6 rounded-2xl bg-cosmic-700/50 border border-cosmic-600/50 hover:border-aurora-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-aurora-500/20"
        >
          <Globe className="w-8 h-8 text-aurora-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-text-primary font-medium">世界观</span>
          <span className="text-text-secondary text-xs mt-1">世界探索</span>
        </Link>

        <Link
          to="/timeline"
          className="group flex flex-col items-center p-6 rounded-2xl bg-cosmic-700/50 border border-cosmic-600/50 hover:text-aurora-400 transition-all duration-300 hover:shadow-lg hover:shadow-aurora-500/20"
        >
          <Clock className="w-8 h-8 text-aurora-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-text-primary font-medium">时间线</span>
          <span className="text-text-secondary text-xs mt-1">编年史</span>
        </Link>
      </motion.div>

      {/* Author Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-20 text-center"
      >
        <p className="text-text-secondary text-sm mb-2">
          作者：<span className="text-text-primary font-medium">周子航</span>
        </p>
        <p className="text-text-secondary text-xs mb-3">
          清华大学生物物理博士
        </p>
        <a
          href="https://space.bilibili.com/492814737?spm_id_from=333.1007.0.0"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-bilibili-400 hover:text-bilibili-300 transition-colors px-4 py-2 rounded-full border border-bilibili-500/30 hover:border-bilibili-400/50 bg-bilibili-500/10 hover:bg-bilibili-500/20"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
          </svg>
          B站主页
          <ExternalLink className="w-3 h-3" />
        </a>
      </motion.div>

      {/* Decorative sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          >
            <Sparkles className="w-4 h-4 text-nebula-400/40" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
