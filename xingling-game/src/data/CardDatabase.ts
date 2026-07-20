/**
 * Card data structure
 */
export type BattleForm = 'BSE' | 'ALE' | 'STAR';
export type CharacterId = 'ampere' | 'iris';
export type CardTarget = 'enemy' | 'self' | 'ally' | 'all-enemies';

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
  type: 'draw' | 'energy' | 'damage' | 'block' | 'heal';
  value: number;
  target?: 'self' | 'enemy';
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
