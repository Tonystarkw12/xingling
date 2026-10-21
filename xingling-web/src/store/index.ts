import { create } from 'zustand';
import { sfx } from '../utils/sfx';

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
    } catch {
      /* ignore */
    }
  },

  markComplete: (volume, chapter) => {
    set((state) => {
      const key = `${volume}-${chapter}`;
      if (state.completedChapters.includes(key)) return state;
      const completed = [...state.completedChapters, key];
      try {
        localStorage.setItem('xingling-completed', JSON.stringify(completed));
      } catch {
        /* ignore */
      }
      return { completedChapters: completed };
    });
  },

  loadProgress: () => {
    try {
      const progress = localStorage.getItem('xingling-progress');
      const completed = localStorage.getItem('xingling-completed');
      if (progress) set({ readingProgress: JSON.parse(progress) });
      if (completed) set({ completedChapters: JSON.parse(completed) });
    } catch {
      /* ignore */
    }
  },
}));

export type ReaderTheme = 'space' | 'sepia' | 'ink';

export interface ReaderSettings {
  fontSize: number;
  theme: ReaderTheme;
  lineHeight: number;
  indent: boolean;
  serif: boolean;
  effects: boolean;
  sfx: boolean;
  bgm: boolean;
  volume: number;
}

const READER_DEFAULTS: ReaderSettings = {
  fontSize: 18,
  theme: 'space',
  lineHeight: 2.05,
  indent: true,
  serif: true,
  effects: true,
  sfx: true,
  bgm: false,
  volume: 0.5,
};

function loadReaderSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem('xingling-reader-settings');
    if (raw) return { ...READER_DEFAULTS, ...JSON.parse(raw) };
    // legacy single-value key from older builds
    const legacy = localStorage.getItem('xingling-fontsize');
    if (legacy) return { ...READER_DEFAULTS, fontSize: parseInt(legacy, 10) || READER_DEFAULTS.fontSize };
  } catch {
    /* ignore */
  }
  return READER_DEFAULTS;
}

interface SettingsState extends ReaderSettings {
  setFontSize: (size: number) => void;
  setTheme: (theme: ReaderTheme) => void;
  setLineHeight: (lh: number) => void;
  setIndent: (indent: boolean) => void;
  setSerif: (serif: boolean) => void;
  setEffects: (effects: boolean) => void;
  setSfx: (sfx: boolean) => void;
  setBgm: (bgm: boolean) => void;
  setVolume: (volume: number) => void;
}

function persistReaderSettings(patch: Partial<ReaderSettings>) {
  const s = useSettings.getState();
  try {
    localStorage.setItem(
      'xingling-reader-settings',
      JSON.stringify({
        fontSize: s.fontSize,
        theme: s.theme,
        lineHeight: s.lineHeight,
        indent: s.indent,
        serif: s.serif,
        effects: s.effects,
        sfx: s.sfx,
        bgm: s.bgm,
        volume: s.volume,
        ...patch,
      }),
    );
  } catch {
    /* ignore */
  }
}

export const useSettings = create<SettingsState>((set) => ({
  ...loadReaderSettings(),
  setFontSize: (fontSize) => {
    set({ fontSize });
    persistReaderSettings({ fontSize });
  },
  setTheme: (theme) => {
    set({ theme });
    persistReaderSettings({ theme });
  },
  setLineHeight: (lineHeight) => {
    set({ lineHeight });
    persistReaderSettings({ lineHeight });
  },
  setIndent: (indent) => {
    set({ indent });
    persistReaderSettings({ indent });
  },
  setSerif: (serif) => {
    set({ serif });
    persistReaderSettings({ serif });
  },
  setEffects: (effects) => {
    set({ effects });
    persistReaderSettings({ effects });
  },
  setSfx: (sfxVal) => {
    set({ sfx: sfxVal });
    sfx.setSfxEnabled(sfxVal);
    persistReaderSettings({ sfx: sfxVal });
  },
  setBgm: (bgmVal) => {
    set({ bgm: bgmVal });
    sfx.setBgmEnabled(bgmVal);
    persistReaderSettings({ bgm: bgmVal });
  },
  setVolume: (volume) => {
    set({ volume });
    sfx.setVolume(volume);
    persistReaderSettings({ volume });
  },
}));
