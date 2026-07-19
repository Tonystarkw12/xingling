import Phaser from 'phaser';
import { Card } from '../ui/Card';
import { type BattleForm, type CardData, createDeckForForm } from '../data/CardDatabase';

/**
 * Battle Scene - Enhanced with visual effects and animations
 */
export class BattleScene extends Phaser.Scene {
  // Player state
  private playerMaxHP: number = 60;
  private playerHP: number = 60;
  private playerBlock: number = 0;
  private playerEnergy: number = 3;
  private playerMaxEnergy: number = 3;
  private playerForm: BattleForm = 'BSE';
  private starEnergy: number = 0;
  private readonly maxStarEnergy: number = 30;
  private starTurnsRemaining: number = 0;
  private readonly aleTurnDamage: number = 5;

  // Enemy state
  private enemyMaxHP: number = 40;
  private enemyHP: number = 40;
  private enemyBlock: number = 0;
  private enemyIntentText?: Phaser.GameObjects.Text;
  private enemyWillAttack: boolean = true;

  // Deck state
  private deck: CardData[] = [];
  private hand: CardData[] = [];
  private discardPile: CardData[] = [];
  private handCards: Card[] = [];

  // UI elements
  private hpBar!: Phaser.GameObjects.Graphics;
  private enemyHpBar!: Phaser.GameObjects.Graphics;
  private hpText!: Phaser.GameObjects.Text;
  private enemyHpText!: Phaser.GameObjects.Text;
  private blockText!: Phaser.GameObjects.Text;
  private enemyBlockText!: Phaser.GameObjects.Text;
  private energyText!: Phaser.GameObjects.Text;
  private starBar!: Phaser.GameObjects.Graphics;
  private starText!: Phaser.GameObjects.Text;
  private formText!: Phaser.GameObjects.Text;
  private formButton!: Phaser.GameObjects.Rectangle;
  private deckCountText!: Phaser.GameObjects.Text;
  private discardCountText!: Phaser.GameObjects.Text;

  // Character sprites
  private playerSprite?: Phaser.GameObjects.Image;
  private enemySprite?: Phaser.GameObjects.Rectangle;
  private formParticles?: Phaser.GameObjects.Particles.ParticleEmitter;

  // Turn state
  private isPlayerTurn: boolean = true;
  private turnNumber: number = 1;
  private isAnimating: boolean = false;
  private switchedFormThisTurn: boolean = false;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    this.sound.stopAll();
    this.sound.removeAll();

    // Reset state
    this.playerHP = this.playerMaxHP;
    this.playerBlock = 0;
    this.playerEnergy = this.playerMaxEnergy;
    this.playerForm = 'BSE';
    this.starEnergy = 0;
    this.starTurnsRemaining = 0;
    this.enemyHP = this.enemyMaxHP;
    this.enemyBlock = 0;
    this.hand = [];
    this.discardPile = [];
    this.handCards = [];
    this.isPlayerTurn = true;
    this.turnNumber = 1;
    this.isAnimating = false;
    this.switchedFormThisTurn = false;

    this.deck = this.shuffle(createDeckForForm(this.playerForm));

    this.createBackground(cam);
    this.createParticleTexture();
    this.createBattleArena(cam);
    this.createUI(cam);
    this.drawCards(5);
    this.setEnemyIntent();
    this.updateUI();

