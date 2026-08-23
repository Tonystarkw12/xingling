export type DemoCheckpoint = 'chapter1' | 'battle' | 'complete';

import type { InventoryItem, EquippedState } from './EquipmentDatabase';

interface DemoSave {
  version: 1;
  checkpoint: DemoCheckpoint;
  tutorialSeen: boolean;
  battleTutorialSeen: boolean;
  updatedAt: string;
  completedChapters: string[];
}

const SAVE_KEY = 'xingling-demo-save';

const DEFAULT_SAVE: DemoSave = {
  version: 1,
  checkpoint: 'chapter1',
  tutorialSeen: false,
  battleTutorialSeen: false,
  updatedAt: '',
  completedChapters: [],
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
      battleTutorialSeen: parsed.battleTutorialSeen === true,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      completedChapters: Array.isArray(parsed.completedChapters) ? parsed.completedChapters : [],
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

export function markBattleTutorialSeen(): void {
  const current = loadSave();
  writeSave({
    ...current,
    battleTutorialSeen: true,
    updatedAt: new Date().toISOString(),
  });
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
    // Give starter equipment instead of empty inventory
    giveStarterEquipment();
  } catch {
    // A failed clear must not block starting a new game.
  }
}

function giveStarterEquipment(): void {
  const starterItems: InventoryItem[] = [
    { id: 'em_staff', level: 0, uid: `starter-${Date.now()}-1` },
    { id: 'nock_armor', level: 0, uid: `starter-${Date.now()}-2` },
    { id: 'guard_badge', level: 0, uid: `starter-${Date.now()}-3` },
  ];
  saveEquipment(starterItems, {});
  saveGold(100);
}

export function markChapterCompleted(chapterId: string): void {
  const current = loadSave();
  if (!current.completedChapters.includes(chapterId)) {
    writeSave({
      ...current,
      completedChapters: [...current.completedChapters, chapterId],
      updatedAt: new Date().toISOString(),
    });
  }
}

export function sceneForCheckpoint(checkpoint: DemoCheckpoint): string {
  if (checkpoint === 'battle') return 'BattleScene';
  if (checkpoint === 'complete') return 'ChapterCompleteScene';
  return 'Chapter1Scene';
}

// ── Equipment Storage ──

const EQUIP_KEY = 'xingling-equipment';
const GOLD_KEY = 'xingling-gold';

interface EquipmentSave {
  inventory: InventoryItem[];
  equipped: EquippedState;
}

export function loadEquipment(): EquipmentSave {
  try {
    const raw = localStorage.getItem(EQUIP_KEY);
    if (!raw) return { inventory: [], equipped: {} };
    const parsed = JSON.parse(raw);
    return {
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
      equipped: parsed.equipped ?? {},
    };
  } catch {
    return { inventory: [], equipped: {} };
  }
}

export function saveEquipment(inventory: InventoryItem[], equipped: EquippedState): void {
  try {
    localStorage.setItem(EQUIP_KEY, JSON.stringify({ inventory, equipped }));
  } catch { /* storage unavailable */ }
}

export function loadGold(): number {
  try {
    const raw = localStorage.getItem(GOLD_KEY);
    if (!raw) return 100; // Starting gold
    const parsed = JSON.parse(raw);
    return typeof parsed === 'number' ? parsed : 100;
  } catch {
    return 100;
  }
}

export function saveGold(gold: number): void {
  try {
    localStorage.setItem(GOLD_KEY, JSON.stringify(gold));
  } catch { /* storage unavailable */ }
}

export function addEquipment(equipmentId: string): void {
  const { inventory, equipped } = loadEquipment();
  inventory.push({
    id: equipmentId,
    level: 0,
    uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  });
  saveEquipment(inventory, equipped);
}

// ── Card Upgrades ──

const CARD_UPGRADE_KEY = 'xingling-card-upgrades';

/** Map of cardId → upgrade level (0-5) */
export function loadCardUpgrades(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CARD_UPGRADE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCardUpgrades(upgrades: Record<string, number>): void {
  try {
    localStorage.setItem(CARD_UPGRADE_KEY, JSON.stringify(upgrades));
  } catch { /* storage unavailable */ }
}

export function getCardUpgradeLevel(cardId: string): number {
  return loadCardUpgrades()[cardId] ?? 0;
}

export function upgradeCard(cardId: string): number {
  const upgrades = loadCardUpgrades();
  const current = upgrades[cardId] ?? 0;
  upgrades[cardId] = current + 1;
  saveCardUpgrades(upgrades);
  return upgrades[cardId];
}
