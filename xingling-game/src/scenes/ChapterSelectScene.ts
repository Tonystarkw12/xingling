import Phaser from 'phaser';
import { getChaptersWithState } from '../data/ChapterDatabase';
import { loadSave } from '../data/SaveSystem';

/**
 * Chapter Select Scene — displays available chapters as cards.
 */
export class ChapterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChapterSelectScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    const save = loadSave();
    const chapters = getChaptersWithState(save.completedChapters ?? []);

    // Background
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x080816);

    // Ambient particles
    for (let i = 0; i < 20; i++) {
      const star = this.add.circle(
        Math.random() * cam.width, Math.random() * cam.height,
        Math.random() * 1.5 + 0.5, 0x6366f1, Math.random() * 0.3 + 0.1,
      );
      this.tweens.add({ targets: star, alpha: 0.05, duration: 1500 + Math.random() * 2000, yoyo: true, repeat: -1 });
    }

    // Title
    this.add.text(cam.width / 2, 48, '章节选择', {
      fontSize: '32px', fontFamily: '"Noto Serif SC", serif',
      color: '#e0e7ff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Decorative line
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x6366f1, 0.5);
    lineGfx.lineBetween(cam.width * 0.2, 78, cam.width * 0.8, 78);

    // Chapter cards — vertical layout
    const cardWidth = Math.min(700, cam.width - cam.width * 0.07);
    const cardHeight = Math.min(130, cam.height * 0.17);
    const startY = cam.height * 0.156;
    const gap = cam.height * 0.02;

    chapters.forEach((ch, index) => {
      const y = startY + index * (cardHeight + gap);
      this.createChapterCard(cam.width / 2, y, cardWidth, cardHeight, ch, index);
    });

    // Back button
    this.createButton(cam.width / 2, cam.height - 46, 160, 40, '返回', 0x334155, () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
    });

    // ESC to go back
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.on('down', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
    });

    cam.fadeIn(300, 0, 0, 0);
  }

  private createChapterCard(
    x: number, y: number, width: number, height: number,
    ch: { id: string; title: string; subtitle: string; description: string; unlocked: boolean; completed: boolean; backgroundImage?: string; sceneKey?: string },
    _index: number,
  ): void {
    const bgColor = ch.unlocked ? 0x0f172a : 0x111827;
    const borderColor = ch.completed ? 0xfbbf24 : ch.unlocked ? 0x6366f1 : 0x374151;

    const container = this.add.container(x, y);

    // Card background
    const bg = this.add.rectangle(0, 0, width, height, bgColor, 0.95);
    bg.setStrokeStyle(2, borderColor, ch.unlocked ? 0.8 : 0.4);
    bg.setOrigin(0.5);
    container.add(bg);

    // Background thumbnail (left side)
    if (ch.backgroundImage && this.textures.exists(ch.backgroundImage)) {
      const thumb = this.add.image(-width / 2 + 80, 0, ch.backgroundImage);
      const tex = thumb.texture.getSourceImage();
      if (tex) {
        const scale = Math.min(140 / tex.width, (height - 16) / tex.height);
        thumb.setScale(scale);
      }
      thumb.setAlpha(ch.unlocked ? 0.8 : 0.3);
      container.add(thumb);

      // Mask overlay for thumbnail
      const mask = this.add.rectangle(-width / 2 + 80, 0, 140, height - 16, 0x000000, 0.3);
      container.add(mask);
    }

    // Chapter number + title
    const textX = ch.backgroundImage ? -width / 2 + 170 : -width / 2 + 24;

    const titleColor = ch.completed ? '#fbbf24' : ch.unlocked ? '#e0e7ff' : '#6b7280';
    const titleText = this.add.text(textX, -28, ch.title, {
      fontSize: '20px', fontFamily: '"Noto Serif SC", serif',
      color: titleColor, fontStyle: 'bold',
    });
    container.add(titleText);

    // Subtitle
    const subColor = ch.unlocked ? '#a78bfa' : '#4b5563';
    const subText = this.add.text(textX, -4, ch.subtitle, {
      fontSize: '14px', fontFamily: '"Noto Serif SC", serif',
      color: subColor,
    });
    container.add(subText);

    // Description
    const descColor = ch.unlocked ? '#94a3b8' : '#4b5563';
    const descText = this.add.text(textX, 18, ch.description, {
      fontSize: '13px', fontFamily: '"Noto Serif SC", serif',
      color: descColor,
      wordWrap: { width: width - 220 },
      lineSpacing: 3,
    });
    container.add(descText);

    // Status badge
    if (ch.completed) {
      const badge = this.add.text(width / 2 - 20, -height / 2 + 16, '✓ 已通关', {
        fontSize: '13px', color: '#fbbf24',
        backgroundColor: '#78350f', padding: { x: 8, y: 4 },
      }).setOrigin(1, 0);
      container.add(badge);
    } else if (!ch.unlocked) {
      // Lock icon
      const lock = this.add.text(width / 2 - 20, 0, '🔒', {
        fontSize: '28px',
      }).setOrigin(1, 0.5);
      container.add(lock);
    }

    // Click interaction
    if (ch.unlocked && ch.sceneKey) {
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerover', () => bg.setFillStyle(0x1e293b, 1));
      bg.on('pointerout', () => bg.setFillStyle(bgColor, 0.95));
      bg.on('pointerdown', () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => this.scene.start(ch.sceneKey));
      });
    }
  }

  private createButton(
    x: number, y: number, width: number, height: number,
    label: string, color: number, action: () => void,
  ): void {
    const bg = this.add.rectangle(x, y, width, height, color)
      .setStrokeStyle(2, 0x818cf8)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontSize: '16px', fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setFillStyle(0x6366f1));
    bg.on('pointerout', () => bg.setFillStyle(color));
    bg.on('pointerdown', action);
  }
}