    // Turn start flash
    this.flashScreen(0xffffff, 0.3, 300);
  }

  private createBackground(cam: Phaser.Cameras.Scene2D.Camera): void {
    if (this.textures.exists('bg_nock_city')) {
      const bg = this.add.image(cam.width / 2, cam.height / 2, 'bg_nock_city');
      const tex = bg.texture.getSourceImage();
      if (tex) {
        const scale = Math.max(cam.width / tex.width, cam.height / tex.height);
        bg.setScale(scale);
      }
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.3);
    } else {
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x0f0f23);
      this.add.rectangle(cam.width / 2, cam.height * 0.7, cam.width, cam.height * 0.3, 0x1e1b4b, 0.5);
    }

    // Ambient particles
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * cam.width;
      const y = Math.random() * cam.height * 0.6;
      const particle = this.add.circle(x, y, 1, 0x6366f1, 0.3);
      this.tweens.add({
        targets: particle,
        alpha: 0.1,
        duration: 2000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
      });
    }

    // Battle BGM
    if (this.cache.audio.exists('bgm_acestep')) {
      this.sound.play('bgm_acestep', { loop: true, volume: 0.4 });
    }
  }

  private createParticleTexture(): void {
    if (this.textures.exists('form_particle')) return;

    const texture = this.make.graphics({ x: 0, y: 0 }, false);
    texture.fillStyle(0xffffff, 1);
    texture.fillCircle(4, 4, 4);
    texture.generateTexture('form_particle', 8, 8);
    texture.destroy();
  }

  private createBattleArena(cam: Phaser.Cameras.Scene2D.Camera): void {
    const playerX = cam.width * 0.25;
    const playerY = cam.height * 0.45;

    // Player character portrait
    if (this.textures.exists('char_ampere')) {
      this.playerSprite = this.add.image(playerX, playerY + 60, 'char_ampere');
      const tex = this.playerSprite.texture.getSourceImage();
      if (tex) {
        const maxH = cam.height * 0.4;
        const scale = Math.min(maxH / tex.height, 0.5);
        this.playerSprite.setScale(scale);
      }
      this.playerSprite.setOrigin(0.5, 1);
    } else {
      const playerBody = this.add.rectangle(playerX, playerY, 80, 120, 0xfbbf24, 0.3);
      playerBody.setStrokeStyle(2, 0xfbbf24);
    }

    this.add.text(playerX, playerY - 80, '安培尔', {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#fbbf24',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Enemy
    const enemyX = cam.width * 0.75;
    const enemyY = cam.height * 0.45;

    this.enemySprite = this.add.rectangle(enemyX, enemyY, 80, 120, 0xef4444, 0.3);
    this.enemySprite.setStrokeStyle(2, 0xef4444);

    this.add.text(enemyX, enemyY - 80, '暗影卫兵', {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#ef4444',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.enemyIntentText = this.add.text(enemyX, enemyY - 110, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // HP bars
    this.hpBar = this.add.graphics();
    this.hpText = this.add.text(playerX, playerY + 80, '', {
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.blockText = this.add.text(playerX + 50, playerY - 30, '', {
      fontSize: '16px',
      color: '#3b82f6',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.enemyHpBar = this.add.graphics();
    this.enemyHpText = this.add.text(enemyX, enemyY + 80, '', {
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.enemyBlockText = this.add.text(enemyX + 50, enemyY - 30, '', {
      fontSize: '16px',
      color: '#3b82f6',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private createUI(cam: Phaser.Cameras.Scene2D.Camera): void {
    const energyBg = this.add.circle(80, cam.height - 100, 30, 0x312e81);
    energyBg.setStrokeStyle(3, 0x6366f1);

    this.energyText = this.add.text(80, cam.height - 100, '', {
      fontSize: '24px',
      color: '#fbbf24',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.formButton = this.add.rectangle(80, cam.height - 45, 130, 34, 0x334155)
      .setStrokeStyle(2, 0x94a3b8)
      .setInteractive({ useHandCursor: true });
    this.formText = this.add.text(80, cam.height - 45, '', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.formButton.on('pointerdown', () => this.handleFormButton());

    this.starBar = this.add.graphics();
    this.starText = this.add.text(180, cam.height - 76, '', {
      fontSize: '13px',
      color: '#fde047',
    }).setOrigin(0.5);

    const endTurnBtn = this.add.rectangle(cam.width - 100, cam.height - 100, 120, 50, 0x4338ca);
    endTurnBtn.setStrokeStyle(2, 0x6366f1);
    endTurnBtn.setInteractive({ useHandCursor: true });

    this.add.text(cam.width - 100, cam.height - 100, '结束回合', {
      fontSize: '16px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    endTurnBtn.on('pointerover', () => endTurnBtn.setFillStyle(0x6366f1));
    endTurnBtn.on('pointerout', () => endTurnBtn.setFillStyle(0x4338ca));
    endTurnBtn.on('pointerdown', () => {
      if (this.isPlayerTurn && !this.isAnimating) {
        this.endPlayerTurn();
      }
    });

    this.deckCountText = this.add.text(cam.width / 2 - 60, cam.height - 40, '', {
      fontSize: '14px',
      color: '#c4b5fd',
    });

    this.discardCountText = this.add.text(cam.width / 2 + 60, cam.height - 40, '', {
      fontSize: '14px',
      color: '#c4b5fd',
    });

    this.add.text(cam.width / 2, 30, '第1回合', {
      fontSize: '18px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#a78bfa',
    }).setOrigin(0.5);
  }

  private updateUI(): void {
    const cam = this.cameras.main;

    this.hpBar.clear();
    const hpBarWidth = 120;
    const hpBarHeight = 12;
    const hpX = cam.width * 0.25 - hpBarWidth / 2;
    const hpY = cam.height * 0.45 + 65;

    this.hpBar.fillStyle(0x1e1b4b);
    this.hpBar.fillRect(hpX, hpY, hpBarWidth, hpBarHeight);
    this.hpBar.fillStyle(0x22c55e);
    this.hpBar.fillRect(hpX, hpY, (this.playerHP / this.playerMaxHP) * hpBarWidth, hpBarHeight);

    this.hpText.setText(`${this.playerHP}/${this.playerMaxHP}`);
    this.blockText.setText(this.playerBlock > 0 ? `🛡${this.playerBlock}` : '');

    this.enemyHpBar.clear();
    const enemyHpX = cam.width * 0.75 - hpBarWidth / 2;
    const enemyHpY = cam.height * 0.45 + 65;

    this.enemyHpBar.fillStyle(0x1e1b4b);
    this.enemyHpBar.fillRect(enemyHpX, enemyHpY, hpBarWidth, hpBarHeight);
    this.enemyHpBar.fillStyle(0xef4444);
    this.enemyHpBar.fillRect(enemyHpX, enemyHpY, (this.enemyHP / this.enemyMaxHP) * hpBarWidth, hpBarHeight);

    this.enemyHpText.setText(`${this.enemyHP}/${this.enemyMaxHP}`);
    this.enemyBlockText.setText(this.enemyBlock > 0 ? `🛡${this.enemyBlock}` : '');

    this.energyText.setText(`${this.playerEnergy}/${this.playerMaxEnergy}`);
    this.formText.setText(this.playerForm === 'STAR' ? `星化 ${this.starTurnsRemaining}回合` : `${this.playerForm} · 切换`);
    this.formButton.setFillStyle(this.playerForm === 'BSE' ? 0x334155 : this.playerForm === 'ALE' ? 0x9d174d : 0x854d0e);

    const starX = 125;
    const starY = cam.height - 102;
    const starWidth = 110;
    this.starBar.clear();
    this.starBar.fillStyle(0x1e293b);
    this.starBar.fillRect(starX, starY, starWidth, 12);
    this.starBar.fillStyle(0xfde047);
    this.starBar.fillRect(starX, starY, (this.starEnergy / this.maxStarEnergy) * starWidth, 12);
    this.starText.setText(`星化 ${this.starEnergy}/${this.maxStarEnergy}`);
    this.deckCountText.setText(`牌堆: ${this.deck.length}`);
    this.discardCountText.setText(`弃牌: ${this.discardPile.length}`);
  }

  private handleFormButton(): void {
    if (!this.isPlayerTurn || this.isAnimating || this.playerForm === 'STAR' || this.switchedFormThisTurn) return;

    if (this.starEnergy >= this.maxStarEnergy) {
      this.starTurnsRemaining = 3;
      this.starEnergy = 0;
      this.switchForm('STAR');
    } else {
      this.switchForm(this.playerForm === 'BSE' ? 'ALE' : 'BSE');
    }

    this.switchedFormThisTurn = true;
    this.updateUI();
  }

  private switchForm(form: BattleForm): void {
    this.playerForm = form;
    this.deck = this.shuffle(createDeckForForm(form));
    this.discardPile = [];
    this.hand = [];
    this.handCards.forEach((card) => card.destroy());
    this.handCards = [];
    this.drawCards(5);

    if (this.playerSprite) {
      this.playerSprite.clearTint();
      if (form === 'ALE') this.playerSprite.setTint(0xec4899);
      if (form === 'STAR') this.playerSprite.setTint(0xfde047);
    }

    this.updateFormEffects(form);
    this.flashScreen(form === 'BSE' ? 0x64748b : form === 'STAR' ? 0xfde047 : 0xec4899, 0.25, 300);
  }

  private updateFormEffects(form: BattleForm): void {
    this.formParticles?.destroy();
    this.formParticles = undefined;

    if (this.playerSprite?.postFX) {
      this.playerSprite.postFX.clear();
    }
    if (form === 'BSE' || !this.playerSprite) return;

    const color = form === 'ALE' ? 0xec4899 : 0xfde047;
    this.formParticles = this.add.particles(this.playerSprite.x, this.playerSprite.y - 30, 'form_particle', {
      speed: form === 'ALE' ? { min: 20, max: 55 } : { min: 35, max: 90 },
      angle: form === 'ALE' ? { min: 240, max: 300 } : { min: 0, max: 360 },
      lifespan: { min: 500, max: 1100 },
      quantity: form === 'ALE' ? 1 : 2,
      frequency: form === 'ALE' ? 90 : 55,
      scale: { start: form === 'ALE' ? 0.8 : 1.2, end: 0 },
      alpha: { start: 0.9, end: 0 },
      tint: color,
      blendMode: Phaser.BlendModes.ADD,
      emitting: true,
    }).setDepth(this.playerSprite.depth + 1);

    if (this.game.renderer.type === Phaser.WEBGL && this.playerSprite.postFX) {
      this.playerSprite.postFX.addBloom(color, form === 'ALE' ? 1 : 2, form === 'ALE' ? 1 : 2, form === 'ALE' ? 1.2 : 2, 1);
      const matrix = this.playerSprite.postFX.addColorMatrix();
      if (form === 'ALE') matrix.hue(25);
      else matrix.brightness(1.35);
      this.playerSprite.postFX.addVignette(0.5, 0.5, form === 'ALE' ? 0.7 : 0.9, form === 'ALE' ? 0.35 : 0.15);
    }

    const pulse = this.add.circle(this.playerSprite.x, this.playerSprite.y - 30, 45, color, 0)
      .setStrokeStyle(form === 'ALE' ? 2 : 4, color, 0.9)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: pulse,
      scale: form === 'ALE' ? 1.8 : 2.6,
      alpha: 0,
      duration: form === 'ALE' ? 700 : 1000,
      repeat: form === 'ALE' ? 1 : 2,
      onComplete: () => pulse.destroy(),
    });
  }

  private drawCards(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.deck.length === 0) {
        if (this.discardPile.length === 0) break;
        this.deck = this.shuffle([...this.discardPile]);
        this.discardPile = [];
      }

      const card = this.deck.pop();
      if (card) {
        this.hand.push(card);
      }
    }

    this.renderHand();
    this.updateUI();
  }

  private renderHand(): void {
    this.handCards.forEach((c) => c.destroy());
    this.handCards = [];

    const cam = this.cameras.main;
    const handWidth = Math.min(this.hand.length * 130, cam.width - 200);
    const startX = (cam.width - handWidth) / 2 + 65;
    const cardY = cam.height - 130;

    this.hand.forEach((cardData, index) => {
      const x = this.hand.length === 1
        ? cam.width / 2
        : startX + (handWidth - 130) * (index / (this.hand.length - 1));

      const card = new Card(this, x, cardY, cardData);
      const canPlay = this.playerEnergy >= cardData.cost;
      card.setPlayable(canPlay);

      card.on('cardPlayed', (data: CardData) => {
        this.playCard(data, card);
      });

      this.handCards.push(card);
    });
  }

  private playCard(cardData: CardData, card: Card): void {
    if (this.playerEnergy < cardData.cost || this.isAnimating) return;

    this.isAnimating = true;
    this.playerEnergy -= cardData.cost;

    const cam = this.cameras.main;
    const targetX = cardData.type === 'attack' ? cam.width * 0.75 : cam.width * 0.25;
    const targetY = cam.height * 0.45;

    // Card fly animation
    card.playCardAnimation(targetX, targetY, () => {
      this.applyCardEffects(cardData);

      const index = this.hand.indexOf(cardData);
      if (index !== -1) {
        this.hand.splice(index, 1);
      }
      this.discardPile.push(cardData);

      card.destroy();
      this.isAnimating = false;

      if (this.enemyHP <= 0) {
        this.victory();
        return;
      }

      this.renderHand();
      this.updateUI();
    });
  }

  private applyCardEffects(cardData: CardData): void {
    const cam = this.cameras.main;

    if (cardData.damage) {
      // Attack effect
      this.createAttackEffect(cam.width * 0.75, cam.height * 0.45, cardData.artColor);

      let damage = Math.round(cardData.damage * (this.playerForm === 'BSE' ? 1 : this.playerForm === 'ALE' ? 1.5 : 2));
      if (this.enemyBlock > 0) {
        const absorbed = Math.min(this.enemyBlock, damage);
        this.enemyBlock -= absorbed;
        damage -= absorbed;
        if (absorbed > 0) {
          this.showFloatingText(`格挡 -${absorbed}`, cam.width * 0.75, cam.height * 0.35, '#3b82f6');
        }
      }
      this.enemyHP = Math.max(0, this.enemyHP - damage);
      if (this.playerForm === 'ALE') {
        this.starEnergy = Math.min(this.maxStarEnergy, this.starEnergy + damage);
      }

      if (damage > 0) {
        this.showFloatingText(`-${damage}`, cam.width * 0.75, cam.height * 0.4, '#ef4444', 32);
        this.cameras.main.shake(150, 0.015);
        this.flashSprite(this.enemySprite, 0xff0000, 200);
      }
    }

    if (cardData.block) {
      this.createShieldEffect(cam.width * 0.25, cam.height * 0.45);
      this.playerBlock += cardData.block;
      this.showFloatingText(`+${cardData.block}🛡`, cam.width * 0.25, cam.height * 0.4, '#3b82f6', 28);
    }

    if (cardData.effects) {
      for (const effect of cardData.effects) {
        switch (effect.type) {
          case 'draw':
            this.drawCards(effect.value);
            break;
          case 'energy':
            this.playerEnergy += effect.value;
            this.showFloatingText(`+${effect.value}⚡`, cam.width * 0.25, cam.height * 0.5, '#fbbf24', 24);
            break;
          case 'heal':
            this.playerHP = Math.min(this.playerMaxHP, this.playerHP + effect.value);
            this.showFloatingText(`+${effect.value}❤`, cam.width * 0.25, cam.height * 0.4, '#22c55e', 28);
            break;
        }
      }
    }

    this.updateUI();
  }

  private createAttackEffect(x: number, y: number, color: number): void {
    // Explosion particles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const particle = this.add.circle(x, y, 4, color, 1);

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.2,
        duration: 400,
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy(),
      });
    }

    // Central flash
    const flash = this.add.circle(x, y, 30, color, 0.8);
    this.tweens.add({
      targets: flash,
      scale: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy(),
    });
  }

  private createShieldEffect(x: number, y: number): void {
    // Shield ring
    const shield = this.add.circle(x, y, 40, 0x3b82f6, 0);
    shield.setStrokeStyle(4, 0x60a5fa, 1);

    this.tweens.add({
      targets: shield,
      scale: 1.5,
      alpha: 0,
      duration: 500,
      ease: 'Cubic.easeOut',
      onComplete: () => shield.destroy(),
    });

    // Sparkles
    for (let i = 0; i < 6; i++) {
      const sparkle = this.add.circle(
        x + (Math.random() - 0.5) * 60,
        y + (Math.random() - 0.5) * 60,
        2, 0x93c5fd, 1
      );
      this.tweens.add({
        targets: sparkle,
        y: sparkle.y - 30,
        alpha: 0,
        duration: 600,
        onComplete: () => sparkle.destroy(),
      });
    }
  }

  private flashSprite(sprite: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle | undefined, color: number, duration: number): void {
    if (!sprite) return;

    if (sprite instanceof Phaser.GameObjects.Image) {
      sprite.setTint(color);
      this.time.delayedCall(duration, () => {
        sprite.clearTint();
        if (sprite === this.playerSprite && this.playerForm === 'ALE') sprite.setTint(0xec4899);
        if (sprite === this.playerSprite && this.playerForm === 'STAR') sprite.setTint(0xfde047);
      });
    } else {
      // Rectangle - flash fill color
      const originalFill = sprite.fillColor;
      sprite.setFillStyle(color, sprite.fillAlpha);
      this.time.delayedCall(duration, () => {
        sprite.setFillStyle(originalFill, sprite.fillAlpha);
      });
    }
  }

  private flashScreen(color: number, alpha: number, duration: number): void {
    const cam = this.cameras.main;
    const flash = this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, color, alpha);
    flash.setDepth(999);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: duration,
      onComplete: () => flash.destroy(),
    });
  }

  private endPlayerTurn(): void {
    this.isPlayerTurn = false;

    this.discardPile.push(...this.hand);
    this.hand = [];
    this.handCards.forEach((c) => c.destroy());
    this.handCards = [];
    this.renderHand();

    // Turn transition flash
    this.flashScreen(0x000000, 0.3, 300);

    this.time.delayedCall(500, () => {
      this.enemyTurn();
    });
  }

  private enemyTurn(): void {
    const cam = this.cameras.main;
    const action = this.enemyWillAttack ? 0 : 1;

    if (action < 0.7) {
      // Enemy attack
      const damage = 8 + Math.floor(Math.random() * 5);

      // Enemy attack animation
      if (this.enemySprite) {
        this.tweens.add({
          targets: this.enemySprite,
          x: this.enemySprite.x - 30,
          duration: 150,
          yoyo: true,
          ease: 'Cubic.easeInOut',
        });
      }

      this.showFloatingText(`攻击！`, cam.width * 0.75, cam.height * 0.35, '#ef4444', 28);

      this.time.delayedCall(400, () => {
        this.createAttackEffect(cam.width * 0.25, cam.height * 0.45, 0xef4444);

        let actualDamage = this.playerForm === 'STAR' ? 0 : damage;
        if (this.playerBlock > 0) {
          const absorbed = Math.min(this.playerBlock, actualDamage);
          this.playerBlock -= absorbed;
          actualDamage -= absorbed;
          if (absorbed > 0) {
            this.showFloatingText(`格挡 -${absorbed}`, cam.width * 0.25, cam.height * 0.35, '#3b82f6');
          }
        }
        this.playerHP = Math.max(0, this.playerHP - actualDamage);

        if (actualDamage > 0) {
          this.showFloatingText(`-${damage}`, cam.width * 0.25, cam.height * 0.4, '#ef4444', 32);
          this.cameras.main.shake(150, 0.015);
          this.flashSprite(this.playerSprite, 0xff0000, 200);
        }

        this.updateUI();

        if (this.playerHP <= 0) {
          this.time.delayedCall(800, () => this.defeat());
          return;
        }

        this.time.delayedCall(800, () => this.startNewTurn());
      });
    } else {
      // Enemy defend
      const block = 5 + Math.floor(Math.random() * 4);
      this.createShieldEffect(cam.width * 0.75, cam.height * 0.45);
      this.enemyBlock += block;
      this.showFloatingText(`+${block}🛡`, cam.width * 0.75, cam.height * 0.4, '#3b82f6', 28);
      this.updateUI();

      this.time.delayedCall(800, () => this.startNewTurn());
    }
  }

  private startNewTurn(): void {
    if (this.playerForm === 'ALE') {
      this.playerHP = Math.max(0, this.playerHP - this.aleTurnDamage);
      this.showFloatingText(`ALE -${this.aleTurnDamage}❤`, this.cameras.main.width * 0.25, this.cameras.main.height * 0.4, '#ec4899');
    } else if (this.playerForm === 'STAR') {
      this.starTurnsRemaining--;
      if (this.starTurnsRemaining <= 0) {
        this.playerHP = 0;
      }
    }

    if (this.playerHP <= 0) {
      this.updateUI();
      this.time.delayedCall(500, () => this.defeat());
      return;
    }

    this.turnNumber++;
    this.playerEnergy = this.playerMaxEnergy;
    this.playerBlock = 0;
    this.isPlayerTurn = true;
    this.switchedFormThisTurn = false;

    // Turn start flash
    this.flashScreen(0xffffff, 0.2, 300);

    this.drawCards(5);
    this.setEnemyIntent();
    this.updateUI();
  }

  private setEnemyIntent(): void {
    this.enemyWillAttack = Math.random() < 0.7;
    const action = this.enemyWillAttack ? '⚔攻击' : '🛡防御';
    if (this.enemyIntentText) {
      this.enemyIntentText.setText(action);
    }
  }

  private showFloatingText(text: string, x: number, y: number, color: string, fontSize: number = 24): void {
    const floatText = this.add.text(x, y, text, {
      fontSize: `${fontSize}px`,
      fontFamily: '"Noto Serif SC", serif',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    floatText.setDepth(999);
    this.tweens.add({
      targets: floatText,
      y: y - 60,
      alpha: 0,
      scale: 1.2,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => floatText.destroy(),
    });
  }

  private victory(): void {
    const cam = this.cameras.main;

    // Victory particles
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * cam.width;
      const y = cam.height + 20;
      const particle = this.add.circle(x, y, 3, Phaser.Math.Between(0xfbbf24, 0xa78bfa), 1);

      this.tweens.add({
        targets: particle,
        y: -20,
        x: x + (Math.random() - 0.5) * 100,
        alpha: 0,
        duration: 2000 + Math.random() * 1000,
        onComplete: () => particle.destroy(),
      });
    }

    const overlay = this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0);
    overlay.setDepth(999);

    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 1000,
      onComplete: () => {
        const victoryText = this.add.text(cam.width / 2, cam.height / 2 - 30, '战斗胜利！', {
          fontSize: '48px',
          fontFamily: '"Noto Serif SC", serif',
          color: '#fbbf24',
          fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(1000);

        victoryText.setScale(0);
        this.tweens.add({
          targets: victoryText,
          scale: 1,
          duration: 500,
          ease: 'Back.easeOut',
        });

        const continueText = this.add.text(cam.width / 2, cam.height / 2 + 40, '点击继续', {
          fontSize: '20px',
          color: '#c4b5fd',
        }).setOrigin(0.5).setDepth(1000);

        this.input.once('pointerdown', () => {
          this.scene.start('ChapterCompleteScene');
        });
      },
    });
  }

  private defeat(): void {
    const cam = this.cameras.main;

    // Red vignette effect
    const vignette = this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0);
    vignette.setDepth(999);

    this.tweens.add({
      targets: vignette,
      alpha: 0.8,
      duration: 1000,
      onComplete: () => {
        const defeatText = this.add.text(cam.width / 2, cam.height / 2 - 30, '战斗失败...', {
          fontSize: '48px',
          fontFamily: '"Noto Serif SC", serif',
          color: '#ef4444',
          fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(1000);

        defeatText.setAlpha(0);
        this.tweens.add({
          targets: defeatText,
          alpha: 1,
          duration: 1000,
        });

        const retryText = this.add.text(cam.width / 2, cam.height / 2 + 40, '点击重试', {
          fontSize: '20px',
          color: '#c4b5fd',
        }).setOrigin(0.5).setDepth(1000);

        this.input.once('pointerdown', () => {
          this.scene.restart();
        });
      },
    });
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
