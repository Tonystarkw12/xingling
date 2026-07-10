import Phaser from 'phaser';

export interface ChoiceDisplayOption {
  text: string;
  enabled?: boolean;
}

export class ChoicePanel extends Phaser.GameObjects.Container {
  private buttons: Phaser.GameObjects.Container[] = [];
  private currentOptions: ChoiceDisplayOption[] = [];
  private selectedIndex: number = 0;
  private promptText?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setDepth(200);
  }

  showChoices(prompt: string, options: ChoiceDisplayOption[]): void {
    this.clearButtons();
    this.currentOptions = options;
    this.setVisible(true);

    const btnWidth = 420;
    const btnHeight = 52;
    const spacing = 12;

    if (prompt) {
      this.promptText = this.scene.add.text(0, 0, prompt, {
        fontSize: '22px',
        fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5, 0.5);
      this.add(this.promptText);
    }

    const startY = prompt ? 40 : 0;
    options.forEach((option, index) => {
      const yOffset = startY + index * (btnHeight + spacing);
      const btn = this.createButton(option, index, yOffset, btnWidth, btnHeight);
      this.buttons.push(btn);
      this.add(btn);
    });

    this.selectedIndex = 0;
    this.highlightButton(0);

    this.setAlpha(0);
    this.scene.tweens.add({ targets: this, alpha: 1, duration: 200 });
  }

  hide(): void {
    this.clearButtons();
    this.setVisible(false);
  }

  private clearButtons(): void {
    this.buttons.forEach((b) => b.destroy());
    this.buttons = [];
    this.currentOptions = [];
    if (this.promptText) {
      this.promptText.destroy();
      this.promptText = undefined;
    }
  }

  private createButton(
    option: ChoiceDisplayOption,
    index: number,
    yOffset: number,
    width: number,
    height: number,
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(0, yOffset);
    const bgColor = 0x1e1b4b;
    const hoverColor = 0x4338ca;

    const bg = this.scene.add.rectangle(0, 0, width, height, bgColor, 0.9);
    bg.setOrigin(0.5);
    bg.setStrokeStyle(2, 0x6366f1, 0.8);
    container.add(bg);

    const text = this.scene.add.text(0, 0, option.text, {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#e0e7ff',
    }).setOrigin(0.5);
    container.add(text);

    bg.setInteractive({ useHandCursor: true });

    bg.on('pointerover', () => {
      bg.setFillStyle(hoverColor, 1);
      this.selectedIndex = index;
      this.highlightButton(index);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(bgColor, 0.9);
    });

    bg.on('pointerdown', () => {
      this.emit('selected', index, option.text);
    });

    (container as any)._bg = bg;
    (container as any)._defaultColor = bgColor;
    (container as any)._hoverColor = hoverColor;

    return container;
  }

  private highlightButton(index: number): void {
    this.buttons.forEach((btn, i) => {
      const bg = (btn as any)._bg as Phaser.GameObjects.Rectangle;
      const defaultColor = (btn as any)._defaultColor as number;
      const hoverColor = (btn as any)._hoverColor as number;
      if (bg) {
        bg.setFillStyle(i === index ? hoverColor : defaultColor, 0.9);
      }
    });
  }
}
