import Phaser from 'phaser';
import { parseRichText, type RichTextSegment } from './RichText';

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

  // Rich text
  private richTextObjects: Phaser.GameObjects.Text[] = [];
  private richTextBaselineY: number = 0;
  private richTextStartX: number = 0;
  private richTextMaxWidth: number = 0;

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
    this.bodyText.setVisible(true);
    this.clearRichText();
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
    this.bodyText.setVisible(false);
    this.renderRichText(this.fullText);
    this.isTyping = false;
    this.continueIndicator.setVisible(true);
    this.emit('typeComplete');
  }

  setBoxVisible(visible: boolean): void {
    if (!visible) this.clearRichText();
    this.setVisible(visible);
  }

  getIsTyping(): boolean {
    return this.isTyping;
  }

  setTypeSpeed(speed: number): void {
    this.boxConfig.typeSpeed = speed;
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

    const border = this.scene.add.rectangle(cfg.x, cfg.y, cfg.width + 4, cfg.height + 4);
    border.setStrokeStyle(2, 0x6366f1, 0.6);
    border.setFillStyle(0x000000, 0);
    border.setOrigin(0.5);
    border.setDepth(-1);
    this.add(border);

    const nameLeft = cfg.x - cfg.width / 2 + pad;
    const nameTop = cfg.y - cfg.height / 2 + pad;
    this.nameText = this.scene.add.text(nameLeft, nameTop, '', {
      fontSize: '22px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#c4b5fd',
      fontStyle: 'bold',
    });
    this.add(this.nameText);

    this.richTextStartX = nameLeft;
    this.richTextBaselineY = nameTop + 30;
    this.richTextMaxWidth = cfg.width - pad * 2;

    this.bodyText = this.scene.add.text(this.richTextStartX, this.richTextBaselineY, '', {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#e8d8c0',
      wordWrap: { width: this.richTextMaxWidth, useAdvancedWrap: true },
      lineSpacing: 6,
    });
    this.add(this.bodyText);

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

  // ── Rich text rendering (segment-based, one Text per styled segment) ──

  private renderRichText(raw: string): void {
    this.clearRichText();

    const segments = parseRichText(raw);
    const defaultFont = '"Noto Serif SC", "Source Han Serif CN", STSong, serif';
    const baseFontSize = 18;
    const lineSpacing = 6;
    const lineHeight = baseFontSize + lineSpacing;

    let currentX = this.richTextStartX;
    let currentY = this.richTextBaselineY;

    // Build combined text per style-run to minimize Text objects.
    // Split on style boundaries (color/fontStyle/fontSize change).
    const runs: { text: string; color: string; fontStyle: string; fontSize: string }[] = [];

    for (const seg of segments) {
      const color = seg.color ?? '#e8d8c0';
      const fontStyle = seg.fontStyle ?? 'normal';
      const fontSize = seg.fontSize ?? `${baseFontSize}px`;

      // Merge with previous run if same style
      const last = runs[runs.length - 1];
      if (last && last.color === color && last.fontStyle === fontStyle && last.fontSize === fontSize) {
        last.text += seg.text;
      } else {
        runs.push({ text: seg.text, color, fontStyle, fontSize });
      }
    }

    // Measure with a temporary text to find character widths
    const measureText = this.scene.add.text(0, 0, '', {
      fontSize: `${baseFontSize}px`, fontFamily: defaultFont,
    }).setVisible(false);

    for (const run of runs) {
      const sizeNum = parseInt(run.fontSize);

      // Split run text into lines at '\n'
      const lines = run.text.split('\n');
      for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        if (li > 0) {
          currentX = this.richTextStartX;
          currentY += lineHeight;
        }

        // Check if this segment fits on current line
        measureText.setStyle({ fontSize: run.fontSize, fontFamily: defaultFont });
        measureText.setText(line);
        const segWidth = measureText.width;

        if (currentX + segWidth - this.richTextStartX > this.richTextMaxWidth && currentX > this.richTextStartX) {
          // Wrap to next line
          currentX = this.richTextStartX;
          currentY += lineHeight;
        }

        if (line.length > 0) {
          const style: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: run.fontSize,
            fontFamily: defaultFont,
            color: run.color,
            fontStyle: run.fontStyle as any,
            wordWrap: { width: this.richTextMaxWidth - (currentX - this.richTextStartX), useAdvancedWrap: true },
            lineSpacing,
          };

          const obj = this.scene.add.text(currentX, currentY, line, style);
          this.richTextObjects.push(obj);
          this.add(obj);

          // Update cursor position
          // If the text wrapped within this segment, move Y accordingly
          const actualLines = Math.ceil(obj.width / (this.richTextMaxWidth - (currentX - this.richTextStartX)));
          if (actualLines > 1) {
            currentX = this.richTextStartX;
            currentY += (actualLines - 1) * lineHeight;
          }
          currentX += obj.width;
        }
      }
    }

    measureText.destroy();

    // Subtle pulse on bold segments
    const boldObjs = this.richTextObjects.filter((o) => o.style.fontStyle === 'bold');
    if (boldObjs.length > 0) {
      this.scene.tweens.add({
        targets: boldObjs,
        alpha: { from: 1, to: 0.85 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private clearRichText(): void {
    for (const obj of this.richTextObjects) {
      this.scene.tweens.killTweensOf(obj);
      obj.destroy();
    }
    this.richTextObjects = [];
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
          this.bodyText.setVisible(false);
          this.renderRichText(this.fullText);
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
