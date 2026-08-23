import type { CharacterId } from './CardDatabase';

// ============================================================================
// TYPES
// ============================================================================

export type EquipSlot = 'weapon' | 'armor' | 'accessory';
export type EquipRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type EquipStat = 'hp' | 'attack' | 'defense' | 'speed' | 'energy' | 'block';

export interface EquipEffect {
  stat: EquipStat;
  value: number;
  type: 'flat' | 'percent';
}

export interface EquipmentDef {
  id: string;
  name: string;
  slot: EquipSlot;
  rarity: EquipRarity;
  icon: string;
  description: string;
  effects: EquipEffect[];
  setId?: string; // Which set this belongs to
}

export interface SetBonus {
  setId: string;
  name: string;
  pieces: string[]; // Equipment IDs in this set
  bonuses: { count: number; effects: EquipEffect[]; desc: string }[];
}

export interface InventoryItem {
  id: string;       // EquipmentDef.id
  level: number;    // Enhancement level 0-10
  uid: string;      // Unique instance ID
}

export interface EquippedState {
  weapon?: string;    // uid
  armor?: string;
  accessory?: string;
}

// ============================================================================
// RARITY COLORS
// ============================================================================

export const RARITY_COLORS: Record<EquipRarity, { hex: string; phaser: number }> = {
  common:    { hex: '#9ca3af', phaser: 0x9ca3af },
  uncommon:  { hex: '#22c55e', phaser: 0x22c55e },
  rare:      { hex: '#3b82f6', phaser: 0x3b82f6 },
  legendary: { hex: '#fbbf24', phaser: 0xfbbf24 },
};

export const SLOT_NAMES: Record<EquipSlot, string> = {
  weapon: '武器',
  armor: '护甲',
  accessory: '饰品',
};

// ============================================================================
// EQUIPMENT DEFINITIONS
// ============================================================================

