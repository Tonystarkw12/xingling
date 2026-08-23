/**
 * Enemy definitions — stats, skills, behavior patterns, and status effects.
 */

// ============================================================================
// STATUS EFFECTS
// ============================================================================

export type StatusType = 'poison' | 'burn' | 'weakness' | 'vulnerable' | 'strength' | 'regeneration';

export interface StatusEffect {
  type: StatusType;
  stacks: number;    // Turns remaining or stack count
  value: number;     // Effect magnitude per stack
}

export const STATUS_INFO: Record<StatusType, { name: string; icon: string; color: string; desc: string }> = {
  poison:      { name: '中毒', icon: '☠', color: '#22c55e', desc: '每回合受到X点伤害' },
  burn:        { name: '灼烧', icon: '🔥', color: '#f97316', desc: '每回合受到X点伤害，受到攻击时+2' },
  weakness:    { name: '虚弱', icon: '💧', color: '#60a5fa', desc: '攻击伤害降低25%' },
  vulnerable:  { name: '易伤', icon: '💔', color: '#f87171', desc: '受到的攻击伤害增加50%' },
  strength:    { name: '力量', icon: '💪', color: '#fbbf24', desc: '攻击伤害增加X点' },
  regeneration:{ name: '再生', icon: '💚', color: '#4ade80', desc: '每回合恢复X点生命' },
};

// ============================================================================
// ENEMY SKILLS
// ============================================================================

export type EnemySkillType = 'attack' | 'defend' | 'buff' | 'debuff' | 'heal' | 'multi_attack';

export interface EnemySkill {
  id: string;
  name: string;
  type: EnemySkillType;
  description: string;
  icon: string;
  // Damage for attack skills
  damageMin?: number;
  damageMax?: number;
  // Block for defend skills
  blockMin?: number;
  blockMax?: number;
  // Status effects applied
  applyStatus?: { type: StatusType; stacks: number; value: number; target: 'player' | 'self' }[];
  // Multi-hit count
  hitCount?: number;
  // Heal amount
  healMin?: number;
  healMax?: number;
  // Cooldown in turns
  cooldown?: number;
  // Probability weight (higher = more likely to be chosen)
  weight: number;
  // Minimum HP% to use (e.g. heal only when low)
  minHpPercent?: number;
  // Animation color
  animColor: number;
}

// ============================================================================
// ENEMY DEFINITIONS
// ============================================================================

export interface EnemyDef {
  id: string;
  name: string;
  maxHP: number;
  skills: EnemySkill[];
  /** If true, this enemy acts twice per turn */
  doubleAction?: boolean;
  /** Passive status effects applied at battle start */
  passive?: StatusEffect[];
  /** Display color for fallback rectangle */
  color: number;
  /** Texture key for portrait */
  textureKey?: string;
}

