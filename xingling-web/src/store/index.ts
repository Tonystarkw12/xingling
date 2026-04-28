import { create } from 'zustand';

interface ReadingState {
  currentVolume: number;
  currentChapter: number;
  readingProgress: { volume: number; chapter: number } | null;
  completedChapters: string[];
  setProgress: (volume: number, chapter: number) => void;
  markComplete: (volume: number, chapter: number) => void;
  loadProgress: () => void;
}

export const useStore = create<ReadingState>((set) => ({
  currentVolume: 0,
  currentChapter: 0,
  readingProgress: null,
  completedChapters: [],

  setProgress: (volume, chapter) => {
    set({ currentVolume: volume, currentChapter: chapter, readingProgress: { volume, chapter } });
    try {
      localStorage.setItem('xingling-progress', JSON.stringify({ volume, chapter }));
    } catch {}
  },

  markComplete: (volume, chapter) => {
    set((state) => {
      const key = `${volume}-${chapter}`;
      if (state.completedChapters.includes(key)) return state;
      const completed = [...state.completedChapters, key];
      try {
        localStorage.setItem('xingling-completed', JSON.stringify(completed));
      } catch {}
      return { completedChapters: completed };
    });
  },

  loadProgress: () => {
    try {
      const progress = localStorage.getItem('xingling-progress');
      const completed = localStorage.getItem('xingling-completed');
      if (progress) set({ readingProgress: JSON.parse(progress) });
      if (completed) set({ completedChapters: JSON.parse(completed) });
    } catch {}
  },
}));

interface SettingsState {
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  fontSize: 18,
  setFontSize: (size) => {
    set({ fontSize: size });
    try { localStorage.setItem('xingling-fontsize', String(size)); } catch {}
  },
}));

// Load settings on init
try {
  const saved = localStorage.getItem('xingling-fontsize');
  if (saved) {
    useSettings.setState({ fontSize: parseInt(saved, 10) });
  }
} catch {}
