import Phaser from 'phaser';
import { loadSettings, saveSettings, getDefaultSettings, getResolutionSize, type GameSettings } from '../data/SettingsSystem';

/**
 * Settings Scene — volume sliders, text speed, toggles.
 * Uses pure Phaser graphics (no DOM).
 */
export class SettingsScene extends Phaser.Scene {
  private settings!: GameSettings;

  constructor() {
    super({ key: 'SettingsScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    this.settings = loadSettings();

    // Background
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x080816);

    // Title
    this.add.text(cam.width / 2, 52, '设 置', {
      fontSize: '36px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#e0e7ff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Decorative line
    const lineGfx = this.add.graphics();
    lineGfx.lineStyle(1, 0x6366f1, 0.5);
    lineGfx.lineBetween(cam.width * 0.2, 82, cam.width * 0.8, 82);

    const colX = cam.width / 2;
    let yPos = cam.height * 0.156;  // ~120px at 768
    const rowGap = cam.height * 0.09;  // ~70px at 768

    // ── Volume sliders ──
    yPos = this.createSectionLabel(colX, yPos, '音量设置');

    this.createSlider(colX, yPos, 'BGM 音量', 'bgmVolume');
    yPos += rowGap;

    this.createSlider(colX, yPos, '语音音量', 'voiceVolume');
    yPos += rowGap;

    this.createSlider(colX, yPos, '音效音量', 'sfxVolume');
    yPos += rowGap + 10;

    // ── Text speed ──
    yPos = this.createSectionLabel(colX, yPos, '文字速度');
    this.createTextSpeedSelector(colX, yPos);
    yPos += rowGap + 10;

    // ── Toggles ──
    yPos = this.createSectionLabel(colX, yPos, '其他');
    this.createToggle(colX, yPos, '自动播放对话', 'autoAdvance');
    yPos += 56;
    this.createToggle(colX, yPos, '全屏模式', 'fullscreen');
    yPos += 56;

    // ── Resolution ──
    yPos = this.createSectionLabel(colX, yPos, '分辨率');
    this.createResolutionSelector(colX, yPos);
    yPos += 60;

    // ── Buttons ──
    this.createButton(colX - 100, yPos, 160, 42, '恢复默认', 0x334155, () => {
      this.settings = getDefaultSettings();
      saveSettings(this.settings);
      this.scene.restart();
    });

    this.createButton(colX + 100, yPos, 160, 42, '返回', 0x4338ca, () => {
      this.goBack();
    });

    // ESC to go back
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.on('down', () => {
      this.goBack();
    });

    cam.fadeIn(300, 0, 0, 0);
  }

  private createSectionLabel(x: number, y: number, text: string): number {
    this.add.text(x, y, text, {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#a78bfa',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    return y + 30;
  }

  private createSlider(x: number, y: number, label: string, key: keyof GameSettings): void {
    const cam = this.cameras.main;
    const sliderWidth = Math.min(320, cam.width * 0.28);
    const sliderHeight = 8;
    const leftX = x - sliderWidth / 2;

    // Label
    this.add.text(leftX, y - 22, label, {
      fontSize: '15px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#e2e8f0',
    });

    // Value text
    const valueText = this.add.text(leftX + sliderWidth, y - 22, `${this.settings[key]}`, {
      fontSize: '15px',
      fontFamily: 'Arial',
      color: '#fbbf24',
    }).setOrigin(1, 0);

    // Track background
    const track = this.add.rectangle(x, y, sliderWidth, sliderHeight, 0x1e293b);
    track.setOrigin(0.5);

    // Fill bar
    const fill = this.add.rectangle(leftX, y, 0, sliderHeight, 0x6366f1);
    fill.setOrigin(0, 0.5);

    // Thumb
    const pct = (this.settings[key] as number) / 100;
    const thumbX = leftX + sliderWidth * pct;
    const thumb = this.add.circle(thumbX, y, 12, 0xc4b5fd);
    thumb.setStrokeStyle(2, 0x6366f1);
    thumb.setInteractive({ useHandCursor: true, draggable: true });

    // Hit area for clicking on track
    const hitArea = this.add.rectangle(x, y, sliderWidth, 28, 0x000000, 0);
    hitArea.setInteractive({ useHandCursor: true });

    // Update visual
    const updateVisual = (value: number) => {
      const p = value / 100;
      fill.width = sliderWidth * p;
      thumb.x = leftX + sliderWidth * p;
      valueText.setText(String(Math.round(value)));
    };
    updateVisual(this.settings[key] as number);

    // Click on track
    hitArea.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const localX = pointer.x - leftX;
      const value = Math.round(Math.max(0, Math.min(100, (localX / sliderWidth) * 100)));
      (this.settings as any)[key] = value;
      saveSettings(this.settings);
      updateVisual(value);
    });

    // Drag thumb
    this.input.setDraggable(thumb);
    thumb.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => {
      const clamped = Math.max(leftX, Math.min(leftX + sliderWidth, dragX));
      const value = Math.round(((clamped - leftX) / sliderWidth) * 100);
      (this.settings as any)[key] = value;
      saveSettings(this.settings);
      updateVisual(value);
    });
  }

  private createTextSpeedSelector(x: number, y: number): void {
    const labels = ['慢', '中', '快'];
    const values = [1, 2, 3];
    const btnWidth = 90;
    const gap = 16;
    const startX = x - (btnWidth * 3 + gap * 2) / 2 + btnWidth / 2;

    values.forEach((val, i) => {
      const bx = startX + i * (btnWidth + gap);
      const isActive = this.settings.textSpeed === val;

      const bg = this.add.rectangle(bx, y, btnWidth, 38, isActive ? 0x4338ca : 0x1e293b);
      bg.setStrokeStyle(2, isActive ? 0x818cf8 : 0x334155);
      bg.setInteractive({ useHandCursor: true });

      this.add.text(bx, y, labels[i], {
        fontSize: '16px',
        fontFamily: '"Noto Serif SC", serif',
        color: isActive ? '#ffffff' : '#94a3b8',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      bg.on('pointerdown', () => {
        this.settings.textSpeed = val;
        saveSettings(this.settings);
        this.scene.restart();
      });
    });
  }

  private createToggle(x: number, y: number, label: string, key: keyof GameSettings): void {
    const cam = this.cameras.main;
    const toggleWidth = 48;
    const toggleHeight = 26;
    const labelX = x - cam.width * 0.139;  // ~160px at 1152

    this.add.text(labelX, y, label, {
      fontSize: '15px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#e2e8f0',
    }).setOrigin(0, 0.5);

    const toggleX = x + cam.width * 0.113;  // ~130px at 1152
    const isActive = this.settings[key] as boolean;

    const bg = this.add.rectangle(toggleX, y, toggleWidth, toggleHeight, isActive ? 0x6366f1 : 0x334155, 0.9);
    bg.setStrokeStyle(2, isActive ? 0x818cf8 : 0x475569);
    bg.setInteractive({ useHandCursor: true });

    const knobX = isActive ? toggleX + 11 : toggleX - 11;
    const knob = this.add.circle(knobX, y, 10, 0xffffff);

    bg.on('pointerdown', () => {
      const newVal = !(this.settings[key] as boolean);
      (this.settings as any)[key] = newVal;
      saveSettings(this.settings);

      bg.setFillStyle(newVal ? 0x6366f1 : 0x334155, 0.9);
      bg.setStrokeStyle(2, newVal ? 0x818cf8 : 0x475569);
      knob.x = newVal ? toggleX + 11 : toggleX - 11;

      // Fullscreen toggle
      if (key === 'fullscreen') {
        if (newVal) {
          this.scale.startFullscreen();
        } else {
          this.scale.stopFullscreen();
        }
      }
    });
  }

  private createResolutionSelector(x: number, y: number): void {
    const options: { label: string; value: GameSettings['resolution'] }[] = [
      { label: '720p', value: '720p' },
      { label: '1080p', value: '1080p' },
      { label: '原始 (1152×768)', value: 'native' },
    ];
    const btnWidth = 100;
    const gap = 12;
    const startX = x - (options.length * (btnWidth + gap) - gap) / 2 + btnWidth / 2;

    options.forEach((opt, i) => {
      const bx = startX + i * (btnWidth + gap);
      const isActive = this.settings.resolution === opt.value;

      const bg = this.add.rectangle(bx, y, btnWidth, 36, isActive ? 0x4338ca : 0x1e293b);
      bg.setStrokeStyle(2, isActive ? 0x818cf8 : 0x334155);
      bg.setInteractive({ useHandCursor: true });

      this.add.text(bx, y, opt.label, {
        fontSize: '13px', fontFamily: '"Noto Serif SC", serif',
        color: isActive ? '#ffffff' : '#94a3b8', fontStyle: 'bold',
      }).setOrigin(0.5);

      bg.on('pointerdown', () => {
        this.settings.resolution = opt.value;
        saveSettings(this.settings);
        // Apply new resolution
        const { width, height } = getResolutionSize(opt.value);
        this.scale.setGameSize(width, height);
        this.scene.restart();
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
      fontSize: '16px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    bg.on('pointerover', () => bg.setFillStyle(0x6366f1));
    bg.on('pointerout', () => bg.setFillStyle(color));
    bg.on('pointerdown', action);
  }

  private goBack(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
  }
}