export const ENEMY_DB: Record<string, EnemyDef> = {
  // ── Chapter 1 enemies ──
  guard: {
    id: 'guard',
    name: '暗影卫兵',
    maxHP: 42,
    color: 0xef4444,
    textureKey: 'enemy_guard',
    skills: [
      {
        id: 'guard_slash', name: '暗影斩', type: 'attack',
        description: '造成7-11点伤害', icon: '⚔',
        damageMin: 7, damageMax: 11, weight: 5, animColor: 0xef4444,
      },
      {
        id: 'guard_shield', name: '暗盾', type: 'defend',
        description: '获得5-9点格挡', icon: '🛡',
        blockMin: 5, blockMax: 9, weight: 3, animColor: 0x3b82f6,
      },
      {
        id: 'guard_weaken', name: '腐蚀之触', type: 'debuff',
        description: '造成4点伤害，施加2层虚弱', icon: '💧',
        damageMin: 4, damageMax: 4,
        applyStatus: [{ type: 'weakness', stacks: 2, value: 25, target: 'player' }],
        weight: 2, animColor: 0x60a5fa,
      },
    ],
  },

  hunter: {
    id: 'hunter',
    name: '崩坏猎手',
    maxHP: 48,
    color: 0xa855f7,
    textureKey: 'enemy_hunter',
    skills: [
      {
        id: 'hunter_strike', name: '崩坏爪击', type: 'attack',
        description: '造成9-13点伤害', icon: '⚔',
        damageMin: 9, damageMax: 13, weight: 4, animColor: 0xa855f7,
      },
      {
        id: 'hunter_poison', name: '毒牙', type: 'attack',
        description: '造成5点伤害，施加3层中毒', icon: '☠',
        damageMin: 5, damageMax: 5,
        applyStatus: [{ type: 'poison', stacks: 3, value: 3, target: 'player' }],
        weight: 3, animColor: 0x22c55e,
      },
      {
        id: 'hunter_frenzy', name: '狂乱连击', type: 'multi_attack',
        description: '造成3次3-5点伤害', icon: '⚡',
        damageMin: 3, damageMax: 5, hitCount: 3, weight: 2, animColor: 0xec4899,
      },
    ],
  },

  mage: {
    id: 'mage',
    name: '虚空法师',
    maxHP: 35,
    color: 0x06b6d4,
    textureKey: 'enemy_mage',
    skills: [
      {
        id: 'mage_bolt', name: '虚空弹', type: 'attack',
        description: '造成6-10点伤害', icon: '✦',
        damageMin: 6, damageMax: 10, weight: 3, animColor: 0x06b6d4,
      },
      {
        id: 'mage_burn', name: '灵魂灼烧', type: 'debuff',
        description: '施加4层灼烧', icon: '🔥',
        applyStatus: [{ type: 'burn', stacks: 4, value: 3, target: 'player' }],
        weight: 3, animColor: 0xf97316,
      },
      {
        id: 'mage_barrier', name: '虚空屏障', type: 'defend',
        description: '获得8-12点格挡', icon: '🛡',
        blockMin: 8, blockMax: 12, weight: 2, animColor: 0x06b6d4,
      },
      {
        id: 'mage_heal', name: '暗能修复', type: 'heal',
        description: '恢复6-10点生命', icon: '✚',
        healMin: 6, healMax: 10, weight: 2, animColor: 0x4ade80,
        minHpPercent: 50,
      },
    ],
  },

  elite_guard: {
    id: 'elite_guard',
    name: '精英禁卫',
    maxHP: 65,
    color: 0xf97316,
    textureKey: 'enemy_elite_guard',
    doubleAction: true,
    skills: [
      {
        id: 'elite_slash', name: '禁卫斩', type: 'attack',
        description: '造成10-15点伤害', icon: '⚔',
        damageMin: 10, damageMax: 15, weight: 4, animColor: 0xf97316,
      },
      {
        id: 'elite_shield', name: '钢铁意志', type: 'defend',
        description: '获得10-15点格挡', icon: '🛡',
        blockMin: 10, blockMax: 15, weight: 3, animColor: 0x3b82f6,
      },
      {
        id: 'elite_buff', name: '战吼', type: 'buff',
        description: '获得2层力量，每层+2攻击', icon: '💪',
        applyStatus: [{ type: 'strength', stacks: 2, value: 2, target: 'self' }],
        weight: 2, animColor: 0xfbbf24,
      },
      {
        id: 'elite_vulnerable', name: '破甲', type: 'attack',
        description: '造成6点伤害，施加2层易伤', icon: '💔',
        damageMin: 6, damageMax: 6,
        applyStatus: [{ type: 'vulnerable', stacks: 2, value: 50, target: 'player' }],
        weight: 2, animColor: 0xf87171,
      },
    ],
  },
};

// ============================================================================
// ENCOUNTER POOLS (for battle composition)
// ============================================================================

export interface EncounterDef {
  enemies: string[];  // EnemyDef IDs
  chapter: string;
  isBoss?: boolean;
}

export const ENCOUNTERS: Record<string, EncounterDef[]> = {
  chapter1: [
    { enemies: ['guard', 'hunter'], chapter: 'chapter1' },
    { enemies: ['guard', 'mage'], chapter: 'chapter1' },
    { enemies: ['hunter', 'mage'], chapter: 'chapter1' },
    { enemies: ['guard', 'guard'], chapter: 'chapter1' },
    { enemies: ['elite_guard'], chapter: 'chapter1', isBoss: true },
  ],
};

/**
 * Pick a random encounter for a chapter.
 */
export function getEncounter(chapterId: string): EncounterDef {
  const pool = ENCOUNTERS[chapterId] ?? ENCOUNTERS['chapter1'];
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Pick a random enemy skill based on weights and conditions.
 */
export function pickEnemySkill(enemy: EnemyDef, currentHp: number): EnemySkill {
  if (enemy.skills.length === 0) {
    return { id: 'fallback_attack', name: '攻击', type: 'attack', description: '造成5点伤害', icon: '⚔', damageMin: 5, damageMax: 5, weight: 1, animColor: 0xef4444 };
  }
  const eligible = enemy.skills.filter((skill) => {
    if (skill.minHpPercent && (currentHp / enemy.maxHP * 100) > skill.minHpPercent) return false;
    return true;
  });
  const pool = eligible.length > 0 ? eligible : enemy.skills;
  const totalWeight = pool.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight <= 0) return pool[0];
  let roll = Math.random() * totalWeight;
  for (const skill of pool) {
    roll -= skill.weight;
    if (roll <= 0) return skill;
  }
  return pool[pool.length - 1];
}
