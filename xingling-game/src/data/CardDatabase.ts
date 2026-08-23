/**
 * Card data structure
 */
export type BattleForm = 'BSE' | 'ALE' | 'STAR';
export type CharacterId = 'ampere' | 'iris';
export type CardTarget = 'enemy' | 'self' | 'ally' | 'all-enemies' | 'all-allies';

export interface CardData {
  id: string;
  name: string;
  cost: number;
  type: 'attack' | 'defend' | 'skill';
  form: BattleForm;
  owner?: CharacterId;
  target?: CardTarget;
  description: string;
  damage?: number;
  block?: number;
  effects?: CardEffect[];
  rarity: 'common' | 'uncommon' | 'rare';
  artColor: number;
  icon: string;
  cooldown?: number;
}

export interface CardEffect {
  type: 'draw' | 'energy' | 'damage' | 'block' | 'heal' | 'poison' | 'burn' | 'weakness' | 'vulnerable' | 'lifesteal';
  value: number;
  target?: 'self' | 'enemy';
  /** Duration in turns for status effects */
  duration?: number;
}

/**
 * Card definitions - starter deck
 */
export const CARD_DATABASE: Record<string, CardData> = {
  // Attack cards
  strike: {
    id: 'strike',
    name: '打击',
    cost: 1,
    type: 'attack',
    form: 'BSE',
    owner: 'ampere',
    target: 'enemy',
    description: '造成6点伤害',
    damage: 6,
    rarity: 'common',
    artColor: 0xef4444,
    icon: '⚔',
  },
  heavy_strike: {
    id: 'heavy_strike',
    name: '重击',
    cost: 2,
    type: 'attack',
    form: 'BSE',
    owner: 'ampere',
    target: 'enemy',
    description: '造成12点伤害',
    damage: 12,
    rarity: 'common',
    artColor: 0xdc2626,
    icon: '✹',
  },
  electromagnetic_bolt: {
    id: 'electromagnetic_bolt',
    name: '电磁弹',
    cost: 1,
    type: 'attack',
    form: 'BSE',
    owner: 'ampere',
    target: 'enemy',
    description: '造成8点伤害\n安培尔的电磁权能',
    damage: 8,
    rarity: 'uncommon',
    artColor: 0xfbbf24,
    icon: 'ϟ',
    cooldown: 1,
  },

  // Defend cards
  defend: {
    id: 'defend',
    name: '防御',
    cost: 1,
    type: 'defend',
    form: 'BSE',
    owner: 'ampere',
    target: 'self',
    description: '获得5点格挡',
    block: 5,
    rarity: 'common',
    artColor: 0x3b82f6,
    icon: '🛡',
  },
  iron_wall: {
    id: 'iron_wall',
    name: '铁壁',
    cost: 2,
    type: 'defend',
    form: 'BSE',
    owner: 'ampere',
    target: 'self',
    description: '获得12点格挡',
    block: 12,
    rarity: 'uncommon',
    artColor: 0x1d4ed8,
    icon: '▰',
    cooldown: 1,
  },

  // Skill cards
  draw_power: {
    id: 'draw_power',
    name: '蓄力',
    cost: 0,
    type: 'skill',
    form: 'BSE',
    description: '获得1点能量\n抽1张牌',
    effects: [
      { type: 'energy', value: 1, target: 'self' },
      { type: 'draw', value: 1, target: 'self' },
    ],
    rarity: 'uncommon',
    artColor: 0xa78bfa,
    icon: '✦',
    cooldown: 2,
  },
  space_warp: {
    id: 'space_warp',
    name: '空间扭曲',
    cost: 1,
    type: 'skill',
    form: 'BSE',
    description: '获得3点格挡\n抽1张牌',
    block: 3,
    effects: [{ type: 'draw', value: 1, target: 'self' }],
    rarity: 'uncommon',
    artColor: 0x8b5cf6,
    icon: '◈',
    cooldown: 1,
  },
  star_fall: {
    id: 'star_fall',
    name: '星坠',
    cost: 2,
    type: 'attack',
    form: 'STAR',
    description: '星化技：造成24点伤害',
    damage: 12,
    rarity: 'rare',
    artColor: 0xfde047,
    icon: '☄',
    cooldown: 1,
  },
  star_guard: {
    id: 'star_guard',
    name: '星幕',
    cost: 1,
    type: 'defend',
    form: 'STAR',
    description: '星化技：获得18点格挡',
    block: 18,
    rarity: 'rare',
    artColor: 0xfef08a,
    icon: '✧',
    cooldown: 2,
  },
  ale_burst: {
    id: 'ale_burst',
    name: 'ALE过载',
    cost: 1,
    type: 'attack',
    form: 'ALE',
    description: 'ALE技：造成18点伤害',
    damage: 12,
    rarity: 'uncommon',
    artColor: 0xec4899,
    icon: '⟁',
    cooldown: 1,
  },
  ale_guard: {
    id: 'ale_guard',
    name: '崩坏屏障',
    cost: 1,
    type: 'defend',
    form: 'ALE',
    description: 'ALE技：获得8点格挡',
    block: 8,
    rarity: 'uncommon',
    artColor: 0xa855f7,
    icon: '⬡',
    cooldown: 1,
  },
  iris_shard: {
    id: 'iris_shard', name: '冰晶矛', cost: 1, type: 'attack', form: 'BSE', owner: 'iris', target: 'enemy',
    description: '造成7点冰霜伤害', damage: 7, rarity: 'common', artColor: 0x67e8f9, icon: '❄',
  },
  iris_zero: {
    id: 'iris_zero', name: '绝对零度', cost: 2, type: 'attack', form: 'BSE', owner: 'iris', target: 'all-enemies',
    description: '对全体敌人造成8点伤害', damage: 8, rarity: 'rare', artColor: 0x22d3ee, icon: '✣', cooldown: 2,
  },
  iris_barrier: {
    id: 'iris_barrier', name: '冰晶屏障', cost: 1, type: 'defend', form: 'BSE', owner: 'iris', target: 'ally',
    description: '指定队友获得8点格挡', block: 8, rarity: 'uncommon', artColor: 0x38bdf8, icon: '◇', cooldown: 1,
  },
  iris_restore: {
    id: 'iris_restore', name: '寒息复苏', cost: 1, type: 'skill', form: 'BSE', owner: 'iris', target: 'ally',
    description: '指定队友恢复6点生命', effects: [{ type: 'heal', value: 6 }],
    rarity: 'uncommon', artColor: 0xa5f3fc, icon: '✚', cooldown: 2,
  },

  // Iris ALE form — offensive support
  iris_ale_lance: {
    id: 'iris_ale_lance', name: '极冰长枪', cost: 2, type: 'attack', form: 'ALE', owner: 'iris', target: 'enemy',
    description: '造成12点伤害\n施加2层虚弱', damage: 12,
    effects: [{ type: 'weakness', value: 25, target: 'enemy', duration: 2 }],
    rarity: 'uncommon', artColor: 0x22d3ee, icon: '🔱', cooldown: 1,
  },
  iris_ale_frostbite: {
    id: 'iris_ale_frostbite', name: '冰封领域', cost: 1, type: 'attack', form: 'ALE', owner: 'iris', target: 'all-enemies',
    description: '对全体敌人造成5点伤害\n施加2层易伤', damage: 5,
    effects: [{ type: 'vulnerable', value: 50, target: 'enemy', duration: 2 }],
    rarity: 'uncommon', artColor: 0x67e8f9, icon: '❄', cooldown: 2,
  },
  iris_ale_heal: {
    id: 'iris_ale_heal', name: '冰息之环', cost: 1, type: 'skill', form: 'ALE', owner: 'iris', target: 'all-allies',
    description: '全体队友恢复4点生命',
    effects: [{ type: 'heal', value: 4 }],
    rarity: 'uncommon', artColor: 0xa5f3fc, icon: '✚',
  },

  // Iris STAR form — ultimate support
  iris_star_aura: {
    id: 'iris_star_aura', name: '极光守护', cost: 1, type: 'defend', form: 'STAR', owner: 'iris', target: 'all-allies',
    description: '全体队友获得10点格挡',
    block: 10, rarity: 'rare', artColor: 0x67e8f9, icon: '✧',
  },
  iris_star_heal: {
    id: 'iris_star_heal', name: '星霜圣疗', cost: 2, type: 'skill', form: 'STAR', owner: 'iris', target: 'all-allies',
    description: '全体队友恢复10点生命',
    effects: [{ type: 'heal', value: 10 }],
    rarity: 'rare', artColor: 0xfde047, icon: '✚', cooldown: 1,
  },
  iris_star_blast: {
    id: 'iris_star_blast', name: '星霜裁决', cost: 2, type: 'attack', form: 'STAR', owner: 'iris', target: 'enemy',
    description: '造成18点伤害', damage: 18,
    rarity: 'rare', artColor: 0xfde047, icon: '☄', cooldown: 1,
  },

  // ── New: Status effect cards ──
  venom_strike: {
    id: 'venom_strike', name: '毒液打击', cost: 1, type: 'attack', form: 'BSE', owner: 'ampere', target: 'enemy',
    description: '造成4点伤害\n施加3层中毒(每回合3点)',
    damage: 4, effects: [{ type: 'poison', value: 3, target: 'enemy', duration: 3 }],
    rarity: 'uncommon', artColor: 0x22c55e, icon: '☠',
  },
  flame_bolt: {
    id: 'flame_bolt', name: '烈焰弹', cost: 1, type: 'attack', form: 'BSE', owner: 'ampere', target: 'enemy',
    description: '造成5点伤害\n施加3层灼烧(每回合3点)',
    damage: 5, effects: [{ type: 'burn', value: 3, target: 'enemy', duration: 3 }],
    rarity: 'uncommon', artColor: 0xf97316, icon: '🔥',
  },
  crushing_blow: {
    id: 'crushing_blow', name: '碎裂击', cost: 2, type: 'attack', form: 'BSE', owner: 'ampere', target: 'enemy',
    description: '造成8点伤害\n施加2层易伤(受伤+50%)',
    damage: 8, effects: [{ type: 'vulnerable', value: 50, target: 'enemy', duration: 2 }],
    rarity: 'uncommon', artColor: 0xf87171, icon: '💔',
  },
  enfeeble: {
    id: 'enfeeble', name: '削弱', cost: 1, type: 'skill', form: 'BSE',
    description: '施加2层虚弱(攻击-25%)\n获得3点格挡',
    block: 3, effects: [{ type: 'weakness', value: 25, target: 'enemy', duration: 2 }],
    rarity: 'uncommon', artColor: 0x60a5fa, icon: '💧',
  },
  drain_strike: {
    id: 'drain_strike', name: '虹吸斩', cost: 2, type: 'attack', form: 'BSE', owner: 'ampere', target: 'enemy',
    description: '造成10点伤害\n回复等量50%生命',
    damage: 10, effects: [{ type: 'lifesteal', value: 50, target: 'self' }],
    rarity: 'rare', artColor: 0xec4899, icon: '🩸', cooldown: 2,
  },
  double_strike: {
    id: 'double_strike', name: '二连斩', cost: 1, type: 'attack', form: 'BSE', owner: 'ampere', target: 'enemy',
    description: '造成2次4点伤害',
    damage: 4, effects: [{ type: 'damage', value: 4, target: 'enemy' }],
    rarity: 'uncommon', artColor: 0xfbbf24, icon: '⚡',
  },
  iris_frostbite: {
    id: 'iris_frostbite', name: '霜噬', cost: 1, type: 'attack', form: 'BSE', owner: 'iris', target: 'enemy',
    description: '造成5点伤害\n施加2层虚弱',
    damage: 5, effects: [{ type: 'weakness', value: 25, target: 'enemy', duration: 2 }],
    rarity: 'uncommon', artColor: 0x67e8f9, icon: '❄',
  },
};

