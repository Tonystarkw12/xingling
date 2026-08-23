/**
 * Battle VFX engine — flashy, layered visual effects for card battles.
 * Each method creates a complete effect sequence with multiple layers.
 */
import Phaser from 'phaser';

export class BattleVFX {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // ═══════════════════════════════════════════════════════════════
  // ATTACK EFFECTS
  // ═══════════════════════════════════════════════════════════════

  /** Full attack sequence: flash + shake + particles + ring + slow-mo hitstop */
  playAttack(x: number, y: number, color: number, damage: number): void {
    // 1. Central flash burst
    const flash = this.scene.add.circle(x, y, 8, 0xffffff, 1)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(900);
    this.scene.tweens.add({
      targets: flash, scaleX: 12, scaleY: 8, alpha: 0, duration: 250,
      ease: 'Cubic.easeOut', onComplete: () => flash.destroy(),
    });

    // 2. Color ring expansion
    const ring = this.scene.add.circle(x, y, 10, color, 0)
      .setStrokeStyle(5, color, 1).setBlendMode(Phaser.BlendModes.ADD).setDepth(899);
    this.scene.tweens.add({
      targets: ring, scale: 4, alpha: 0, duration: 400,
      ease: 'Cubic.easeOut', onComplete: () => ring.destroy(),
    });

    // 3. Explosion particles (radial burst)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 60 + Math.random() * 50;
      const size = Math.random() * 5 + 2;
      const p = this.scene.add.circle(x, y, size, color, 1)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0, scale: 0.1,
        duration: 350 + Math.random() * 200,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
    }

