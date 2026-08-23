import Phaser from 'phaser';
import { type CardData } from '../data/CardDatabase';

/**
 * Card UI component - visual representation of a card in hand.
 * Supports damage preview tooltip on hover.
 */
export class Card extends Phaser.GameObjects.Container {
  private cardData: CardData;
  private bg!: Phaser.GameObjects.Rectangle;
  private artRect!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private costText!: Phaser.GameObjects.Text;
  private descText!: Phaser.GameObjects.Text;
  private isHovered: boolean = false;
  private originalY: number = 0;
  private isPlayable: boolean = true;
  private cooldownRemaining: number;
  private tooltip?: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number, cardData: CardData, cooldownRemaining: number = 0) {
    super(scene, x, y);
    this.cardData = cardData;
    this.cooldownRemaining = cooldownRemaining;
    this.originalY = y;
    scene.add.existing(this);
    this.setDepth(100);
    this.createCard();
    this.setupInteractions();
  }

  private createCard(): void {
    const width = 120;
    const height = 170;

    // Rarity-colored border
    const rarityColors: Record<string, number> = {
      common: 0x6366f1, uncommon: 0x22c55e, rare: 0x3b82f6, legendary: 0xfbbf24,
    };
    const borderColor = rarityColors[this.cardData.rarity] ?? 0x6366f1;

    // Card background
    this.bg = this.scene.add.rectangle(0, 0, width, height, 0x1e1b4b, 0.95);
    this.bg.setStrokeStyle(2, borderColor);
    this.add(this.bg);

    // Art area
    const artHeight = 60;
    this.artRect = this.scene.add.rectangle(
      0, -height / 2 + artHeight / 2 + 10,
      width - 16, artHeight,
      this.cardData.artColor, 0.6,
    );
    this.artRect.setStrokeStyle(1, 0x4338ca);
    this.add(this.artRect);

    const iconText = this.scene.add.text(0, this.artRect.y, this.cardData.icon, {
      fontSize: '32px',
      color: '#ffffff',
      stroke: '#111827',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add(iconText);

    if (this.cardData.cooldown) {
      const cooldownText = this.scene.add.text(width / 2 - 8, -height / 2 + 8,
        this.cooldownRemaining > 0 ? `CD ${this.cooldownRemaining}` : `冷却 ${this.cardData.cooldown}`, {
          fontSize: '10px',
          color: this.cooldownRemaining > 0 ? '#fca5a5' : '#cbd5e1',
          backgroundColor: '#0f172a',
          padding: { x: 4, y: 3 },
        }).setOrigin(1, 0);
      this.add(cooldownText);
    }

    // Card name
    this.nameText = this.scene.add.text(0, this.artRect.y + artHeight / 2 + 12, this.cardData.name, {
      fontSize: '14px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#e0e7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.nameText);

    // Cost circle
    const costBg = this.scene.add.circle(-width / 2 + 18, -height / 2 + 18, 14, 0x312e81);
    costBg.setStrokeStyle(2, 0x6366f1);
    this.add(costBg);

    this.costText = this.scene.add.text(-width / 2 + 18, -height / 2 + 18, String(this.cardData.cost), {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#fbbf24',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(this.costText);

    // Description
    this.descText = this.scene.add.text(0, 25, this.cardData.description, {
      fontSize: '11px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#c4b5fd',
      wordWrap: { width: width - 20, useAdvancedWrap: true },
      align: 'center',
      lineSpacing: 2,
    }).setOrigin(0.5);
    this.add(this.descText);

    // Type indicator
    const typeColors: Record<string, string> = {
      attack: '#ef4444',
      defend: '#3b82f6',
      skill: '#a78bfa',
    };
    const typeNames: Record<string, string> = {
      attack: '攻击',
      defend: '防御',
      skill: '技能',
    };
    const typeText = this.scene.add.text(0, height / 2 - 14, typeNames[this.cardData.type], {
      fontSize: '10px',
      color: typeColors[this.cardData.type],
    }).setOrigin(0.5);
    this.add(typeText);
  }

  private setupInteractions(): void {
    this.bg.setInteractive({ useHandCursor: true });

    this.bg.on('pointerover', () => {
      if (!this.isPlayable) return;
      this.isHovered = true;
      this.scene.tweens.add({
        targets: this,
        y: this.originalY - 30,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 150,
        ease: 'Cubic.easeOut',
      });
      this.showTooltip();
    });

    this.bg.on('pointerout', () => {
      this.isHovered = false;
      this.scene.tweens.add({
        targets: this,
        y: this.originalY,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Cubic.easeOut',
      });
      this.hideTooltip();
    });

    this.bg.on('pointerdown', () => {
      if (!this.isPlayable) return;
      this.hideTooltip();
      this.emit('cardPlayed', this.cardData);
    });
  }

  /**
   * Show a tooltip with damage preview and detailed effects.
   */
  private showTooltip(): void {
    this.hideTooltip();

    const cam = this.scene.cameras.main;
    const tooltipW = 200;
    const lines: string[] = [];

    // Card name + type
    const typeNames: Record<string, string> = { attack: '攻击', defend: '防御', skill: '技能' };
    lines.push(`${this.cardData.name} · ${typeNames[this.cardData.type]}`);
    lines.push(`蓝耗: ${this.cardData.cost}`);

    if (this.cardData.damage) {
      lines.push(`伤害: ${this.cardData.damage} (受形态加成)`);
    }
    if (this.cardData.block) {
      lines.push(`格挡: +${this.cardData.block}`);
    }
    if (this.cardData.effects) {
      for (const eff of this.cardData.effects) {
        const labels: Record<string, string> = {
          draw: '抽牌', energy: '能量', heal: '治疗', damage: '伤害', block: '格挡',
        };
        lines.push(`${labels[eff.type] ?? eff.type}: +${eff.value}`);
      }
    }
    if (this.cardData.cooldown) {
      lines.push(`冷却: ${this.cardData.cooldown}回合`);
    }

    // Position tooltip above card
    const tx = Math.min(this.x, cam.width - tooltipW / 2 - 10);
    const ty = this.originalY - 130;

    this.tooltip = this.scene.add.container(tx, ty).setDepth(300);

    const lineH = 18;
    const bgH = lines.length * lineH + 16;
    const bg = this.scene.add.rectangle(0, bgH / 2, tooltipW, bgH, 0x0f172a, 0.97);
    bg.setStrokeStyle(1, 0x6366f1, 0.6);
    this.tooltip.add(bg);

    lines.forEach((line, i) => {
      const color = i === 0 ? '#fde047' : '#e2e8f0';
      const size = i === 0 ? '13px' : '12px';
      const text = this.scene.add.text(-tooltipW / 2 + 10, 8 + i * lineH, line, {
        fontSize: size, fontFamily: '"Noto Serif SC", serif',
        color, fontStyle: i === 0 ? 'bold' : 'normal',
      });
      this.tooltip?.add(text);
    });
  }

  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = undefined;
    }
  }

  setPlayable(playable: boolean): void {
    this.isPlayable = playable;
    if (!playable) {
      this.setAlpha(0.5);
      this.bg.removeInteractive();
    }
  }

  playCardAnimation(targetX: number, targetY: number, onComplete: () => void): void {
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY,
      scaleX: 0.6,
      scaleY: 0.6,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeIn',
      onComplete,
    });
  }

  getCardData(): CardData {
    return this.cardData;
  }
}