/**
 * Create a starter deck
 */
export function createDeckForForm(form: BattleForm): CardData[] {
  if (form === 'ALE') {
    return [
      CARD_DATABASE.ale_burst,
      CARD_DATABASE.ale_burst,
      CARD_DATABASE.ale_burst,
      CARD_DATABASE.ale_guard,
      CARD_DATABASE.ale_guard,
      CARD_DATABASE.draw_power,
    ].map((card) => card.form === 'BSE' ? { ...card, form: 'ALE' } : card);
  }

  if (form === 'STAR') {
    return [
      CARD_DATABASE.star_fall,
      CARD_DATABASE.star_fall,
      CARD_DATABASE.star_fall,
      CARD_DATABASE.star_guard,
      CARD_DATABASE.star_guard,
    ];
  }

  return createStarterDeck();
}
export function createCharacterDeck(owner: CharacterId, form: BattleForm = 'BSE'): CardData[] {
  if (owner === 'iris') {
    if (form === 'ALE') {
      return [
        CARD_DATABASE.iris_ale_lance, CARD_DATABASE.iris_ale_lance,
        CARD_DATABASE.iris_ale_frostbite,
        CARD_DATABASE.iris_ale_heal, CARD_DATABASE.iris_ale_heal,
        CARD_DATABASE.iris_barrier, CARD_DATABASE.iris_shard,
      ];
    }
    if (form === 'STAR') {
      return [
        CARD_DATABASE.iris_star_blast, CARD_DATABASE.iris_star_blast,
        CARD_DATABASE.iris_star_aura, CARD_DATABASE.iris_star_aura,
        CARD_DATABASE.iris_star_heal,
      ];
    }
    // BSE — base support
    return [
      CARD_DATABASE.iris_shard, CARD_DATABASE.iris_shard, CARD_DATABASE.iris_shard,
      CARD_DATABASE.iris_barrier, CARD_DATABASE.iris_barrier,
      CARD_DATABASE.iris_zero, CARD_DATABASE.iris_restore,
    ];
  }
  return createDeckForForm(form);
}

export function createStarterDeck(): CardData[] {
  const deck: CardData[] = [];

  // 5 strikes
  for (let i = 0; i < 5; i++) {
    deck.push(CARD_DATABASE.strike);
  }

  // 4 defends
  for (let i = 0; i < 4; i++) {
    deck.push(CARD_DATABASE.defend);
  }

  // 1 electromagnetic bolt
  deck.push(CARD_DATABASE.electromagnetic_bolt);

  return deck;
}