    // 4. Spark lines (directional streaks)
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const len = 30 + Math.random() * 40;
      const spark = this.scene.add.rectangle(
        x + Math.cos(angle) * len * 0.6,
        y + Math.sin(angle) * len * 0.6,
        len, 3, color, 0.9,
      ).setRotation(angle).setBlendMode(Phaser.BlendModes.ADD).setDepth(897);
      this.scene.tweens.add({
        targets: spark, alpha: 0, scaleX: 0.05, x: x + Math.cos(angle) * len,
        duration: 250, ease: 'Cubic.easeOut', onComplete: () => spark.destroy(),
      });
    }

    // 5. Screen shake (proportional to damage)
    this.scene.cameras.main.shake(120 + damage * 8, 0.008 + damage * 0.002);

    // 6. Hit-stop (brief pause for impact feel)
    // Only for significant damage
    if (damage >= 8) {
      this.scene.time.delayedCall(50, () => {
        // Brief flash overlay
        const cam = this.scene.cameras.main;
        const flashOverlay = this.scene.add.rectangle(
          cam.width / 2, cam.height / 2, cam.width, cam.height, 0xffffff, 0.15,
        ).setDepth(999);
        this.scene.tweens.add({
          targets: flashOverlay, alpha: 0, duration: 100,
          onComplete: () => flashOverlay.destroy(),
        });
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CARD-SPECIFIC EFFECTS
  // ═══════════════════════════════════════════════════════════════

  /** Ice crystal effect (Iris's attacks) */
  playIceEffect(x: number, y: number): void {
    // Shatter pattern — ice crystals flying outward
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 40 + Math.random() * 40;
      const crystal = this.scene.add.rectangle(
        x, y, 4 + Math.random() * 6, 12 + Math.random() * 8, 0x67e8f9, 0.9,
      ).setRotation(angle + Math.random() * 0.5)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.scene.tweens.add({
        targets: crystal,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0, scaleY: 0.2,
        duration: 400 + Math.random() * 200,
        ease: 'Cubic.easeOut',
        onComplete: () => crystal.destroy(),
      });
    }
    // Frost ring
    const ring = this.scene.add.circle(x, y, 15, 0x67e8f9, 0)
      .setStrokeStyle(4, 0x67e8f9, 1).setBlendMode(Phaser.BlendModes.ADD).setDepth(899);
    this.scene.tweens.add({
      targets: ring, scale: 3.5, alpha: 0, duration: 500,
      ease: 'Cubic.easeOut', onComplete: () => ring.destroy(),
    });
    // Central glow
    const glow = this.scene.add.circle(x, y, 20, 0x67e8f9, 0.4)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(897);
    this.scene.tweens.add({
      targets: glow, scale: 2, alpha: 0, duration: 300,
      onComplete: () => glow.destroy(),
    });
  }

  /** Fire/burn effect */
  playFireEffect(x: number, y: number): void {
    // Rising fire particles
    for (let i = 0; i < 20; i++) {
      const px = x + (Math.random() - 0.5) * 50;
      const py = y + Math.random() * 20;
      const size = 3 + Math.random() * 5;
      const fireColor = Math.random() > 0.5 ? 0xf97316 : 0xef4444;
      const p = this.scene.add.circle(px, py, size, fireColor, 0.9)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.scene.tweens.add({
        targets: p,
        y: py - 60 - Math.random() * 40,
        x: px + (Math.random() - 0.5) * 30,
        alpha: 0, scale: 0.2,
        duration: 400 + Math.random() * 300,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
    }
    // Flash
    const flash = this.scene.add.circle(x, y, 30, 0xf97316, 0.5)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(899);
    this.scene.tweens.add({
      targets: flash, scale: 2, alpha: 0, duration: 300,
      onComplete: () => flash.destroy(),
    });
  }

  /** Poison effect */
  playPoisonEffect(x: number, y: number): void {
    // Bubbling poison
    for (let i = 0; i < 8; i++) {
      const delay = i * 60;
      this.scene.time.delayedCall(delay, () => {
        const px = x + (Math.random() - 0.5) * 40;
        const py = y + 20;
        const bubble = this.scene.add.circle(px, py, 4 + Math.random() * 4, 0x22c55e, 0.7)
          .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
        this.scene.tweens.add({
          targets: bubble,
          y: py - 40 - Math.random() * 30,
          alpha: 0, scale: 1.5,
          duration: 500 + Math.random() * 200,
          ease: 'Sine.easeOut',
          onComplete: () => bubble.destroy(),
        });
      });
    }
    // Toxic cloud
    const cloud = this.scene.add.circle(x, y, 25, 0x22c55e, 0.2)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(897);
    this.scene.tweens.add({
      targets: cloud, scale: 2, alpha: 0, duration: 600,
      onComplete: () => cloud.destroy(),
    });
  }

  /** Heal effect */
  playHealEffect(x: number, y: number): void {
    // Rising green/gold sparkles
    for (let i = 0; i < 15; i++) {
      const px = x + (Math.random() - 0.5) * 50;
      const py = y + 30;
      const color = Math.random() > 0.5 ? 0x4ade80 : 0xfde047;
      const sparkle = this.scene.add.text(px, py, '✦', {
        fontSize: `${10 + Math.random() * 8}px`, color: '#ffffff',
      }).setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.scene.tweens.add({
        targets: sparkle,
        y: py - 80 - Math.random() * 40,
        x: px + (Math.random() - 0.5) * 20,
        alpha: 0, scale: 0.5,
        duration: 600 + Math.random() * 400,
        ease: 'Cubic.easeOut',
        onComplete: () => sparkle.destroy(),
      });
    }
    // Golden ring
    const ring = this.scene.add.circle(x, y, 20, 0x4ade80, 0)
      .setStrokeStyle(3, 0x4ade80, 0.8).setBlendMode(Phaser.BlendModes.ADD).setDepth(899);
    this.scene.tweens.add({
      targets: ring, scale: 3, alpha: 0, duration: 500,
      ease: 'Cubic.easeOut', onComplete: () => ring.destroy(),
    });
  }

  /** Energy gain effect */
  playEnergyEffect(x: number, y: number): void {
    // Spiraling energy particles
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 50;
      const startX = x + Math.cos(angle) * radius;
      const startY = y + Math.sin(angle) * radius;
      const p = this.scene.add.circle(startX, startY, 3, 0xa78bfa, 0.9)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.scene.tweens.add({
        targets: p, x, y, alpha: 0, scale: 0.3,
        duration: 300 + i * 30, ease: 'Cubic.easeIn',
        onComplete: () => p.destroy(),
      });
    }
    // Central pulse
    const pulse = this.scene.add.circle(x, y, 15, 0xa78bfa, 0.4)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(899);
    this.scene.tweens.add({
      targets: pulse, scale: 2.5, alpha: 0, duration: 400,
      onComplete: () => pulse.destroy(),
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SHIELD / BLOCK EFFECTS
  // ═══════════════════════════════════════════════════════════════

  playShieldEffect(x: number, y: number): void {
    // Multi-layer shield
    for (let i = 0; i < 3; i++) {
      const ring = this.scene.add.circle(x, y, 30 + i * 10, 0x60a5fa, 0)
        .setStrokeStyle(3 - i, 0x60a5fa, 0.8 - i * 0.2)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.scene.tweens.add({
        targets: ring, scale: 1.5 + i * 0.3, alpha: 0,
        duration: 400 + i * 100, ease: 'Cubic.easeOut',
        onComplete: () => ring.destroy(),
      });
    }
    // Hexagonal pattern
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const hx = x + Math.cos(angle) * 40;
      const hy = y + Math.sin(angle) * 40;
      const hex = this.scene.add.rectangle(hx, hy, 8, 8, 0x93c5fd, 0.6)
        .setRotation(Math.PI / 4).setBlendMode(Phaser.BlendModes.ADD).setDepth(897);
      this.scene.tweens.add({
        targets: hex,
        x: x + Math.cos(angle) * 60,
        y: y + Math.sin(angle) * 60,
        alpha: 0, scale: 0.3, duration: 350,
        onComplete: () => hex.destroy(),
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // FORM SWITCH / TRANSFORMATION
  // ═══════════════════════════════════════════════════════════════

  playTransformEffect(x: number, y: number, color: number): void {
    // Swirling energy vortex
    for (let ring = 0; ring < 3; ring++) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + ring * 0.3;
        const radius = 30 + ring * 20;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        const p = this.scene.add.circle(px, py, 3, color, 0.8)
          .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
        this.scene.tweens.add({
          targets: p, x, y, alpha: 0, scale: 0.2,
          duration: 500 + ring * 100, ease: 'Cubic.easeIn',
          delay: ring * 50,
          onComplete: () => p.destroy(),
        });
      }
    }

    // Expanding shockwave
    const wave = this.scene.add.circle(x, y, 20, color, 0)
      .setStrokeStyle(6, color, 1).setBlendMode(Phaser.BlendModes.ADD).setDepth(900);
    this.scene.tweens.add({
      targets: wave, scale: 5, alpha: 0, duration: 600,
      ease: 'Cubic.easeOut', onComplete: () => wave.destroy(),
    });

    // Screen flash
    const cam = this.scene.cameras.main;
    const screenFlash = this.scene.add.rectangle(
      cam.width / 2, cam.height / 2, cam.width, cam.height, color, 0.3,
    ).setDepth(999);
    this.scene.tweens.add({
      targets: screenFlash, alpha: 0, duration: 400,
      onComplete: () => screenFlash.destroy(),
    });

    // Rising light pillars
    for (let i = 0; i < 4; i++) {
      const px = x + (Math.random() - 0.5) * 60;
      const pillar = this.scene.add.rectangle(px, y + 40, 4, 0, color, 0.5)
        .setOrigin(0.5, 1).setBlendMode(Phaser.BlendModes.ADD).setDepth(896);
      this.scene.tweens.add({
        targets: pillar, scaleY: 80, alpha: 0, duration: 600,
        ease: 'Cubic.easeOut', delay: i * 80,
        onComplete: () => pillar.destroy(),
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // STATUS EFFECT INDICATORS
  // ═══════════════════════════════════════════════════════════════

  /** Persistent status visual — returns a container to be positioned on the unit */
  createStatusIndicator(x: number, y: number, statusType: string): Phaser.GameObjects.Container {
    // Ensure particle texture exists
    if (!this.scene.textures.exists('form_particle')) {
      const gfx = this.scene.make.graphics({ x: 0, y: 0 }, false);
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(4, 4, 4);
      gfx.generateTexture('form_particle', 8, 8);
      gfx.destroy();
    }

    const container = this.scene.add.container(x, y).setDepth(895);

    switch (statusType) {
      case 'poison': {
        const emitter = this.scene.add.particles(0, 20, 'form_particle', {
          speed: { min: 10, max: 30 },
          angle: { min: 250, max: 290 },
          lifespan: 800,
          quantity: 1,
          frequency: 200,
          scale: { start: 0.5, end: 0 },
          alpha: { start: 0.6, end: 0 },
          tint: 0x22c55e,
          blendMode: Phaser.BlendModes.ADD,
        });
        container.add(emitter);
        break;
      }
      case 'burn': {
        const emitter = this.scene.add.particles(0, 10, 'form_particle', {
          speed: { min: 20, max: 50 },
          angle: { min: 250, max: 290 },
          lifespan: 600,
          quantity: 2,
          frequency: 150,
          scale: { start: 0.6, end: 0 },
          alpha: { start: 0.7, end: 0 },
          tint: [0xf97316, 0xef4444],
          blendMode: Phaser.BlendModes.ADD,
        });
        container.add(emitter);
        break;
      }
      case 'weakness': {
        // Drooping blue particles
        const emitter = this.scene.add.particles(0, 0, 'form_particle', {
          speed: { min: 5, max: 15 },
          angle: { min: 260, max: 280 },
          lifespan: 1000,
          quantity: 1,
          frequency: 300,
          scale: { start: 0.4, end: 0 },
          alpha: { start: 0.4, end: 0 },
          tint: 0x60a5fa,
          blendMode: Phaser.BlendModes.ADD,
        });
        container.add(emitter);
        break;
      }
    }

    return container;
  }

  // ═══════════════════════════════════════════════════════════════
  // DEATH / KILL EFFECT
  // ═══════════════════════════════════════════════════════════════

  playDeathEffect(x: number, y: number, color: number): void {
    // Shatter outward
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const dist = 60 + Math.random() * 40;
      const shard = this.scene.add.rectangle(
        x, y, 3 + Math.random() * 5, 15 + Math.random() * 10, color, 0.7,
      ).setRotation(angle).setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.scene.tweens.add({
        targets: shard,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0, scaleY: 0.1, rotation: angle + Math.random(),
        duration: 500 + Math.random() * 200,
        ease: 'Cubic.easeOut',
        onComplete: () => shard.destroy(),
      });
    }

    // Dark vortex
    const vortex = this.scene.add.circle(x, y, 30, 0x000000, 0.5)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(897);
    this.scene.tweens.add({
      targets: vortex, scale: 0, alpha: 0, duration: 500,
      ease: 'Cubic.easeIn', onComplete: () => vortex.destroy(),
    });

    // Fade flash
    const flash = this.scene.add.circle(x, y, 40, color, 0.4)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(899);
    this.scene.tweens.add({
      targets: flash, scale: 2, alpha: 0, duration: 300,
      onComplete: () => flash.destroy(),
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CARD PLAY TRAIL
  // ═══════════════════════════════════════════════════════════════

  /** Trail effect when a card flies to target */
  playCardTrail(fromX: number, fromY: number, toX: number, toY: number, color: number): void {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const delay = t * 200;
      this.scene.time.delayedCall(delay, () => {
        const px = fromX + (toX - fromX) * t;
        const py = fromY + (toY - fromY) * t;
        const trail = this.scene.add.circle(px, py, 4 + (1 - t) * 3, color, 0.6)
          .setBlendMode(Phaser.BlendModes.ADD).setDepth(896);
        this.scene.tweens.add({
          targets: trail, alpha: 0, scale: 0.2, duration: 300,
          onComplete: () => trail.destroy(),
        });
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // TURN TRANSITION
  // ═══════════════════════════════════════════════════════════════

  playTurnTransition(isPlayer: boolean): void {
    const cam = this.scene.cameras.main;
    const color = isPlayer ? 0x6366f1 : 0xef4444;
    const label = isPlayer ? '你的回合' : '敌方回合';

    // Horizontal sweep line
    const line = this.scene.add.rectangle(0, cam.height / 2, cam.width, 3, color, 0.8)
      .setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD).setDepth(998);
    this.scene.tweens.add({
      targets: line, x: cam.width, alpha: 0, duration: 400,
      ease: 'Cubic.easeOut', onComplete: () => line.destroy(),
    });

    // Text
    const text = this.scene.add.text(cam.width / 2, cam.height / 2, label, {
      fontSize: '32px', fontFamily: '"Noto Serif SC", serif',
      color: isPlayer ? '#818cf8' : '#f87171', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(999).setAlpha(0);
    this.scene.tweens.add({
      targets: text, alpha: 1, scaleX: 1.2, scaleY: 1.2, duration: 200,
      yoyo: true, hold: 300, onComplete: () => text.destroy(),
    });
  }
}