export const EQUIPMENT_DB: Record<string, EquipmentDef> = {
  // ── Weapons ──
  em_staff: {
    id: 'em_staff', name: '电磁权杖', slot: 'weapon', rarity: 'common',
    icon: '⚡', description: '安培尔的制式武器，蕴含微弱的电磁能量。',
    effects: [{ stat: 'attack', value: 2, type: 'flat' }],
  },
  ice_dagger: {
    id: 'ice_dagger', name: '冰晶短刃', slot: 'weapon', rarity: 'uncommon',
    icon: '❄', description: '以万年寒冰锻造的短刃，轻盈而致命。',
    effects: [
      { stat: 'attack', value: 1, type: 'flat' },
      { stat: 'speed', value: 1, type: 'flat' },
    ],
    setId: 'nock_guard',
  },
  star_blade: {
    id: 'star_blade', name: '星火之剑', slot: 'weapon', rarity: 'rare',
    icon: '✦', description: '传说中星灵战士的佩剑，剑刃燃烧着永恒星火。',
    effects: [{ stat: 'attack', value: 4, type: 'flat' }],
    setId: 'star_legacy',
  },
  chaos_edge: {
    id: 'chaos_edge', name: '时空裂刃', slot: 'weapon', rarity: 'legendary',
    icon: '◈', description: '撕裂时空的禁忌之刃。据说是千年前圣皇战争的遗物。',
    effects: [
      { stat: 'attack', value: 3, type: 'flat' },
      { stat: 'attack', value: 10, type: 'percent' },
    ],
    setId: 'chrono',
  },

  // ── Armor ──
  nock_armor: {
    id: 'nock_armor', name: '诺克城护甲', slot: 'armor', rarity: 'common',
    icon: '🛡', description: '诺克城守卫制式护甲，以雪原矿石锻造。',
    effects: [{ stat: 'defense', value: 2, type: 'flat' }],
    setId: 'nock_guard',
  },
  frost_cloak: {
    id: 'frost_cloak', name: '冰霜斗篷', slot: 'armor', rarity: 'uncommon',
    icon: '❆', description: '以冰霜权能凝聚的斗篷，寒气逼人。',
    effects: [
      { stat: 'defense', value: 1, type: 'flat' },
      { stat: 'hp', value: 10, type: 'flat' },
    ],
  },
  star_armor: {
    id: 'star_armor', name: '星光战甲', slot: 'armor', rarity: 'rare',
    icon: '✧', description: '以星光铸造的战甲，轻如薄翼却坚不可摧。',
    effects: [{ stat: 'defense', value: 4, type: 'flat' }],
    setId: 'star_legacy',
  },
  chrono_robe: {
    id: 'chrono_robe', name: '时空长袍', slot: 'armor', rarity: 'legendary',
    icon: '◎', description: '穿越时空的旅者所穿的长袍，能在时间夹缝中穿行。',
    effects: [
      { stat: 'defense', value: 2, type: 'flat' },
      { stat: 'hp', value: 15, type: 'flat' },
      { stat: 'speed', value: 2, type: 'flat' },
    ],
    setId: 'chrono',
  },

  // ── Accessories ──
  star_key: {
    id: 'star_key', name: '星之键', slot: 'accessory', rarity: 'rare',
    icon: '⚝', description: '传说中开启星灵之力的钥匙。蕴含无穷可能。',
    effects: [{ stat: 'energy', value: 1, type: 'flat' }],
    setId: 'star_legacy',
  },
  snow_pendant: {
    id: 'snow_pendant', name: '雪花吊坠', slot: 'accessory', rarity: 'uncommon',
    icon: '❊', description: '永不融化的雪花凝成的吊坠，触之生寒。',
    effects: [
      { stat: 'hp', value: 5, type: 'flat' },
      { stat: 'defense', value: 1, type: 'flat' },
    ],
    setId: 'nock_guard',
  },
  chrono_ring: {
    id: 'chrono_ring', name: '时空指环', slot: 'accessory', rarity: 'legendary',
    icon: '◉', description: '据说是凯奥斯留下的遗物，指环内封印着千年时光。',
    effects: [
      { stat: 'attack', value: 2, type: 'flat' },
      { stat: 'defense', value: 2, type: 'flat' },
      { stat: 'hp', value: 10, type: 'flat' },
      { stat: 'speed', value: 1, type: 'flat' },
    ],
    setId: 'chrono',
  },
  guard_badge: {
    id: 'guard_badge', name: '守卫徽章', slot: 'accessory', rarity: 'common',
    icon: '⚜', description: '诺克城守卫的身份象征。',
    effects: [{ stat: 'block', value: 2, type: 'flat' }],
    setId: 'nock_guard',
  },
};

// ============================================================================
// SET DEFINITIONS
// ============================================================================

export const SET_DB: Record<string, SetBonus> = {
  nock_guard: {
    setId: 'nock_guard',
    name: '诺克城守卫套装',
    pieces: ['ice_dagger', 'nock_armor', 'snow_pendant', 'guard_badge'],
    bonuses: [
      { count: 2, effects: [{ stat: 'hp', value: 10, type: 'flat' }], desc: '2件: HP+10' },
      { count: 3, effects: [{ stat: 'defense', value: 3, type: 'flat' }], desc: '3件: 防御+3' },
      { count: 4, effects: [{ stat: 'block', value: 5, type: 'flat' }], desc: '4件: 每回合额外格挡+5' },
    ],
  },
  star_legacy: {
    setId: 'star_legacy',
    name: '星灵传承套装',
    pieces: ['star_blade', 'star_armor', 'star_key'],
    bonuses: [
      { count: 2, effects: [{ stat: 'attack', value: 2, type: 'flat' }], desc: '2件: 攻击+2' },
      { count: 3, effects: [{ stat: 'energy', value: 1, type: 'flat' }], desc: '3件: 每回合额外能量+1' },
    ],
  },
  chrono: {
    setId: 'chrono',
    name: '时空旅者套装',
    pieces: ['chaos_edge', 'chrono_robe', 'chrono_ring'],
    bonuses: [
      { count: 2, effects: [{ stat: 'speed', value: 3, type: 'flat' }], desc: '2件: 速度+3' },
      { count: 3, effects: [{ stat: 'attack', value: 15, type: 'percent' }], desc: '3件: 攻击力+15%' },
    ],
  },
};

