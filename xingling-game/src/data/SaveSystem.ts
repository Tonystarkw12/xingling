export type DemoCheckpoint = 'chapter1' | 'battle' | 'complete';

interface DemoSave {
  version: 1;
  checkpoint: DemoCheckpoint;
  tutorialSeen: boolean;
  updatedAt: string;
}

const SAVE_KEY = 'xingling-demo-save';

const DEFAULT_SAVE: DemoSave = {
  version: 1,
  checkpoint: 'chapter1',
  tutorialSeen: false,
  updatedAt: '',
};

export function loadSave(): DemoSave {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as Partial<DemoSave>;
    if (parsed.version !== 1 || !['chapter1', 'battle', 'complete'].includes(parsed.checkpoint ?? '')) {
      return { ...DEFAULT_SAVE };
    }
    return {
      version: 1,
      checkpoint: parsed.checkpoint as DemoCheckpoint,
      tutorialSeen: parsed.tutorialSeen === true,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

function writeSave(save: DemoSave): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Storage may be unavailable in private or embedded browser contexts.
  }
}

export function saveCheckpoint(checkpoint: DemoCheckpoint): void {
  const current = loadSave();
  writeSave({
    ...current,
    checkpoint,
    updatedAt: new Date().toISOString(),
  });
}

export function markTutorialSeen(): void {
  const current = loadSave();
  writeSave({
    ...current,
    tutorialSeen: true,
    updatedAt: new Date().toISOString(),
  });
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // A failed clear must not block starting a new game.
  }
}

export function sceneForCheckpoint(checkpoint: DemoCheckpoint): string {
  if (checkpoint === 'battle') return 'BattleScene';
  if (checkpoint === 'complete') return 'ChapterCompleteScene';
  return 'Chapter1Scene';
}
