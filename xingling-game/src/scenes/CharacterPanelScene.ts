import Phaser from 'phaser';
import { CHARACTER_PROFILES, type CharacterProfile } from '../data/CharacterDatabase';
import type { CharacterId } from '../data/CardDatabase';

/**
 * Character Panel Scene — view character stats, forms, skills, backstory.
 */
export class CharacterPanelScene extends Phaser.Scene {
  private currentId: CharacterId = 'ampere';
  private contentContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'CharacterPanelScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    this.currentId = 'ampere';

    // Background
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x080816);

    // Ambient stars
    for (let i = 0; i < 15; i++) {
      const star = this.add.circle(
        Math.random() * cam.width, Math.random() * cam.height,
        Math.random() * 1.5 + 0.5, 0x6366f1, Math.random() * 0.2 + 0.05,
      );
      this.tweens.add({ targets: star, alpha: 0.02, duration: 1500 + Math.random() * 2000, yoyo: true, repeat: -1 });
    }

    // Title
    this.add.text(cam.width / 2, 36, '人物面板', {
      fontSize: '28px', fontFamily: '"Noto Serif SC", serif',
      color: '#e0e7ff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Content container (re-rendered on character switch)
    this.contentContainer = this.add.container(0, 0);
    this.renderCharacter();

    // Character switch tabs at bottom
    this.createCharacterTabs();

    // Back button
    this.createButton(cam.width - 80, 36, 120, 36, '返回', 0x334155, () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
    });

    // ESC
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.on('down', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
    });

    cam.fadeIn(300, 0, 0, 0);
  }

  private renderCharacter(): void {
    this.contentContainer.removeAll(true);
    const profile = CHARACTER_PROFILES.find((p) => p.id === this.currentId);
    if (!profile) return;

    const cam = this.cameras.main;
    const leftX = cam.width * 0.22;
    const rightX = cam.width * 0.56;
    const topY = cam.height * 0.098;  // ~75px at 768

    // ── Left: Portrait ──
    this.renderPortrait(leftX, topY, profile);

    // ── Right: Info panels ──
    let y = topY;

    // Name + title
    this.addContentText(rightX, y, profile.name, {
      fontSize: '28px', color: '#fde047', fontStyle: 'bold',
    });
    y += 32;
    this.addContentText(rightX, y, `${profile.title} · ${profile.element}`, {
      fontSize: '15px', color: '#a78bfa',
    });
    y += 36;

    // Stats bars
    y = this.renderStats(rightX, y, profile);
    y += 10;

    // Forms
    y = this.renderForms(rightX, y, profile);
    y += 10;

    // Skills
    y = this.renderSkills(rightX, y, profile);
    y += 10;

    // Backstory
    this.renderBackstory(rightX, y, profile);
  }

  private renderPortrait(x: number, topY: number, profile: CharacterProfile): void {
    const cam = this.cameras.main;

    // Portrait frame
    const frameW = 240;
    const frameH = cam.height - topY - 100;
    const frame = this.add.rectangle(x, topY + frameH / 2, frameW, frameH, 0x0f172a, 0.8);
    frame.setStrokeStyle(2, 0x6366f1, 0.6);
    this.contentContainer.add(frame);

    // Character image
    if (this.textures.exists(profile.portraitKey)) {
      const img = this.add.image(x, topY + frameH * 0.45, profile.portraitKey);
      const tex = img.texture.getSourceImage();
      if (tex) {
        const maxH = frameH * 0.75;
        const scale = Math.min(maxH / tex.height, (frameW - 20) / tex.width);
        img.setScale(scale);
      }
      img.setOrigin(0.5, 0.5);
      this.contentContainer.add(img);
    } else {
      // Fallback circle
      const circle = this.add.circle(x, topY + frameH * 0.4, 60, 0x6366f1, 0.3);
      circle.setStrokeStyle(2, 0x818cf8);
      this.contentContainer.add(circle);
      this.addContentText(x, topY + frameH * 0.4, profile.name.charAt(0), {
        fontSize: '40px', color: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    // Name plate at bottom of portrait
    this.addContentText(x, topY + frameH - 16, profile.name, {
      fontSize: '18px', color: '#e0e7ff', fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private renderStats(x: number, y: number, profile: CharacterProfile): number {
    this.addContentText(x, y, '基础属性', {
      fontSize: '16px', color: '#c4b5fd', fontStyle: 'bold',
    });
    y += 28;

    const stats = [
      { label: 'HP', value: profile.stats.hp, max: 80, color: 0x22c55e },
      { label: '攻击', value: profile.stats.attack, max: 10, color: 0xef4444 },
      { label: '防御', value: profile.stats.defense, max: 10, color: 0x3b82f6 },
      { label: '速度', value: profile.stats.speed, max: 10, color: 0xfbbf24 },
    ];

    stats.forEach((stat) => {
      this.addContentText(x, y, stat.label, { fontSize: '13px', color: '#94a3b8' });
      const barX = x + 50;
      const barW = 200;
      const barH = 10;

      // Track
      const track = this.add.rectangle(barX, y + 6, barW, barH, 0x1e293b);
      track.setOrigin(0, 0.5);
      this.contentContainer.add(track);

      // Fill
      const pct = stat.value / stat.max;
      const fill = this.add.rectangle(barX, y + 6, barW * pct, barH, stat.color, 0.8);
      fill.setOrigin(0, 0.5);
      this.contentContainer.add(fill);

      // Value
      this.addContentText(barX + barW + 10, y, String(stat.value), {
        fontSize: '13px', color: '#e2e8f0', fontStyle: 'bold',
      });
      y += 22;
    });

    return y;
  }

  private renderForms(x: number, y: number, profile: CharacterProfile): number {
    this.addContentText(x, y, '形态切换', {
      fontSize: '16px', color: '#c4b5fd', fontStyle: 'bold',
    });
    y += 26;

    const formColors: Record<string, number> = { BSE: 0x64748b, ALE: 0xec4899, STAR: 0xfde047 };
    (['BSE', 'ALE', 'STAR'] as const).forEach((formKey) => {
      const form = profile.forms[formKey];
      const color = formColors[formKey];

      // Form name with color indicator
      const indicator = this.add.circle(x + 6, y + 7, 5, color);
      this.contentContainer.add(indicator);

      this.addContentText(x + 18, y, form.name, {
        fontSize: '13px', color: '#e2e8f0', fontStyle: 'bold',
      });
      y += 18;

      this.addContentText(x + 18, y, form.desc, {
        fontSize: '11px', color: '#94a3b8',
        wordWrap: { width: 380 }, lineSpacing: 2,
      });
      y += 48;
    });

    return y;
  }

  private renderSkills(x: number, y: number, profile: CharacterProfile): number {
    this.addContentText(x, y, '技能列表', {
      fontSize: '16px', color: '#c4b5fd', fontStyle: 'bold',
    });
    y += 26;

    profile.skills.forEach((skill) => {
      this.addContentText(x, y, `${skill.icon} ${skill.name}`, {
        fontSize: '13px', color: '#fde047', fontStyle: 'bold',
      });
      this.addContentText(x + 100, y, skill.desc, {
        fontSize: '12px', color: '#94a3b8',
      });
      y += 22;
    });

    return y;
  }

  private renderBackstory(x: number, y: number, profile: CharacterProfile): void {
    this.addContentText(x, y, '人物简介', {
      fontSize: '16px', color: '#c4b5fd', fontStyle: 'bold',
    });
    y += 26;

    this.addContentText(x, y, profile.backstory, {
      fontSize: '12px', color: '#cbd5e1',
      wordWrap: { width: 400 }, lineSpacing: 4,
    });
  }

  private addContentText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
    const defaults: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: '"Noto Serif SC", serif',
    };
    const t = this.add.text(x, y, text, { ...defaults, ...style });
    this.contentContainer.add(t);
    return t;
  }

  private createCharacterTabs(): void {
    const cam = this.cameras.main;
    const tabY = cam.height - 40;
    const tabWidth = 120;
    const gap = 20;
    const ids: CharacterId[] = CHARACTER_PROFILES.map((p) => p.id);
    const startX = cam.width / 2 - ((ids.length - 1) * (tabWidth + gap)) / 2;

    ids.forEach((id, i) => {
      const x = startX + i * (tabWidth + gap);
      const profile = CHARACTER_PROFILES.find((p) => p.id === id)!;
      const isActive = this.currentId === id;

      const bg = this.add.rectangle(x, tabY, tabWidth, 36, isActive ? 0x4338ca : 0x1e293b);
      bg.setStrokeStyle(2, isActive ? 0x818cf8 : 0x334155);
      bg.setInteractive({ useHandCursor: true });

      this.add.text(x, tabY, profile.name, {
        fontSize: '15px', fontFamily: '"Noto Serif SC", serif',
        color: isActive ? '#ffffff' : '#94a3b8', fontStyle: 'bold',
      }).setOrigin(0.5);

      bg.on('pointerdown', () => {
        if (this.currentId !== id) {
          this.currentId = id;
          this.scene.restart();
        }
      });
    });
  }

  private createButton(
    x: number, y: number, width: number, height: number,
    label: string, color: number, action: () => void,
  ): void {
    const bg = this.add.rectangle(x, y, width, height, color)
      .setStrokeStyle(2, 0x818cf8)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, y, label, {
      fontSize: '14px', fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setFillStyle(0x6366f1));
    bg.on('pointerout', () => bg.setFillStyle(color));
    bg.on('pointerdown', action);
  }
}
