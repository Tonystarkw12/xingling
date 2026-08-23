import Phaser from 'phaser';

export interface PauseMenuConfig {
  onResume?: () => void;
  onSettings?: () => void;
  onCharacters?: () => void;
  onTitleScreen?: () => void;
}

/**
 * Pause Menu overlay — triggered by ESC.
 * Freezes game interaction while open.
 */
export class PauseMenu {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private isOpen: boolean = false;
  private config: PauseMenuConfig;

  constructor(scene: Phaser.Scene, config: PauseMenuConfig = {}) {
    this.scene = scene;
    this.config = config;
    this.container = scene.add.container(0, 0).setDepth(3000).setVisible(false);

    const cam = scene.cameras.main;
    const cx = cam.width / 2;
    const cy = cam.height / 2;

    // Overlay
    const overlay = scene.add.rectangle(cx, cy, cam.width, cam.height, 0x000000, 0.75);
    overlay.setInteractive(); // Block input to game
    this.container.add(overlay);

    // Panel
    const panelW = 340;
    const panelH = 320;
    const panel = scene.add.rectangle(cx, cy, panelW, panelH, 0x0f172a, 0.97);
    panel.setStrokeStyle(2, 0x6366f1, 0.8);
    this.container.add(panel);

    // Title
    const title = scene.add.text(cx, cy - panelH / 2 + 36, '暂 停', {
      fontSize: '28px', fontFamily: '"Noto Serif SC", serif',
      color: '#e0e7ff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.container.add(title);

    // Decorative line
    const line = scene.add.graphics();
    line.lineStyle(1, 0x6366f1, 0.4);
    line.lineBetween(cx - panelW / 2 + 30, cy - panelH / 2 + 60, cx + panelW / 2 - 30, cy - panelH / 2 + 60);
    this.container.add(line);

    // Buttons
    const buttons = [
      { label: '继续游戏', color: 0x4338ca, action: () => this.close() },
      { label: '设置', color: 0x1e293b, action: () => this.handleSettings() },
      { label: '人物面板', color: 0x1e293b, action: () => this.handleCharacters() },
      { label: '返回标题', color: 0x7f1d1d, action: () => this.handleTitleScreen() },
    ];

    const btnW = 240;
    const btnH = 42;
    const btnGap = 12;
    const startY = cy - 40;

    buttons.forEach((btn, i) => {
      const by = startY + i * (btnH + btnGap);
      this.createButton(cx, by, btnW, btnH, btn.label, btn.color, btn.action);
    });

    // ESC key
    scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.on('down', () => {
      if (this.isOpen) this.close();
    });
  }

  open(): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.container.setVisible(true);
    this.container.setAlpha(0);
    this.scene.tweens.add({ targets: this.container, alpha: 1, duration: 200 });
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 150,
      onComplete: () => this.container.setVisible(false),
    });
    this.config.onResume?.();
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  private handleSettings(): void {
    this.close();
    this.config.onSettings?.();
  }

  private handleCharacters(): void {
    this.close();
    this.config.onCharacters?.();
  }

  private handleTitleScreen(): void {
    this.close();
    this.config.onTitleScreen?.();
  }

  private createButton(
    x: number, y: number, width: number, height: number,
    label: string, color: number, action: () => void,
  ): void {
    const bg = this.scene.add.rectangle(x, y, width, height, color)
      .setStrokeStyle(2, 0x818cf8, 0.6)
      .setInteractive({ useHandCursor: true });
    this.container.add(bg);

    const text = this.scene.add.text(x, y, label, {
      fontSize: '17px', fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.container.add(text);

    bg.on('pointerover', () => bg.setFillStyle(0x6366f1));
    bg.on('pointerout', () => bg.setFillStyle(color));
    bg.on('pointerdown', (pointer: Phaser.Input.Pointer, _lx: number, _ly: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      action();
    });
    text.on('pointerdown', (pointer: Phaser.Input.Pointer, _lx: number, _ly: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      action();
    });
  }
}
