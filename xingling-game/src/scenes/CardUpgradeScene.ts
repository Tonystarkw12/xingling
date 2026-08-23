import Phaser from 'phaser';
import { CARD_DATABASE, type CardData } from '../data/CardDatabase';
import { getCardUpgradeCost, getUpgradeImprovements, applyCardUpgrade, MAX_UPGRADE_LEVEL } from '../data/CardUpgradeSystem';
import { loadCardUpgrades, upgradeCard, loadGold, saveGold } from '../data/SaveSystem';

/**
 * Card Upgrade Scene — view all cards, upgrade with gold.
 */
export class CardUpgradeScene extends Phaser.Scene {
  private upgrades: Record<string, number> = {};
  private gold: number = 0;
  private selectedCardId: string | null = null;
  private contentContainer!: Phaser.GameObjects.Container;
  private goldText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'CardUpgradeScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    this.upgrades = loadCardUpgrades();
    this.gold = loadGold();
    this.selectedCardId = null;

    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x080816);

    // Title
    this.add.text(cam.width / 2, 30, '卡牌强化', {
      fontSize: '26px', fontFamily: '"Noto Serif SC", serif',
      color: '#e0e7ff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Gold
    this.goldText = this.add.text(cam.width - 20, 30, `💰 ${this.gold}`, {
      fontSize: '16px', color: '#fbbf24', fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // Content
    this.contentContainer = this.add.container(0, 0);
    this.renderCardGrid();

    // Back button
    this.createButton(cam.width - 70, cam.height - 30, 120, 36, '返回', 0x334155, () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
    });

    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.on('down', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
    });

    cam.fadeIn(300, 0, 0, 0);
  }

  private renderCardGrid(): void {
    this.contentContainer.removeAll(true);
    const cam = this.cameras.main;

    // Get upgradeable cards (unique by ID)
    const seen = new Set<string>();
    const cards = Object.values(CARD_DATABASE).filter((card) => {
      if (seen.has(card.id)) return false;
      seen.add(card.id);
      return card.owner !== 'iris'; // Only show ampere's cards
    });

    const cols = 5;
    const cardW = Math.min(140, cam.width * 0.12);
    const cardH = Math.min(160, cam.height * 0.21);
    const gap = cam.width * 0.01;
    const startX = cam.width * 0.026;
    const startY = cam.height * 0.085;

    cards.forEach((card, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gap) + cardW / 2;
      const y = startY + row * (cardH + gap) + cardH / 2;
      this.renderCardItem(x, y, cardW, cardH, card);
    });
  }

  private renderCardItem(x: number, y: number, w: number, h: number, card: CardData): void {
    const level = this.upgrades[card.id] ?? 0;
    const isMax = level >= MAX_UPGRADE_LEVEL;
    const isSelected = this.selectedCardId === card.id;

    const rarityColors: Record<string, number> = {
      common: 0x6366f1, uncommon: 0x22c55e, rare: 0x3b82f6, legendary: 0xfbbf24,
    };
    const borderColor = isSelected ? 0xfde047 : rarityColors[card.rarity] ?? 0x6366f1;

    // Card bg
    const bg = this.add.rectangle(x, y, w, h, 0x1e1b4b, 0.95);
    bg.setStrokeStyle(isSelected ? 3 : 2, borderColor);
    bg.setInteractive({ useHandCursor: true });
    this.contentContainer.add(bg);

    // Icon
    this.addContentText(x, y - 45, card.icon, { fontSize: '28px' });
    // Name
    const nameColor = isMax ? '#fbbf24' : '#e0e7ff';
    this.addContentText(x, y - 15, card.name, {
      fontSize: '13px', color: nameColor, fontStyle: 'bold',
    });
    // Level
    const levelStr = isMax ? 'MAX' : `+${level}`;
    this.addContentText(x, y + 2, levelStr, {
      fontSize: '12px', color: isMax ? '#fbbf24' : '#94a3b8',
    });

    // Type
    const typeNames: Record<string, string> = { attack: '攻击', defend: '防御', skill: '技能' };
    const typeColors: Record<string, string> = { attack: '#ef4444', defend: '#3b82f6', skill: '#a78bfa' };
    this.addContentText(x, y + 18, typeNames[card.type], {
      fontSize: '10px', color: typeColors[card.type],
    });

    // Stats
    if (card.damage) this.addContentText(x, y + 34, `⚔${card.damage}`, { fontSize: '11px', color: '#ef4444' });
    if (card.block) this.addContentText(x, y + 34, `🛡${card.block}`, { fontSize: '11px', color: '#3b82f6' });
    // Cost
    this.addContentText(x - w / 2 + 14, y - h / 2 + 14, `${card.cost}`, {
      fontSize: '14px', color: '#fbbf24', fontStyle: 'bold',
    });

    // Upgrade stars
    for (let s = 0; s < MAX_UPGRADE_LEVEL; s++) {
      const starX = x - 20 + s * 10;
      const starY = y + h / 2 - 16;
      const filled = s < level;
      this.addContentText(starX, starY, '★', {
        fontSize: '10px', color: filled ? '#fbbf24' : '#374151',
      });
    }

    bg.on('pointerdown', () => {
      this.selectedCardId = card.id;
      this.renderCardGrid();
      this.renderDetail(card);
    });

    // Show detail if selected
    if (isSelected) {
      this.renderDetail(card);
    }
  }

  private renderDetail(card: CardData): void {
    // Remove old detail (keep card grid)
    const detailKey = '_detail';
    const old = this.contentContainer.list.filter((child: any) => child._detailTag === detailKey);
    old.forEach((child) => child.destroy());

    const cam = this.cameras.main;
    const x = cam.width * 0.81;
    const y = cam.height * 0.104;
    const level = this.upgrades[card.id] ?? 0;
    const isMax = level >= MAX_UPGRADE_LEVEL;

    // Detail frame
    const frameW = Math.min(210, cam.width * 0.18);
    const frameH = Math.min(280, cam.height * 0.36);
    const frame = this.add.rectangle(x + frameW / 2, y + frameH / 2, frameW, frameH, 0x0f172a, 0.95);
    frame.setStrokeStyle(2, 0x6366f1, 0.5);
    (frame as any)._detailTag = detailKey;
    this.contentContainer.add(frame);

    let cy = y + 10;
    const addTag = (text: Phaser.GameObjects.Text) => {
      (text as any)._detailTag = detailKey;
      this.contentContainer.add(text);
      return text;
    };

    // Card name + level
    addTag(this.add.text(x + 5, cy, `${card.icon} ${card.name} +${level}`, {
      fontSize: '18px', fontFamily: '"Noto Serif SC", serif',
      color: '#fde047', fontStyle: 'bold',
    }));
    cy += 28;

    // Current stats
    const upgraded = applyCardUpgrade(card, level);
    addTag(this.add.text(x + 5, cy, `蓝耗: ${upgraded.cost}`, {
      fontSize: '13px', color: '#fbbf24',
    }));
    cy += 20;
    if (upgraded.damage) {
      addTag(this.add.text(x + 5, cy, `伤害: ${upgraded.damage}`, {
        fontSize: '13px', color: '#ef4444',
      }));
      cy += 18;
    }
    if (upgraded.block) {
      addTag(this.add.text(x + 5, cy, `格挡: ${upgraded.block}`, {
        fontSize: '13px', color: '#3b82f6',
      }));
      cy += 18;
    }
    cy += 10;

    // Description
    addTag(this.add.text(x + 5, cy, upgraded.description, {
      fontSize: '11px', color: '#94a3b8',
      wordWrap: { width: 190 }, lineSpacing: 3,
    }));
    cy += 60;

    // Next upgrade preview
    if (!isMax) {
      const improvements = getUpgradeImprovements(card.id, level + 1);
      addTag(this.add.text(x + 5, cy, '下一级提升:', {
        fontSize: '12px', color: '#22c55e', fontStyle: 'bold',
      }));
      cy += 18;
      improvements.forEach((imp) => {
        addTag(this.add.text(x + 5, cy, `+ ${imp}`, {
          fontSize: '11px', color: '#4ade80',
        }));
        cy += 16;
      });

      // Upgrade button
      const cost = getCardUpgradeCost(level);
      const canUpgrade = this.gold >= cost;
      const btnY = y + 255;
      const btnBg = this.add.rectangle(x + 95, btnY, 180, 36, canUpgrade ? 0x4338ca : 0x1e293b)
        .setStrokeStyle(2, canUpgrade ? 0x818cf8 : 0x334155)
        .setInteractive({ useHandCursor: true });
      (btnBg as any)._detailTag = detailKey;
      this.contentContainer.add(btnBg);
      const btnText = this.add.text(x + 95, btnY, `强化 (${cost}💰)`, {
        fontSize: '14px', fontFamily: '"Noto Serif SC", serif',
        color: canUpgrade ? '#ffffff' : '#6b7280', fontStyle: 'bold',
      }).setOrigin(0.5);
      (btnText as any)._detailTag = detailKey;
      this.contentContainer.add(btnText);

      btnBg.on('pointerdown', () => {
        if (!canUpgrade) return;
        this.gold -= cost;
        saveGold(this.gold);
        upgradeCard(card.id);
        this.upgrades = loadCardUpgrades();
        this.goldText.setText(`💰 ${this.gold}`);
        this.renderCardGrid();
        sfx.playClick();
      });
    } else {
      addTag(this.add.text(x + 5, cy, '已达最大等级', {
        fontSize: '14px', color: '#fbbf24', fontStyle: 'bold',
      }));
    }
  }

  private addContentText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
    const t = this.add.text(x, y, text, { fontFamily: '"Noto Serif SC", serif', ...style }).setOrigin(0.5);
    this.contentContainer.add(t);
    return t;
  }

  private createButton(
    x: number, y: number, width: number, height: number,
    label: string, color: number, action: () => void,
  ): void {
    const bg = this.add.rectangle(x, y, width, height, color)
      .setStrokeStyle(2, 0x818cf8)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontSize: '14px', fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setFillStyle(0x6366f1));
    bg.on('pointerout', () => bg.setFillStyle(color));
    bg.on('pointerdown', action);
  }
}

// Need SFX for click sound
import { sfx } from '../ui/SFXManager';
