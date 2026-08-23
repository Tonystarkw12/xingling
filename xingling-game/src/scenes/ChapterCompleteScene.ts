import Phaser from 'phaser';
import { saveCheckpoint, markChapterCompleted } from '../data/SaveSystem';

export class ChapterCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChapterCompleteScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    saveCheckpoint('complete');
    markChapterCompleted('chapter1');
    this.sound.stopAll();
    this.sound.removeAll();

    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x080816);

    for (let i = 0; i < 36; i++) {
      const star = this.add.circle(
        Math.random() * cam.width,
        Math.random() * cam.height,
        Math.random() * 2 + 0.5,
        0xfde68a,
        Math.random() * 0.6 + 0.2,
      );
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: 900 + Math.random() * 1400,
        yoyo: true,
        repeat: -1,
      });
    }

    this.add.text(cam.width / 2, cam.height / 2 - 100, '第一章 · 自行始终', {
      fontSize: '40px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cam.width / 2, cam.height / 2 - 35, '完成', {
      fontSize: '30px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#fde047',
    }).setOrigin(0.5);

    this.add.text(cam.width / 2, cam.height / 2 + 15, '安培尔在星火中迈出了第一步。', {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#c4b5fd',
    }).setOrigin(0.5);

    // Button row
    const btnY = cam.height / 2 + 90;
    const gap = 140;

    this.createButton(cam.width / 2 - gap, btnY, 180, 44, '重新体验', 0x4338ca, () => {
      this.fadeTo('Chapter1Scene');
    });

    this.createButton(cam.width / 2, btnY, 180, 44, '章节选择', 0x1e3a5f, () => {
      this.fadeTo('ChapterSelectScene');
    });

    this.createButton(cam.width / 2 + gap, btnY, 180, 44, '返回标题', 0x334155, () => {
      this.fadeTo('TitleScreen');
    });

    cam.fadeIn(800, 0, 0, 0);
  }

  private createButton(x: number, y: number, w: number, h: number, label: string, color: number, action: () => void): void {
    const bg = this.add.rectangle(x, y, w, h, color)
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

  private fadeTo(sceneKey: string): void {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(400, () => this.scene.start(sceneKey));
  }
}
