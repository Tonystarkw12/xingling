import Phaser from 'phaser';

export class TitleScreen extends Phaser.Scene {
  private isStarting: boolean = false;

  constructor() {
    super({ key: 'TitleScreen' });
  }

  init(): void {
    this.isStarting = false;
  }

  create(): void {
    const cam = this.cameras.main;

    // Background: use storyboard S03 (title card) or fallback to S01
    const bgKey = this.textures.exists('bg_story03') ? 'bg_story03'
      : this.textures.exists('bg_story01') ? 'bg_story01' : null;

    if (bgKey) {
      const bg = this.add.image(cam.width / 2, cam.height / 2, bgKey);
      // Cover scaling (no stretching)
      const tex = bg.texture.getSourceImage();
      if (tex) {
        const scale = Math.max(cam.width / tex.width, cam.height / tex.height);
        bg.setScale(scale);
      }
      // Dark overlay for text contrast
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.4);
    } else {
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x0a0a1e);
    }

    // Title
    const title = this.add.text(cam.width / 2, cam.height * 0.25, '星 灵', {
      fontSize: '80px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#e0e7ff',
      fontStyle: 'bold',
      stroke: '#1e1b4b',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(cam.width / 2, cam.height * 0.25 + 90, '第一卷 · 自行始终', {
      fontSize: '28px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#c4b5fd',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Chapter title
    this.add.text(cam.width / 2, cam.height * 0.55, '雪原诺克城', {
      fontSize: '32px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#a78bfa',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(cam.width / 2, cam.height * 0.55 + 45, '第一章：为何而来', {
      fontSize: '22px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#c4b5fd',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Press enter
    const pressText = this.add.text(cam.width / 2, cam.height * 0.82, '点击或按 Enter 开始', {
      fontSize: '22px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: pressText,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // Title glow
    this.tweens.add({
      targets: title,
      alpha: { from: 1, to: 0.85 },
      duration: 2500,
      yoyo: true,
      repeat: -1,
    });

    // Input
    this.input.on('pointerdown', () => this.startGame());
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)?.on('down', () => this.startGame());
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)?.on('down', () => this.startGame());

    // Snow particles
    this.createSnow(cam);
  }

  private startGame(): void {
    if (this.isStarting) return;
    this.isStarting = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.time.delayedCall(600, () => {
      this.scene.start('Chapter1Scene');
    });
  }

  private createSnow(cam: Phaser.Cameras.Scene2D.Camera): void {
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * cam.width;
      const y = Math.random() * cam.height;
      const snow = this.add.circle(x, y, Math.random() * 2 + 1, 0xffffff, Math.random() * 0.3 + 0.1);
      snow.setDepth(10);
      this.tweens.add({
        targets: snow,
        y: cam.height + 10,
        x: snow.x + (Math.random() - 0.5) * 100,
        duration: 4000 + Math.random() * 4000,
        repeat: -1,
        onRepeat: () => {
          snow.setPosition(Math.random() * cam.width, -10);
        },
      });
    }
  }
}
