import Phaser from 'phaser';
import { clearSave, loadSave, sceneForCheckpoint } from '../data/SaveSystem';

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
    const save = loadSave();
    const bgKey = this.textures.exists('bg_story03') ? 'bg_story03'
      : this.textures.exists('bg_story01') ? 'bg_story01' : null;

    if (bgKey) {
      const bg = this.add.image(cam.width / 2, cam.height / 2, bgKey);
      const tex = bg.texture.getSourceImage();
      if (tex) bg.setScale(Math.max(cam.width / tex.width, cam.height / tex.height));
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.52);
    } else {
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x0a0a1e);
    }

    const title = this.add.text(cam.width / 2, cam.height * 0.2, '星 灵', {
      fontSize: '80px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#e0e7ff',
      fontStyle: 'bold',
      stroke: '#1e1b4b',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(cam.width / 2, cam.height * 0.2 + 88, '第一卷 · 自行始终', {
      fontSize: '27px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#c4b5fd',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(cam.width / 2, cam.height * 0.48, '雪原诺克城 · 第一章：为何而来', {
      fontSize: '24px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#a78bfa',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const hasProgress = save.updatedAt !== '';
    if (hasProgress) {
      this.createButton(cam.width / 2, cam.height * 0.56, '继续游戏', 0x4338ca, () => {
        this.startScene(sceneForCheckpoint(save.checkpoint));
      });

      // Two-column layout for secondary buttons
      const colL = cam.width / 2 - 120;
      const colR = cam.width / 2 + 120;
      const row1Y = cam.height * 0.66;

      this.createButton(colL, row1Y, '章节选择', 0x1e3a5f, () => {
        this.startScene('ChapterSelectScene');
      }, 200, 42);

      this.createButton(colR, row1Y, '人物', 0x1e3a5f, () => {
        this.startScene('CharacterPanelScene');
      }, 200, 42);

      const row2Y = cam.height * 0.75;
      this.createButton(colL, row2Y, '装备', 0x1e3a5f, () => {
        this.startScene('EquipmentScene');
      }, 200, 42);

      this.createButton(colR, row2Y, '卡牌强化', 0x1e3a5f, () => {
        this.startScene('CardUpgradeScene');
      }, 200, 42);

      const row3Y = cam.height * 0.84;
      this.createButton(colL, row3Y, '设置', 0x1e293b, () => {
        this.startScene('SettingsScene');
      }, 200, 42);

      this.createButton(colR, row3Y, '新游戏', 0x334155, () => {
        clearSave();
        this.startScene('TutorialScene');
      }, 200, 42);
    } else {
      this.createButton(cam.width / 2, cam.height * 0.62, '新游戏', 0x334155, () => {
        clearSave();
        this.startScene('TutorialScene');
      });

      this.createButton(cam.width / 2, cam.height * 0.72, '设置', 0x1e293b, () => {
        this.startScene('SettingsScene');
      });
    }

    if (hasProgress) {
      const clear = this.add.text(cam.width / 2, cam.height - 30, '清除存档', {
        fontSize: '14px',
        color: '#94a3b8',
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      clear.on('pointerdown', (pointer: Phaser.Input.Pointer, _x: number, _y: number, event: Phaser.Types.Input.EventData) => {
        event.stopPropagation();
        clearSave();
        this.scene.restart();
      });
    }

    this.add.text(cam.width / 2, cam.height - 24, '点击按钮选择 · Enter 开始新游戏', {
      fontSize: '13px',
      color: '#64748b',
    }).setOrigin(0.5);

    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)?.on('down', () => {
      if (!this.isStarting) this.startScene('TutorialScene');
    });

    this.tweens.add({ targets: title, alpha: { from: 1, to: 0.85 }, duration: 2500, yoyo: true, repeat: -1 });
    this.createSnow(cam);
  }

  private createButton(x: number, y: number, label: string, color: number, action: () => void, width?: number, height?: number): void {
    const btnWidth = width ?? 220;
    const btnHeight = height ?? 48;
    const button = this.add.rectangle(x, y, btnWidth, btnHeight, color)
      .setStrokeStyle(2, 0x818cf8)
      .setInteractive({ useHandCursor: true });
    const textSize = btnHeight >= 44 ? 19 : 16;
    const text = this.add.text(x, y, label, {
      fontSize: `${textSize}px`,
      fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    text.setInteractive({ useHandCursor: true });
    button.on('pointerdown', action);
    text.on('pointerdown', action);
  }

  private startScene(key: string): void {
    if (this.isStarting) return;
    this.isStarting = true;
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(500, () => this.scene.start(key));
  }

  private createSnow(cam: Phaser.Cameras.Scene2D.Camera): void {
    for (let i = 0; i < 30; i++) {
      const snow = this.add.circle(
        Math.random() * cam.width,
        Math.random() * cam.height,
        Math.random() * 2 + 1,
        0xffffff,
        Math.random() * 0.3 + 0.1,
      ).setDepth(10);
      this.tweens.add({
        targets: snow,
        y: cam.height + 10,
        x: snow.x + (Math.random() - 0.5) * 100,
        duration: 4000 + Math.random() * 4000,
        repeat: -1,
        onRepeat: () => snow.setPosition(Math.random() * cam.width, -10),
      });
    }
  }
}
