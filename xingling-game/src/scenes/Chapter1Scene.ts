import {
  BaseChapterScene,
  type DialogueEntry,
  type ChoiceOption,
} from './BaseChapterScene';
import { chapter1Dialogues } from '../data/chapter1';
import { saveCheckpoint } from '../data/SaveSystem';

export class Chapter1Scene extends BaseChapterScene {
  private sceneBg!: Phaser.GameObjects.Image;
  private currentBgKey: string = '';

  constructor() {
    super({ key: 'Chapter1Scene' });
  }

  protected initializeDialogues(): DialogueEntry[] {
    return chapter1Dialogues;
  }

  protected createBackground(): void {
    const cam = this.cameras.main;
    // Default dark background
    this.sceneBg = this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x0f0f23) as any;

    // Snow particles (always present)
    this.createSnow(cam);
  }

  protected createCharacters(): void {
    this.registerCharacter({
      id: 'ampere',
      textureKey: 'char_ampere',
      displayName: '安培尔',
      defaultPosition: 'right',
    });

    this.registerCharacter({
      id: 'iris',
      textureKey: 'char_iris',
      displayName: '艾莉丝',
      defaultPosition: 'left',
    });

    this.registerCharacter({
      id: 'peter',
      textureKey: 'char_peter',
      displayName: '彼得',
      defaultPosition: 'center',
    });
  }

  protected override onDialogueEvent(action: string, data?: Record<string, any>): void {
    if (action === 'set_background' && data?.key) {
      this.changeBackground(data.key);
    }
  }

  private changeBackground(key: string): void {
    if (!this.textures.exists(key) || key === this.currentBgKey) return;
    this.currentBgKey = key;

    const cam = this.cameras.main;

    // Remove old background
    if (this.sceneBg) {
      this.sceneBg.destroy();
    }

    // Create new background with cover scaling (no stretching)
    const bg = this.add.image(cam.width / 2, cam.height / 2, key);
    this.coverScale(bg, cam.width, cam.height);
    bg.setDepth(0);
    this.sceneBg = bg as any;

    // Fade in
    bg.setAlpha(0);
    this.tweens.add({
      targets: bg,
      alpha: 1,
      duration: 600,
    });
  }

  /**
   * Scale image to cover target area (like CSS background-size: cover).
   * Maintains aspect ratio, crops overflow.
   */
  private coverScale(img: Phaser.GameObjects.Image, targetW: number, targetH: number): void {
    const tex = img.texture.getSourceImage();
    if (!tex) return;
    const srcW = tex.width;
    const srcH = tex.height;
    const scale = Math.max(targetW / srcW, targetH / srcH);
    img.setScale(scale);
  }

  protected getBackgroundMusicKey(): string | undefined {
    return this.cache.audio.exists('bgm_episode1') ? 'bgm_episode1' : undefined;
  }

  protected initializeScene(): void {
    saveCheckpoint('chapter1');
    this.sound.stopAll();
    this.sound.removeAll();
    // Play story BGM
    if (this.cache.audio.exists('bgm_episode1')) {
      this.sound.add('bgm_episode1', { loop: true, volume: 0.5 }).play();
    }
  }

  protected onChoiceMade(choiceId: string, option: ChoiceOption): void {
    if (choiceId === 'empathy_choice') {
      if (option.text.includes('帮你')) {
        this.showFloatingText('艾莉丝好感度 +1', this.cameras.main.width / 2, 300, {
          color: '#f87171',
        });
      } else if (option.text.includes('一样')) {
        this.showFloatingText('共鸣 · 羁绊加深', this.cameras.main.width / 2, 300, {
          color: '#a78bfa',
        });
      } else {
        this.showFloatingText('沉默有时比言语更有力量', this.cameras.main.width / 2, 300, {
          color: '#94a3b8',
        });
      }
    }
  }

  protected onChapterComplete(): void {
    const cam = this.cameras.main;
    const overlay = this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0);
    overlay.setDepth(999);

    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 1500,
      onComplete: () => {
        const endText = this.add.text(cam.width / 2, cam.height / 2 - 60, '第一章 · 完', {
          fontSize: '36px',
          fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
          color: '#c4b5fd',
          fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(1000);

        endText.setAlpha(0);
        this.tweens.add({ targets: endText, alpha: 1, duration: 1000, delay: 500 });

        const battleText = this.add.text(cam.width / 2, cam.height / 2, '⚔ 进入战斗 ⚔', {
          fontSize: '24px',
          fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
          color: '#fbbf24',
          fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(1000);

        battleText.setAlpha(0);
        this.tweens.add({ targets: battleText, alpha: 1, duration: 1000, delay: 1500 });

        const hint = this.add.text(cam.width / 2, cam.height / 2 + 40, '（点击继续）', {
          fontSize: '16px',
          fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
          color: '#94a3b8',
        }).setOrigin(0.5).setDepth(1000);

        hint.setAlpha(0);
        this.tweens.add({
          targets: hint,
          alpha: 1,
          duration: 1000,
          delay: 2000,
          onComplete: () => {
            this.time.delayedCall(500, () => {
              this.input.once('pointerdown', () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                  this.scene.start('BattleScene');
                });
              });
            });
          },
        });
      },
    });
  }

  private showFloatingText(text: string, x: number, y: number, style?: any): void {
    const defaultStyle = {
      fontSize: '22px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#c4b5fd',
      stroke: '#000000',
      strokeThickness: 3,
      ...style,
    };
    const floatText = this.add.text(x, y, text, defaultStyle).setOrigin(0.5);
    floatText.setDepth(999);
    this.tweens.add({
      targets: floatText,
      y: y - 60,
      alpha: 0,
      duration: 1500,
      ease: 'Cubic.easeOut',
      onComplete: () => floatText.destroy(),
    });
  }

  private createSnow(cam: Phaser.Cameras.Scene2D.Camera): void {
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * cam.width;
      const y = Math.random() * cam.height * 0.7;
      const snow = this.add.circle(x, y, Math.random() * 2 + 0.5, 0xffffff, Math.random() * 0.3 + 0.05);
      snow.setDepth(2);
      this.tweens.add({
        targets: snow,
        y: cam.height + 10,
        x: snow.x + (Math.random() - 0.5) * 80,
        duration: 3000 + Math.random() * 4000,
        repeat: -1,
        onRepeat: () => {
          snow.setPosition(Math.random() * cam.width, -5);
        },
      });
    }
  }
}
