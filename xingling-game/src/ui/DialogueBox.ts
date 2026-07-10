import Phaser from 'phaser';

export interface DialogueBoxConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  typeSpeed?: number;
  padding?: number;
}

export class DialogueBox extends Phaser.GameObjects.Container {
  private boxConfig: DialogueBoxConfig;
  private background!: Phaser.GameObjects.Rectangle;
  private nameText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private continueIndicator!: Phaser.GameObjects.Text;
  private typeTimer?: Phaser.Time.TimerEvent;
  private fullText: string = '';
  private currentCharIndex: number = 0;
  private isTyping: boolean = false;

  constructor(scene: Phaser.Scene, config: DialogueBoxConfig) {
    super(scene, 0, 0);
    this.boxConfig = config;
    scene.add.existing(this);
    this.setDepth(100);
    this.createElements();
  }

  showText(speaker: string, text: string): void {
    this.setVisible(true);

    if (speaker && speaker !== 'narrator') {
      this.nameText.setText(speaker);
      this.nameText.setVisible(true);
    } else {
      this.nameText.setText('');
      this.nameText.setVisible(false);
    }

    this.fullText = text;
    this.currentCharIndex = 0;
    this.bodyText.setText('');
    this.continueIndicator.setVisible(false);
    this.isTyping = true;
    this.startTypewriter(text);
  }

  handleInput(): void {
    if (this.isTyping) {
      this.completeTypewriter();
    } else {
      this.emit('advance');
    }
  }

  completeTypewriter(): void {
    if (this.typeTimer) {
      this.typeTimer.destroy();
      this.typeTimer = undefined;
    }
    this.bodyText.setText(this.fullText);
    this.isTyping = false;
    this.continueIndicator.setVisible(true);
    this.emit('typeComplete');
  }

  setBoxVisible(visible: boolean): void {
    this.setVisible(visible);
  }

  getIsTyping(): boolean {
    return this.isTyping;
  }

  private createElements(): void {
    const cfg = this.boxConfig;
    const pad = cfg.padding ?? 20;

    this.background = this.scene.add.rectangle(
      cfg.x, cfg.y, cfg.width, cfg.height,
      cfg.backgroundColor ?? 0x0a0a2e,
      cfg.backgroundAlpha ?? 0.92,
    );
    this.background.setOrigin(0.5);
    this.add(this.background);

    // Border with cosmic theme
    const border = this.scene.add.rectangle(cfg.x, cfg.y, cfg.width + 4, cfg.height + 4);
    border.setStrokeStyle(2, 0x6366f1, 0.6);
    border.setFillStyle(0x000000, 0);
    border.setOrigin(0.5);
    border.setDepth(-1);
    this.add(border);

    // Speaker name
    const nameLeft = cfg.x - cfg.width / 2 + pad;
    const nameTop = cfg.y - cfg.height / 2 + pad;
    this.nameText = this.scene.add.text(nameLeft, nameTop, '', {
      fontSize: '22px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#c4b5fd',
      fontStyle: 'bold',
    });
    this.add(this.nameText);

    // Body text
    const textTop = nameTop + 30;
    const textWidth = cfg.width - pad * 2;
    this.bodyText = this.scene.add.text(nameLeft, textTop, '', {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#e8d8c0',
      wordWrap: { width: textWidth },
      lineSpacing: 6,
    });
    this.add(this.bodyText);

    // Continue indicator
    const indicatorX = cfg.x + cfg.width / 2 - pad;
    const indicatorY = cfg.y + cfg.height / 2 - pad;
    this.continueIndicator = this.scene.add.text(indicatorX, indicatorY, '▼', {
      fontSize: '14px',
      color: '#a78bfa',
    }).setOrigin(1, 1);
    this.continueIndicator.setVisible(false);
    this.add(this.continueIndicator);

    this.scene.tweens.add({
      targets: this.continueIndicator,
      alpha: { from: 1, to: 0.3 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  private startTypewriter(text: string): void {
    const speed = this.boxConfig.typeSpeed ?? 30;
    this.currentCharIndex = 0;

    this.typeTimer = this.scene.time.addEvent({
      delay: speed,
      callback: () => {
        this.currentCharIndex++;
        this.bodyText.setText(text.substring(0, this.currentCharIndex));
        if (this.currentCharIndex >= text.length) {
          this.isTyping = false;
          this.continueIndicator.setVisible(true);
          if (this.typeTimer) {
            this.typeTimer.destroy();
            this.typeTimer = undefined;
          }
          this.emit('typeComplete');
        }
      },
      repeat: text.length - 1,
    });
  }
}
