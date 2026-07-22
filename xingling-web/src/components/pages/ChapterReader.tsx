import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { volumes } from '../../data/novel';
import { useStore, useSettings } from '../../store';
import { ArrowLeft, ChevronLeft, ChevronRight, Type, Settings } from 'lucide-react';

export function ChapterReader() {
  const { volumeIndex, chapterIndex } = useParams<{ volumeIndex: string; chapterIndex: string }>();
  const navigate = useNavigate();
  const vIdx = parseInt(volumeIndex!, 10);
  const cIdx = parseInt(chapterIndex!, 10);
  const { markComplete } = useStore();
  const { fontSize, setFontSize } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  const volume = volumes[vIdx];
  const chapter = volume?.chapters[cIdx];

  useEffect(() => {
    useStore.getState().setProgress(vIdx, cIdx);
    // Animate text reveal
    const timer = setTimeout(() => setTextVisible(true), 100);
    return () => clearTimeout(timer);
  }, [vIdx, cIdx]);

  // Mark as complete when navigating away
  useEffect(() => {
    return () => {
      markComplete(vIdx, cIdx);
    };
  }, [vIdx, cIdx, markComplete]);

  const formattedContent = useMemo(() => {
    if (!chapter) return '';
    // Process markdown-like content
    return chapter.content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        // Skip header lines that leaked through
        if (line.startsWith('# ') || line.startsWith('## ')) return null;
        return (
          <p key={line} className="text-justify leading-loose mb-4">
            {line}
          </p>
        );
      });
  }, [chapter]);

  const hasNext = volume && cIdx < volume.chapters.length - 1;
  const hasPrev = cIdx > 0;
  const nextChapter = hasNext ? { v: vIdx, c: cIdx + 1 } : null;
  const prevChapter = hasPrev ? { v: vIdx, c: cIdx - 1 } : null;

  if (!chapter || !volume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">章节未找到</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-cosmic-900/90 backdrop-blur-md border-b border-cosmic-600/30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/volumes" className="p-2 rounded-lg hover:bg-cosmic-700/50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </Link>
            <div>
              <p className="text-sm text-text-accent">{volume.title}</p>
              <p className="text-xs text-text-secondary">{chapter.title}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-cosmic-700/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-text-primary" />
            </button>
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 p-4 bg-cosmic-800 rounded-xl border border-cosmic-600/50 shadow-xl w-64">
                <label className="text-sm text-text-secondary flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  字体大小: {fontSize}px
                </label>
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full mt-2 accent-nebula-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <m.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 py-12"
        style={{ fontSize: `${fontSize}px`, lineHeight: '2' }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-12 pb-4 border-b border-cosmic-600/30">
          {chapter.title}
        </h1>
        <div className="text-text-primary/90">
          {formattedContent}
        </div>
      </m.article>

      {/* Navigation */}
      <div className="max-w-3xl mx-auto px-6 pb-12 flex items-center justify-between border-t border-cosmic-600/30 pt-8">
        {prevChapter ? (
          <button
            onClick={() => navigate(`/read/${prevChapter.v}/${prevChapter.c}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600/50 transition-colors text-text-primary"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">上一章</span>
          </button>
        ) : (
          <div />
        )}

        <Link
          to={`/volumes`}
          className="px-4 py-2 rounded-lg bg-nebula-500/20 hover:bg-nebula-500/30 transition-colors text-nebula-400 text-sm"
        >
          返回目录
        </Link>

        {nextChapter ? (
          <button
            onClick={() => navigate(`/read/${nextChapter.v}/${nextChapter.c}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600/50 transition-colors text-text-primary"
          >
            <span className="text-sm">下一章</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