// ============================================================================
// DROP POOLS (by chapter)
// ============================================================================

export interface DropEntry {
  equipmentId: string;
  weight: number; // Relative drop weight
}

export const CHAPTER_DROPS: Record<string, DropEntry[]> = {
  chapter1: [
    { equipmentId: 'em_staff', weight: 30 },
    { equipmentId: 'nock_armor', weight: 25 },
    { equipmentId: 'guard_badge', weight: 25 },
    { equipmentId: 'ice_dagger', weight: 10 },
    { equipmentId: 'frost_cloak', weight: 7 },
    { equipmentId: 'snow_pendant', weight: 3 },
  ],
};

// ============================================================================
// ENHANCEMENT
// ============================================================================

export function getEnhanceCost(level: number): number {
  return 50 + level * 30;
}

export function getEnhanceSuccessRate(level: number): number {
  if (level < 5) return 1.0;
  if (level < 8) return 0.8;
  return 0.6;
}

/**
 * Apply enhancement multiplier to effects.
 * Each level adds 10% to base values.
 */
export function getEffectiveEffects(item: InventoryItem): EquipEffect[] {
  const def = EQUIPMENT_DB[item.id];
  if (!def) return [];
  const multiplier = 1 + item.level * 0.1;
  return def.effects.map((e) => ({
    ...e,
    value: e.type === 'flat' ? Math.round(e.value * multiplier) : e.value + item.level,
  }));
}

/**
 * Calculate total stats from all equipped items + set bonuses.
 */
export function calculateTotalStats(
  equipped: EquippedState,
  inventory: InventoryItem[],
): Record<EquipStat, number> {
  const totals: Record<EquipStat, number> = {
    hp: 0, attack: 0, defense: 0, speed: 0, energy: 0, block: 0,
  };

  const equippedUids = [equipped.weapon, equipped.armor, equipped.accessory].filter(Boolean) as string[];
  const equippedItems = inventory.filter((item) => equippedUids.includes(item.uid));
  const equippedDefIds = new Set(equippedItems.map((item) => item.id));

  // Sum flat effects from equipped items
  for (const item of equippedItems) {
    for (const effect of getEffectiveEffects(item)) {
      if (effect.type === 'flat') {
        totals[effect.stat] += effect.value;
      }
    }
  }

  // Apply percent effects
  for (const item of equippedItems) {
    for (const effect of getEffectiveEffects(item)) {
      if (effect.type === 'percent') {
        totals[effect.stat] = Math.round(totals[effect.stat] * (1 + effect.value / 100));
      }
    }
  }

  // Set bonuses
  for (const set of Object.values(SET_DB)) {
    const equippedInSet = set.pieces.filter((id) => equippedDefIds.has(id));
    for (const bonus of set.bonuses) {
      if (equippedInSet.length >= bonus.count) {
        for (const effect of bonus.effects) {
          if (effect.type === 'flat') {
            totals[effect.stat] += effect.value;
          }
        }
      }
    }
  }

  return totals;
}

/**
 * Get active set info for display.
 */
export function getActiveSets(
  equipped: EquippedState,
  inventory: InventoryItem[],
): { set: SetBonus; equipped: number; active: boolean }[] {
  const equippedUids = [equipped.weapon, equipped.armor, equipped.accessory].filter(Boolean) as string[];
  const equippedItems = inventory.filter((item) => equippedUids.includes(item.uid));
  const equippedDefIds = new Set(equippedItems.map((item) => item.id));

  return Object.values(SET_DB).map((set) => {
    const count = set.pieces.filter((id) => equippedDefIds.has(id)).length;
    return {
      set,
      equipped: count,
      active: count >= 2,
    };
  }).filter((entry) => entry.equipped > 0);
}

/**
 * Roll a random drop for a chapter.
 */
export function rollDrop(chapterId: string): string | null {
  const pool = CHAPTER_DROPS[chapterId];
  if (!pool || pool.length === 0) return null;
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) return entry.equipmentId;
  }
  return pool[pool.length - 1].equipmentId;
}

/**
 * Generate a unique ID for inventory items.
 */
export function generateUid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
