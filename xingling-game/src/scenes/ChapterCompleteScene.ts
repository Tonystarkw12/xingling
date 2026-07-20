import Phaser from 'phaser';
import { saveCheckpoint } from '../data/SaveSystem';

export class ChapterCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ChapterCompleteScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    saveCheckpoint('complete');
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

    this.add.text(cam.width / 2, cam.height / 2 - 90, '第一章 · 自行始终', {
      fontSize: '40px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(cam.width / 2, cam.height / 2 - 25, '完成', {
      fontSize: '30px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#fde047',
    }).setOrigin(0.5);

    this.add.text(cam.width / 2, cam.height / 2 + 35, '安培尔在星火中迈出了第一步。', {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#c4b5fd',
    }).setOrigin(0.5);

    const replay = this.add.text(cam.width / 2, cam.height / 2 + 115, '重新体验第一章', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4338ca',
      padding: { x: 24, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    replay.on('pointerover', () => replay.setBackgroundColor('#6366f1'));
    replay.on('pointerout', () => replay.setBackgroundColor('#4338ca'));
    replay.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('TitleScreen'));
    });

    cam.fadeIn(800, 0, 0, 0);
  }
}
