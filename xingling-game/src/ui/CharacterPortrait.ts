import Phaser from 'phaser';

export interface PortraitConfig {
  id: string;
  textureKey: string;
  displayName: string;
  position: 'left' | 'center' | 'right';
  color?: number; // fallback color if no texture
}

export class CharacterPortrait extends Phaser.GameObjects.Container {
  private portraitConfig: PortraitConfig;
  private namePlate!: Phaser.GameObjects.Text;
  private isOnScreen: boolean = false;
  private screenWidth: number;
  private screenHeight: number;

  constructor(scene: Phaser.Scene, config: PortraitConfig) {
    super(scene, 0, 0);
    this.portraitConfig = config;
    this.screenWidth = scene.cameras.main.width;
    this.screenHeight = scene.cameras.main.height;
    scene.add.existing(this);
    this.setDepth(50);
    this.createPortrait();
    this.setVisible(false);
  }

  enter(onComplete?: () => void): void {
    if (this.isOnScreen) return;
    this.isOnScreen = true;
    this.setVisible(true);

    const targetX = this.getXForPosition(this.portraitConfig.position);
    const startX = this.portraitConfig.position === 'left' ? -200
      : this.portraitConfig.position === 'right' ? this.screenWidth + 200
      : targetX;

    this.setPosition(startX, 0);
    this.setAlpha(0);

    this.scene.tweens.add({
      targets: this,
      x: targetX,
      alpha: 1,
      duration: 400,
      ease: 'Cubic.easeOut',
      onComplete: () => onComplete?.(),
    });
  }

  exit(onComplete?: () => void): void {
    if (!this.isOnScreen) return;
    const exitX = this.portraitConfig.position === 'left' ? -200
      : this.portraitConfig.position === 'right' ? this.screenWidth + 200
      : this.x;

    this.scene.tweens.add({
      targets: this,
      x: exitX,
      alpha: 0,
      duration: 300,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        this.isOnScreen = false;
        this.setVisible(false);
        onComplete?.();
      },
    });
  }

  setSpeakerActive(active: boolean): void {
    this.scene.tweens.add({
      targets: this,
      alpha: active ? 1 : 0.6,
      duration: 200,
    });
  }

  private createPortrait(): void {
    const targetX = this.getXForPosition(this.portraitConfig.position);

    // Use real texture if available, otherwise colored rectangle
    if (this.scene.textures.exists(this.portraitConfig.textureKey)) {
      const texture = this.scene.textures.get(this.portraitConfig.textureKey);
      const img = this.scene.add.image(0, 0, this.portraitConfig.textureKey);

      // Scale to fit: max height ~55% of screen
      const maxH = this.screenHeight * 0.55;
      const scale = Math.min(maxH / img.height, 0.8);
      img.setScale(scale);

      // Bottom-aligned
      img.setOrigin(0.5, 1);
      img.setY(this.screenHeight - 185);
      this.add(img);
    } else {
      // Fallback: colored rectangle placeholder
      const bodyHeight = this.screenHeight * 0.45;
      const bodyWidth = bodyHeight * 0.35;
      const color = this.portraitConfig.color ?? 0x555555;

      const body = this.scene.add.rectangle(0, 0, bodyWidth, bodyHeight, color, 0.3);
      body.setOrigin(0.5, 1);
      body.setY(this.screenHeight - 190);
      body.setStrokeStyle(2, color, 0.6);
      this.add(body);

      const initial = this.portraitConfig.displayName.charAt(0);
      const initialText = this.scene.add.text(0, body.y - bodyHeight * 0.5, initial, {
        fontSize: '48px',
        fontFamily: '"Noto Serif SC", serif',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.add(initialText);
    }

    // Name plate
    this.namePlate = this.scene.add.text(0, this.screenHeight - 175, this.portraitConfig.displayName, {
      fontSize: '16px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#e0e7ff',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add(this.namePlate);

    this.setPosition(targetX, 0);
  }

  private getXForPosition(position: string): number {
    switch (position) {
      case 'left': return this.screenWidth * 0.22;
      case 'center': return this.screenWidth * 0.5;
      case 'right': return this.screenWidth * 0.78;
      default: return this.screenWidth * 0.5;
    }
  }
}
