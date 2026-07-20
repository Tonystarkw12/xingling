import Phaser from 'phaser';
import { type CardData } from '../data/CardDatabase';

/**
 * Card UI component - visual representation of a card in hand
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

    // Card background
    this.bg = this.scene.add.rectangle(0, 0, width, height, 0x1e1b4b, 0.95);
    this.bg.setStrokeStyle(2, 0x6366f1);
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
      wordWrap: { width: width - 20 },
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
    });

    this.bg.on('pointerdown', () => {
      if (!this.isPlayable) return;
      this.emit('cardPlayed', this.cardData);
    });
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
