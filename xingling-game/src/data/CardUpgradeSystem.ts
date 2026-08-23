/**
 * Card upgrade system — spend gold to power up cards.
 * Upgrades persist in SaveSystem as a map of cardId → level.
 */

import { CARD_DATABASE, type CardData } from './CardDatabase';

export interface CardUpgradeInfo {
  cardId: string;
  level: number;       // 0-5
  maxLevel: number;
  cost: number;
  improvements: string[];
}

const MAX_UPGRADE_LEVEL = 5;

/**
 * Get upgrade cost for a card at a given level.
 */
export function getCardUpgradeCost(level: number): number {
  return 40 + level * 30;
}

/**
 * Get the improvements an upgrade provides.
 */
export function getUpgradeImprovements(cardId: string, level: number): string[] {
  const card = CARD_DATABASE[cardId];
  if (!card) return [];

  const improvements: string[] = [];
  const pct = level * 15; // Each level adds 15%

  if (card.damage) {
    const bonus = Math.max(1, Math.round(card.damage * pct / 100));
    improvements.push(`伤害 +${bonus}`);
  }
  if (card.block) {
    const bonus = Math.max(1, Math.round(card.block * pct / 100));
    improvements.push(`格挡 +${bonus}`);
  }
  if (card.effects) {
    for (const effect of card.effects) {
      if (effect.type === 'heal') {
        const bonus = Math.max(1, Math.round(effect.value * pct / 100));
        improvements.push(`治疗 +${bonus}`);
      }
    }
  }
  if (level >= 3 && card.cost > 0) {
    improvements.push('蓝耗 -1');
  }
  return improvements;
}

/**
 * Apply upgrades to a card, returning a new card with boosted stats.
 */
export function applyCardUpgrade(card: CardData, level: number): CardData {
  if (level <= 0) return card;

  const pct = level * 15;
  const upgraded = { ...card };

  if (upgraded.damage) {
    upgraded.damage += Math.max(1, Math.round(upgraded.damage * pct / 100));
  }
  if (upgraded.block) {
    upgraded.block += Math.max(1, Math.round(upgraded.block * pct / 100));
  }
  if (upgraded.effects) {
    upgraded.effects = upgraded.effects.map((effect) => {
      if (effect.type === 'heal' || effect.type === 'damage' || effect.type === 'block') {
        return { ...effect, value: effect.value + Math.max(1, Math.round(effect.value * pct / 100)) };
      }
      return effect;
    });
  }
  // Cost reduction at level 3+
  if (level >= 3 && upgraded.cost > 0) {
    upgraded.cost = Math.max(0, upgraded.cost - 1);
  }

  // Update description
  upgraded.description = buildUpgradedDescription(upgraded, level);

  return upgraded;
}

function buildUpgradedDescription(card: CardData, level: number): string {
  let desc = '';
  if (card.damage) desc += `造成${card.damage}点伤害`;
  if (card.block) desc += `${desc ? '\n' : ''}获得${card.block}点格挡`;
  if (card.effects) {
    for (const eff of card.effects) {
      const labels: Record<string, string> = {
        draw: '抽牌', energy: '能量', heal: '治疗', damage: '伤害', block: '格挡',
        poison: '中毒', burn: '灼烧', weakness: '虚弱', vulnerable: '易伤', lifesteal: '吸血',
      };
      const label = labels[eff.type] ?? eff.type;
      const suffix = eff.duration ? `(${eff.duration}回合)` : '';
      desc += `${desc ? '\n' : ''}${label}+${eff.value}${suffix}`;
    }
  }
  if (card.cooldown) desc += `${desc ? '\n' : ''}${card.cooldown}回合冷却`;
  return desc;
}

/**
 * Get all upgradeable cards from the database (player's usable cards).
 */
export function getUpgradeableCards(): CardData[] {
  return Object.values(CARD_DATABASE).filter(
    (card) => card.owner !== 'iris' && card.form === 'BSE' || card.form === 'ALE' || card.form === 'STAR',
  );
}

export { MAX_UPGRADE_LEVEL };
