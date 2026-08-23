export interface GameSettings {
  bgmVolume: number;       // 0-100
  voiceVolume: number;     // 0-100
  sfxVolume: number;       // 0-100
  textSpeed: number;       // 1=慢 2=中 3=快
  autoAdvance: boolean;    // 自动播放对话
  fullscreen: boolean;     // 全屏模式
  resolution: '720p' | '1080p' | 'native';  // 分辨率预设
}

const SETTINGS_KEY = 'xingling-settings';

const DEFAULT_SETTINGS: GameSettings = {
  bgmVolume: 50,
  voiceVolume: 80,
  sfxVolume: 70,
  textSpeed: 2,
  autoAdvance: false,
  fullscreen: false,
  resolution: 'native',
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      bgmVolume: clamp(parsed.bgmVolume, 0, 100, DEFAULT_SETTINGS.bgmVolume),
      voiceVolume: clamp(parsed.voiceVolume, 0, 100, DEFAULT_SETTINGS.voiceVolume),
      sfxVolume: clamp(parsed.sfxVolume, 0, 100, DEFAULT_SETTINGS.sfxVolume),
      textSpeed: clamp(parsed.textSpeed, 1, 3, DEFAULT_SETTINGS.textSpeed),
      autoAdvance: parsed.autoAdvance === true,
      fullscreen: parsed.fullscreen === true,
      resolution: parsed.resolution && ['720p', '1080p', 'native'].includes(parsed.resolution) ? parsed.resolution as GameSettings['resolution'] : DEFAULT_SETTINGS.resolution,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch { /* storage unavailable */ }
}

export function getDefaultSettings(): GameSettings {
  return { ...DEFAULT_SETTINGS };
}

/** Convert 0-100 setting to Phaser volume (0-1) */
export function toVolume(value: number): number {
  return Math.max(0, Math.min(1, value / 100));
}

/** Convert textSpeed (1-3) to typewriter delay in ms */
export function textSpeedToDelay(speed: number): number {
  switch (speed) {
    case 1: return 55;   // 慢
    case 3: return 18;   // 快
    default: return 35;  // 中
  }
}

/** Get resolution dimensions for a preset */
export function getResolutionSize(res: GameSettings['resolution']): { width: number; height: number } {
  switch (res) {
    case '720p': return { width: 1280, height: 720 };
    case '1080p': return { width: 1920, height: 1080 };
    default: return { width: 1152, height: 768 }; // native (original)
  }
}

function clamp(val: unknown, min: number, max: number, fallback: number): number {
  const n = typeof val === 'number' ? val : fallback;
  return Math.max(min, Math.min(max, n));
}
