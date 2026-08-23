import Phaser from 'phaser';
import { Card } from '../ui/Card';
import { BattleTutorial } from '../ui/BattleTutorial';
import {
  type BattleForm,
  type CardData,
  type CharacterId,
  createCharacterDeck,
} from '../data/CardDatabase';
import { loadSave, markBattleTutorialSeen, saveCheckpoint, loadEquipment, loadGold, saveGold, addEquipment } from '../data/SaveSystem';
import { calculateTotalStats, rollDrop, EQUIPMENT_DB } from '../data/EquipmentDatabase';
import { ENEMY_DB, pickEnemySkill, getEncounter, type EnemyDef, type EnemySkill, type StatusEffect, type StatusType, STATUS_INFO } from '../data/EnemyDatabase';
import { PauseMenu } from '../ui/PauseMenu';
import { sfx } from '../ui/SFXManager';
import { BattleVFX } from '../ui/BattleVFX';
import { loadSettings, toVolume } from '../data/SettingsSystem';
import { loadCardUpgrades } from '../data/SaveSystem';
import { applyCardUpgrade } from '../data/CardUpgradeSystem';

type Side = 'player' | 'enemy';

interface Unit {
  id: string;
  owner?: CharacterId;
  name: string;
  side: Side;
  hp: number;
  maxHP: number;
  block: number;
  energy: number;
  maxEnergy: number;
  alive: boolean;
  acted: boolean;
  form: BattleForm;
  starEnergy: number;
  starTurns: number;
  cooldowns: Record<string, number>;
  formSwitched: boolean;
  plannedDefend: boolean;
  plannedSkill?: EnemySkill;
  statuses: StatusEffect[];
  enemyDef?: EnemyDef;
  deck: CardData[];
  hand: CardData[];
  discard: CardData[];
  sprite?: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
  hpBar?: Phaser.GameObjects.Graphics;
  hpText?: Phaser.GameObjects.Text;
  statusText?: Phaser.GameObjects.Text;
  intentText?: Phaser.GameObjects.Text;
  selector?: Phaser.GameObjects.Arc;
  x: number;
  y: number;
}

// UI bar references for active player
interface BarUI {
  energyBar: Phaser.GameObjects.Graphics;
  energyText: Phaser.GameObjects.Text;
  starBar: Phaser.GameObjects.Graphics;
  starText: Phaser.GameObjects.Text;
}

export class SquadBattleScene extends Phaser.Scene {
  private players: Unit[] = [];
  private enemies: Unit[] = [];
  private activePlayerId = 'ampere';
  private selectedCard?: CardData;
  private handCards: Card[] = [];
  private isPlayerPhase = true;
  private isAnimating = false;
  private turn = 1;
  private turnText!: Phaser.GameObjects.Text;
  private phaseText!: Phaser.GameObjects.Text;
  private formButton!: Phaser.GameObjects.Text;
  private endActionButton!: Phaser.GameObjects.Text;
  private pauseMenu!: PauseMenu;
  private barUI!: BarUI;
  private vfx!: BattleVFX;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    saveCheckpoint('battle');
    this.sound.stopAll();
    this.sound.removeAll();

    // Set SFX volume from settings
    const settings = loadSettings();
    sfx.setVolume(toVolume(settings.sfxVolume));
    this.vfx = new BattleVFX(this);

    this.createBackground();
    this.createUnits();
    this.createUI();
    this.players.forEach((unit) => this.drawCards(unit, 5));
    this.selectPlayer('ampere');
    this.rollEnemyIntents();
    this.updateUI();

    // Battle BGM — try file first, fall back to procedural
    if (this.cache.audio.exists('bgm_acestep')) {
      this.sound.play('bgm_acestep', { loop: true, volume: toVolume(settings.bgmVolume) });
    } else {
      sfx.startBattleBGM();
    }
    if (!loadSave().battleTutorialSeen) {
      this.isAnimating = true;
      new BattleTutorial(this, () => {
        markBattleTutorialSeen();
        this.isAnimating = false;
        this.renderHand();
      });
    }

    // Pause menu
    this.pauseMenu = new PauseMenu(this, {
      onResume: () => { this.isAnimating = false; },
      onSettings: () => this.scene.start('SettingsScene'),
      onCharacters: () => this.scene.start('CharacterPanelScene'),
      onTitleScreen: () => this.scene.start('TitleScreen'),
    });
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.on('down', () => {
      if (!this.pauseMenu.getIsOpen() && !this.isAnimating) {
        this.isAnimating = true;
        this.pauseMenu.open();
      }
    });
  }

  private createBackground(): void {
    const cam = this.cameras.main;
    const bgKey = this.textures.exists('bg_battle_arena') ? 'bg_battle_arena'
      : this.textures.exists('bg_nock_city') ? 'bg_nock_city' : null;
    if (bgKey) {
      const bg = this.add.image(cam.width / 2, cam.height / 2, bgKey);
      const source = bg.texture.getSourceImage();
      if (source) bg.setScale(Math.max(cam.width / source.width, cam.height / source.height));
    } else {
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x0f172a);
    }
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x020617, 0.42);
  }

  private createUnits(): void {
    const cam = this.cameras.main;
    const { inventory, equipped } = loadEquipment();
    const stats = calculateTotalStats(equipped, inventory);

    this.players = [
      this.makeUnit('ampere', '安培尔', 'player', 60 + stats.hp, cam.width * 0.17, cam.height * 0.43, 'char_ampere'),
      this.makeUnit('iris', '艾莉丝', 'player', 52 + stats.hp, cam.width * 0.35, cam.height * 0.43, 'char_iris'),
    ];
    // Apply equipment bonuses to player units
    this.players.forEach((unit) => {
      unit.maxEnergy += stats.energy;
      unit.energy = unit.maxEnergy;
    });
    // Use encounter system for enemies
    const encounter = getEncounter('chapter1');
    const camW = cam.width;
    const enemyCount = encounter.enemies.length;
    const enemySpacing = camW * 0.2;
    const enemyStartX = camW * 0.68;

    this.enemies = encounter.enemies.map((enemyId, i) => {
      const def = ENEMY_DB[enemyId];
      if (!def) return this.makeUnit(enemyId, enemyId, 'enemy', 40, enemyStartX + i * enemySpacing, cam.height * 0.4);
      const unit = this.makeUnit(def.id, def.name, 'enemy', def.maxHP,
        enemyStartX + i * enemySpacing, cam.height * 0.4, def.textureKey);
      unit.enemyDef = def;
      // Apply passive status effects
      if (def.passive) unit.statuses.push(...def.passive);
      return unit;
    });
  }

  private makeUnit(
    id: string,
    name: string,
    side: Side,
    maxHP: number,
    x: number,
    y: number,
    texture?: string,
  ): Unit {
    const owner = side === 'player' ? id as CharacterId : undefined;
    const unit: Unit = {
      id, owner, name, side, hp: maxHP, maxHP, block: 0,
      energy: side === 'player' ? 3 : 0, maxEnergy: side === 'player' ? 3 : 0,
      alive: true, acted: false, form: 'BSE', starEnergy: 0, starTurns: 0,
      cooldowns: {}, formSwitched: false, plannedDefend: false, statuses: [],
      deck: owner ? this.shuffle(this.applyUpgrades(createCharacterDeck(owner))) : [], hand: [], discard: [], x, y,
    };

    if (texture && this.textures.exists(texture)) {
      const image = this.add.image(x, y + 70, texture).setOrigin(0.5, 1);
      const source = image.texture.getSourceImage();
      if (source) image.setScale(Math.min((this.cameras.main.height * 0.3) / source.height, 0.38));
      unit.sprite = image;
    } else {
      const def = ENEMY_DB[id];
      const color = def?.color ?? (id === 'guard' ? 0xef4444 : id === 'hunter' ? 0xa855f7 : 0x06b6d4);
      unit.sprite = this.add.rectangle(x, y, 72, 112, color, 0.45).setStrokeStyle(3, color);
    }

    this.add.text(x, y - 88, name, {
      fontSize: '16px', color: side === 'player' ? '#fde68a' : '#fca5a5', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);
    unit.hpText = this.add.text(x, y + 78, '', { fontSize: '13px', color: '#ffffff' }).setOrigin(0.5);

    // HP bar
    const barWidth = 64;
    const barHeight = 6;
    const barY = y + 92;
    unit.hpBar = this.add.graphics();
    this.drawHpBar(unit, x, barY, barWidth, barHeight);

    unit.statusText = this.add.text(x, barY + 12, '', { fontSize: '11px', color: '#93c5fd' }).setOrigin(0.5);
    unit.intentText = side === 'enemy'
      ? this.add.text(x, y - 116, '', { fontSize: '13px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5)
      : undefined;
    unit.selector = this.add.circle(x, y, 58, 0xfde047, 0).setStrokeStyle(3, 0xfde047, 0).setDepth(20);

    unit.sprite.setInteractive({ useHandCursor: true });
    unit.sprite.on('pointerdown', () => this.handleUnitClick(unit));
    return unit;
  }

  private drawHpBar(unit: Unit, x: number, y: number, w: number, h: number): void {
    if (!unit.hpBar) return;
    unit.hpBar.clear();
    // Background
    unit.hpBar.fillStyle(0x1e1b4b, 0.9);
    unit.hpBar.fillRect(x - w / 2, y, w, h);
    // Fill
    const pct = Math.max(0, unit.hp / unit.maxHP);
    const color = pct > 0.5 ? 0x22c55e : pct > 0.25 ? 0xfbbf24 : 0xef4444;
    unit.hpBar.fillStyle(color, 1);
    unit.hpBar.fillRect(x - w / 2, y, w * pct, h);
    // Border
    unit.hpBar.lineStyle(1, 0x6366f1, 0.5);
    unit.hpBar.strokeRect(x - w / 2, y, w, h);
  }

  private createUI(): void {
    const cam = this.cameras.main;
    this.turnText = this.add.text(cam.width / 2, 22, '', { fontSize: '18px', color: '#c4b5fd' }).setOrigin(0.5);
    this.phaseText = this.add.text(cam.width / 2, 48, '', { fontSize: '13px', color: '#94a3b8' }).setOrigin(0.5);

    // ── Energy bar (bottom-left) ──
    const barX = 22;
    const barY = cam.height - 70;
    const barW = 130;
    const barH = 14;

    // Energy label
    this.add.text(barX, barY - 20, '蓝量', {
      fontSize: '12px', color: '#94a3b8',
    });

    // Energy bar bg + fill
    const energyBar = this.add.graphics();
    this.barUI = {
      energyBar,
      energyText: this.add.text(barX + barW + 8, barY + barH / 2, '', {
        fontSize: '13px', color: '#fbbf24', fontStyle: 'bold',
      }).setOrigin(0, 0.5),
      starBar: this.add.graphics(),
      starText: this.add.text(barX + barW + 8, barY + barH + 14, '', {
        fontSize: '12px', color: '#fde047',
      }).setOrigin(0, 0.5),
    };

    // Star energy label
    this.add.text(barX, barY + barH + 4, '星化', {
      fontSize: '12px', color: '#94a3b8',
    });

    // Form button
    this.formButton = this.add.text(barX, barY + barH * 2 + 24, '切换形态', {
      fontSize: '14px', color: '#ffffff', backgroundColor: '#7e22ce', padding: { x: 12, y: 8 },
    }).setInteractive({ useHandCursor: true });
    this.formButton.on('pointerdown', () => this.switchActiveForm());

    // End action button
    this.endActionButton = this.add.text(cam.width - 22, cam.height - 72, '结束角色行动', {
      fontSize: '15px', color: '#ffffff', backgroundColor: '#4338ca', padding: { x: 16, y: 10 },
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.endActionButton.on('pointerdown', () => this.endActiveAction());
  }

  private handleUnitClick(unit: Unit): void {
    if (!this.isPlayerPhase || this.isAnimating || !unit.alive) return;
    if (!this.selectedCard) {
      if (unit.side === 'player' && !unit.acted) this.selectPlayer(unit.id);
      return;
    }

    const target = this.selectedCard.target ?? (this.selectedCard.type === 'attack' ? 'enemy' : 'self');
    const valid = target === 'enemy' ? unit.side === 'enemy'
      : target === 'ally' ? unit.side === 'player'
        : unit.id === this.activePlayerId;
    if (!valid) {
      this.showFloatingText('目标无效', unit.x, unit.y, '#fca5a5');
      return;
    }
    this.resolveCard(this.activePlayer, this.selectedCard, unit);
  }

  private selectPlayer(id: string): void {
    const unit = this.players.find((candidate) => candidate.id === id && candidate.alive && !candidate.acted);
    if (!unit) return;
    this.activePlayerId = id;
    this.selectedCard = undefined;
    this.updateSelection();
    this.renderHand();
    this.updateUI();
  }

  private get activePlayer(): Unit {
    return this.players.find((unit) => unit.id === this.activePlayerId) ?? this.players[0];
  }

  private updateSelection(): void {
    [...this.players, ...this.enemies].forEach((unit) => {
      const active = unit.id === this.activePlayerId && unit.alive;
      const targetable = !!this.selectedCard && unit.alive && (
        (this.selectedCard.target === 'enemy' && unit.side === 'enemy') ||
        (this.selectedCard.target === 'ally' && unit.side === 'player')
      );
      unit.selector?.setStrokeStyle(active || targetable ? 3 : 0, active ? 0xfde047 : 0x22d3ee, 1);
    });
  }

  private renderHand(): void {
    this.handCards.forEach((card) => card.destroy());
    this.handCards = [];
    const unit = this.activePlayer;
    if (!unit?.alive || unit.acted) return;
    const cam = this.cameras.main;
    const width = Math.min(unit.hand.length * 130, cam.width - 330);
    const startX = (cam.width - width) / 2 + 65;
    unit.hand.forEach((data, index) => {
      const x = unit.hand.length === 1 ? cam.width / 2 : startX + (width - 130) * (index / (unit.hand.length - 1));
      const remaining = unit.cooldowns[data.id] ?? 0;
      const card = new Card(this, x, cam.height - 125, data, remaining);
      card.setPlayable(this.isPlayerPhase && !this.isAnimating && !unit.acted && unit.energy >= data.cost && remaining === 0);
      card.on('cardPlayed', () => this.chooseCard(data));
      this.handCards.push(card);
    });
  }

  private chooseCard(card: CardData): void {
    const unit = this.activePlayer;
    if (this.isAnimating || unit.energy < card.cost || (unit.cooldowns[card.id] ?? 0) > 0) return;
    const target = card.target ?? (card.type === 'attack' ? 'enemy' : 'self');
    if (target === 'enemy' || target === 'ally') {
      this.selectedCard = card;
      this.updateSelection();
      this.phaseText.setText(`选择「${card.name}」的目标`);
      return;
    }
    if (target === 'all-enemies') this.resolveCard(unit, card, undefined);
    else this.resolveCard(unit, card, unit);
  }

  private resolveCard(actor: Unit, card: CardData, target?: Unit): void {
    this.selectedCard = undefined;
    const cardIndex = actor.hand.indexOf(card);
    if (cardIndex < 0) return;
    actor.energy -= card.cost;
    if (card.cooldown) actor.cooldowns[card.id] = card.cooldown;
    actor.hand.splice(cardIndex, 1);
    actor.discard.push(card);

    sfx.playCardPlay(); // Card play SFX

    // Card trail VFX
    const cam = this.cameras.main;
    const cardY = cam.height - 125;
    this.vfx.playCardTrail(cam.width / 2, cardY, target?.x ?? actor.x, target?.y ?? actor.y, card.artColor);

    const targets = card.target === 'all-enemies' ? this.enemies.filter((unit) => unit.alive)
      : card.target === 'all-allies' ? this.players.filter((unit) => unit.alive)
      : target ? [target] : [actor];
    targets.forEach((unit) => this.applyCard(actor, unit, card));
    if (this.enemies.every((unit) => !unit.alive)) {
      this.victory();
      return;
    }
    this.renderHand();
    this.updateSelection();
    this.updateUI();
  }

  private applyCard(actor: Unit, target: Unit, card: CardData): void {
    // Card-specific VFX
    const isIce = card.owner === 'iris';
    const isPoison = card.effects?.some((e) => e.type === 'poison');
    const isBurn = card.effects?.some((e) => e.type === 'burn');
    const isHeal = card.type === 'skill' && card.effects?.some((e) => e.type === 'heal');

    if (isIce) this.vfx.playIceEffect(target.x, target.y);
    else if (isPoison) this.vfx.playPoisonEffect(target.x, target.y);
    else if (isBurn) this.vfx.playFireEffect(target.x, target.y);
    else this.createSkillEffect(card, target);

    if (card.damage) {
      let multiplier = actor.owner === 'ampere' ? actor.form === 'ALE' ? 1.5 : actor.form === 'STAR' ? 2 : 1 : 1;
      // Apply weakness (attacker deals less)
      const weakness = actor.statuses.find((s) => s.type === 'weakness');
      if (weakness) multiplier *= (1 - weakness.value / 100);
      // Strength bonus
      const strength = actor.statuses.find((s) => s.type === 'strength');
      const strengthBonus = strength ? strength.value * strength.stacks : 0;
      this.damageUnit(target, Math.round((card.damage + strengthBonus) * multiplier), card.artColor);
      if (actor.form === 'ALE') actor.starEnergy = Math.min(30, actor.starEnergy + card.damage);
      sfx.playAttack();
    }
    if (card.block) {
      target.block += card.block;
      this.vfx.playShieldEffect(target.x, target.y);
      this.showFloatingText(`+${card.block}🛡`, target.x, target.y, '#60a5fa');
      sfx.playBlock();
    }
    if (isHeal) this.vfx.playHealEffect(actor.x, actor.y);
    card.effects?.forEach((effect) => {
      const recipient = effect.target === 'self' ? actor : target;
      if (effect.type === 'heal') {
        recipient.hp = Math.min(recipient.maxHP, recipient.hp + effect.value);
        this.showFloatingText(`+${effect.value}❤`, recipient.x, recipient.y, '#4ade80');
        sfx.playHeal();
      } else if (effect.type === 'energy') {
        recipient.energy = Math.min(recipient.maxEnergy + 2, recipient.energy + effect.value);
        this.vfx.playEnergyEffect(recipient.x, recipient.y);
        sfx.playEnergy();
      } else if (effect.type === 'draw') {
        this.drawCards(recipient, effect.value);
      } else if (effect.type === 'damage') {
        this.damageUnit(recipient, effect.value, card.artColor);
        sfx.playAttack();
      } else if (effect.type === 'block') {
        recipient.block += effect.value;
        this.vfx.playShieldEffect(recipient.x, recipient.y);
        sfx.playBlock();
      } else if (effect.type === 'poison') {
        this.applyStatus(recipient, 'poison', effect.duration ?? 3, effect.value);
      } else if (effect.type === 'burn') {
        this.applyStatus(recipient, 'burn', effect.duration ?? 3, effect.value);
      } else if (effect.type === 'weakness') {
        this.applyStatus(recipient, 'weakness', effect.duration ?? 2, effect.value);
      } else if (effect.type === 'vulnerable') {
        this.applyStatus(recipient, 'vulnerable', effect.duration ?? 2, effect.value);
      } else if (effect.type === 'lifesteal') {
        // Heal actor for percentage of last damage dealt
        const healAmt = Math.round((card.damage ?? 0) * effect.value / 100);
        actor.hp = Math.min(actor.maxHP, actor.hp + healAmt);
        this.showFloatingText(`+${healAmt}❤`, actor.x, actor.y, '#ec4899');
        sfx.playHeal();
      }
    });
  }

  // ── Status Effects ──

  private applyStatus(unit: Unit, type: StatusType, stacks: number, value: number): void {
    const existing = unit.statuses.find((s) => s.type === type);
    if (existing) {
      existing.stacks += stacks;
      existing.value = value;
    } else {
      unit.statuses.push({ type, stacks, value });
    }
    const info = STATUS_INFO[type];
    this.showFloatingText(`${info.icon} ${info.name} ×${stacks}`, unit.x, unit.y - 30, info.color);
  }

  /**
   * Process status effects at the start of a unit's turn.
   * Returns true if the unit died from status damage.
   */
  private processStatusEffects(unit: Unit): boolean {
    const toRemove: StatusType[] = [];

    for (const status of unit.statuses) {
      switch (status.type) {
        case 'poison':
          unit.hp = Math.max(0, unit.hp - status.value);
          this.showFloatingText(`☠ -${status.value}`, unit.x, unit.y, '#22c55e');
          this.createAttackEffect(unit.x, unit.y, 0x22c55e);
          sfx.playPoison();
          break;
        case 'burn':
          unit.hp = Math.max(0, unit.hp - status.value);
          this.showFloatingText(`🔥 -${status.value}`, unit.x, unit.y, '#f97316');
          this.createAttackEffect(unit.x, unit.y, 0xf97316);
          sfx.playBurn();
          break;
        case 'regeneration':
          unit.hp = Math.min(unit.maxHP, unit.hp + status.value);
          this.showFloatingText(`💚 +${status.value}`, unit.x, unit.y, '#4ade80');
          break;
        // weakness, vulnerable, strength are passive — checked in damageUnit
      }

      // Only tick down active statuses, not passive ones
      if (status.type === 'poison' || status.type === 'burn' || status.type === 'regeneration') {
        status.stacks--;
        if (status.stacks <= 0) toRemove.push(status.type);
      }
    }

    unit.statuses = unit.statuses.filter((s) => !toRemove.includes(s.type));

    if (unit.hp <= 0) {
      unit.alive = false;
      unit.sprite?.setAlpha(0.25).disableInteractive();
      unit.selector?.setVisible(false);
      unit.statusText?.setText('已倒下').setColor('#64748b');
      return true;
    }
    return false;
  }

  private getStatusesString(unit: Unit): string {
    return unit.statuses.map((s) => {
      const info = STATUS_INFO[s.type];
      return `${info.icon}${s.stacks}`;
    }).join(' ');
  }

  private damageUnit(unit: Unit, amount: number, color: number = 0xef4444): void {
    // Apply vulnerability (target takes more damage)
    const vulnerable = unit.statuses.find((s) => s.type === 'vulnerable');
    if (vulnerable) amount = Math.round(amount * (1 + vulnerable.value / 100));

    const absorbed = Math.min(unit.block, amount);
    unit.block -= absorbed;
    let damage = amount - absorbed;
    unit.hp = Math.max(0, unit.hp - damage);

    // Use VFX engine for attack effect
    this.vfx.playAttack(unit.x, unit.y, color, damage);
    this.showFloatingText(damage > 0 ? `-${damage}` : '格挡', unit.x, unit.y, damage > 0 ? '#f87171' : '#60a5fa');

    // Sprite flash red
    if (damage > 0 && unit.sprite instanceof Phaser.GameObjects.Image) {
      unit.sprite.setTint(0xff0000);
      this.time.delayedCall(150, () => {
        if (unit.sprite instanceof Phaser.GameObjects.Image) unit.sprite.clearTint();
      });
    }

    if (unit.hp === 0) {
      unit.alive = false;
      unit.sprite?.setAlpha(0.25).disableInteractive();
      unit.selector?.setVisible(false);
      unit.statusText?.setText('已倒下').setColor('#64748b');
      this.vfx.playDeathEffect(unit.x, unit.y, 0x64748b);
    }
  }

  private endActiveAction(): void {
    if (!this.isPlayerPhase || this.isAnimating) return;
    const unit = this.activePlayer;
    this.selectedCard = undefined;
    this.updateSelection();
    unit.acted = true;
    unit.discard.push(...unit.hand);
    unit.hand = [];
    const next = this.players.find((candidate) => candidate.alive && !candidate.acted);
    if (next) this.selectPlayer(next.id);
    else this.startEnemyPhase();
  }

  private startEnemyPhase(): void {
    this.isPlayerPhase = false;
    this.handCards.forEach((card) => card.destroy());
    this.handCards = [];
    this.phaseText.setText('敌方行动');
    this.vfx.playTurnTransition(false);
    this.runEnemyAction(0);
  }

  private runEnemyAction(index: number): void {
    const enemies = this.enemies.filter((unit) => unit.alive);
    if (index >= enemies.length) {
      this.time.delayedCall(500, () => this.startPlayerTurn());
      return;
    }
    const enemy = enemies[index];
    const skill = enemy.plannedSkill;
    const targets = this.players.filter((unit) => unit.alive);
    const target = Phaser.Utils.Array.GetRandom(targets);
    if (!target) { this.finishEnemyAction(enemy, index); return; }

    if (skill) {
      // Skill-based action
      this.showFloatingText(`${skill.icon} ${skill.name}`, enemy.x, enemy.y - 50, skill.type === 'defend' ? '#60a5fa' : '#f87171');

      switch (skill.type) {
        case 'attack':
        case 'multi_attack': {
          const hits = skill.hitCount ?? 1;
          const totalDelay = (hits - 1) * 250 + 400;
          for (let h = 0; h < hits; h++) {
            this.time.delayedCall(h * 250, () => {
              if (!target.alive) return;
              const dmg = Phaser.Math.Between(skill.damageMin ?? 5, skill.damageMax ?? 8);
              this.damageUnit(target, target.form === 'STAR' ? 0 : dmg, skill.animColor);
              this.updateUI();
            });
          }
          // Chain next action after all hits resolve
          this.time.delayedCall(totalDelay, () => {
            this.finishEnemyAction(enemy, index);
          });
          return; // Don't fall through to synchronous finish
        }
        case 'defend': {
          const block = Phaser.Math.Between(skill.blockMin ?? 5, skill.blockMax ?? 9);
          enemy.block += block;
          this.createShieldEffect(enemy.x, enemy.y);
          this.showFloatingText(`+${block}🛡`, enemy.x, enemy.y, '#60a5fa');
          sfx.playBlock();
          break;
        }
        case 'buff':
        case 'debuff': {
          // Apply status effects
          if (skill.applyStatus) {
            for (const status of skill.applyStatus) {
              const statusTarget = status.target === 'self' ? enemy : target;
              this.applyStatus(statusTarget, status.type, status.stacks, status.value);
            }
          }
          // Also deal damage if skill has it
          if (skill.damageMin) {
            const dmg = Phaser.Math.Between(skill.damageMin, skill.damageMax ?? skill.damageMin);
            this.damageUnit(target, target.form === 'STAR' ? 0 : dmg, skill.animColor);
          }
          break;
        }
        case 'heal': {
          const healAmt = Phaser.Math.Between(skill.healMin ?? 5, skill.healMax ?? 8);
          enemy.hp = Math.min(enemy.maxHP, enemy.hp + healAmt);
          this.showFloatingText(`+${healAmt}❤`, enemy.x, enemy.y, '#4ade80');
          sfx.playHeal();
          break;
        }
      }

      // Apply additional status effects from skill
      if (skill.applyStatus && skill.type !== 'buff' && skill.type !== 'debuff') {
        for (const status of skill.applyStatus) {
          const statusTarget = status.target === 'self' ? enemy : target;
          this.applyStatus(statusTarget, status.type, status.stacks, status.value);
        }
      }
    } else {
      // Fallback: simple attack
      const dmg = Phaser.Math.Between(7, 11);
      this.damageUnit(target, target.form === 'STAR' ? 0 : dmg);
    }

    this.updateUI();
    this.finishEnemyAction(enemy, index);
  }

  private finishEnemyAction(enemy: Unit, index: number): void {
    if (this.players.every((unit) => !unit.alive)) {
      this.defeat();
      return;
    }
    this.time.delayedCall(400, () => this.runEnemyAction(index + 1));
  }

  private startPlayerTurn(): void {
    this.turn++;
    this.isPlayerPhase = true;

    // Process status effects on all units (both sides)
    [...this.players, ...this.enemies].filter((unit) => unit.alive).forEach((unit) => {
      this.processStatusEffects(unit);
    });

    this.players.filter((unit) => unit.alive).forEach((unit) => {
      unit.acted = false;
      unit.formSwitched = false;
      unit.energy = unit.maxEnergy;
      unit.block = 0;
      unit.cooldowns = Object.fromEntries(Object.entries(unit.cooldowns)
        .map(([id, value]) => [id, (value as number) - 1]).filter(([, value]) => (value as number) > 0));
      if (unit.form === 'ALE') {
        unit.hp = Math.max(0, unit.hp - 5);
        this.showFloatingText('ALE -5❤', unit.x, unit.y, '#ec4899');
      }
      if (unit.form === 'STAR' && --unit.starTurns <= 0) unit.hp = 0;
      if (unit.hp === 0) {
        unit.alive = false;
        unit.sprite?.setAlpha(0.25).disableInteractive();
        unit.selector?.setVisible(false);
        unit.statusText?.setText('已倒下').setColor('#64748b');
        this.vfx.playDeathEffect(unit.x, unit.y, unit.form === 'STAR' ? 0xfde047 : 0xec4899);
      } else this.drawCards(unit, 5);
    });
    this.enemies.filter((unit) => unit.alive).forEach((unit) => {
      unit.block = 0;
    });
    if (this.players.every((unit) => !unit.alive)) {
      this.defeat();
      return;
    }
    const nextPlayer = this.players.find((unit) => unit.alive && !unit.acted);
    if (nextPlayer) this.selectPlayer(nextPlayer.id);
    this.rollEnemyIntents();
    this.vfx.playTurnTransition(true);
    this.updateUI();
  }

  private switchActiveForm(): void {
    const unit = this.activePlayer;
    if (!unit.owner || unit.acted || unit.formSwitched || this.isAnimating) return;
    this.selectedCard = undefined;
    this.updateSelection();

    if (unit.starEnergy >= 30) {
      unit.form = 'STAR'; unit.starEnergy = 0; unit.starTurns = 3;
    } else {
      unit.form = unit.form === 'BSE' ? 'ALE' : 'BSE';
    }

    unit.deck = this.shuffle(this.applyUpgrades(createCharacterDeck(unit.owner, unit.form)));
    unit.hand = []; unit.discard = [];
    this.drawCards(unit, 5);

    // Update texture if available
    const textureMap: Record<string, Record<string, string>> = {
      ampere: { ALE: 'char_ampere_ale', STAR: 'char_ampere_star', BSE: 'char_ampere' },
      iris: { ALE: 'char_iris', STAR: 'char_iris', BSE: 'char_iris' },
    };
    const texKey = textureMap[unit.owner]?.[unit.form];
    if (texKey && unit.sprite instanceof Phaser.GameObjects.Image && this.textures.exists(texKey)) {
      unit.sprite.setTexture(texKey);
    }

    unit.formSwitched = true;
    sfx.playFormSwitch();
    this.createFormSwitchVFX(unit);
    this.updateUI();
  }

  private createFormSwitchVFX(unit: Unit): void {
    const color = unit.form === 'ALE' ? 0xec4899 : unit.form === 'STAR' ? 0xfde047 : 0x64748b;
    this.vfx.playTransformEffect(unit.x, unit.y, color);
  }

  private rollEnemyIntents(): void {
    this.enemies.filter((unit) => unit.alive).forEach((unit) => {
      if (unit.enemyDef) {
        const skill = pickEnemySkill(unit.enemyDef, unit.hp);
        unit.plannedSkill = skill;
        unit.plannedDefend = skill.type === 'defend';
        unit.intentText?.setText(`${skill.icon} ${skill.name}`);
      } else {
        unit.plannedDefend = Math.random() < 0.3;
        unit.intentText?.setText(unit.plannedDefend ? '🛡 防御' : '⚔ 随机目标');
      }
    });
  }

  private drawCards(unit: Unit, count: number): void {
    for (let i = 0; i < count; i++) {
      if (!unit.deck.length) {
        if (!unit.discard.length) break;
        unit.deck = this.shuffle(unit.discard);
        unit.discard = [];
      }
      const card = unit.deck.pop();
      if (card) unit.hand.push(card);
    }
    if (unit.id === this.activePlayerId) this.renderHand();
  }

  private updateUI(): void {
    // Update HP bars for all units
    [...this.players, ...this.enemies].forEach((unit) => {
      unit.hpText?.setText(`${unit.hp}/${unit.maxHP}`);
      // Draw HP bar
      if (unit.hpBar && unit.alive) {
        const barW = 64;
        const barH = 6;
        const barY = unit.y + 92;
        this.drawHpBar(unit, unit.x, barY, barW, barH);
      }
      const statusStr = this.getStatusesString(unit);
      const blockStr = unit.block ? `🛡${unit.block} ` : '';
      const actedStr = unit.side === 'player' && unit.acted ? '行动结束' : '';
      if (unit.alive) unit.statusText?.setText(`${blockStr}${statusStr} ${actedStr}`.trim());
    });

    // Update energy + star bars for active player
    const active = this.activePlayer;
    if (active && this.barUI) {
      const cam = this.cameras.main;
      const barX = 22;
      const barY = cam.height - 70;
      const barW = 130;
      const barH = 14;

      // Energy bar
      this.barUI.energyBar.clear();
      this.barUI.energyBar.fillStyle(0x1e1b4b, 0.9);
      this.barUI.energyBar.fillRect(barX, barY, barW, barH);
      const energyPct = Math.max(0, active.energy / active.maxEnergy);
      this.barUI.energyBar.fillStyle(0x6366f1, 1);
      this.barUI.energyBar.fillRect(barX, barY, barW * energyPct, barH);
      this.barUI.energyBar.lineStyle(1, 0x818cf8, 0.5);
      this.barUI.energyBar.strokeRect(barX, barY, barW, barH);
      this.barUI.energyText.setText(`${active.energy}/${active.maxEnergy}`);

      // Star energy bar
      const starY = barY + barH + 8;
      const maxStar = 30;
      this.barUI.starBar.clear();
      this.barUI.starBar.fillStyle(0x1e1b4b, 0.9);
      this.barUI.starBar.fillRect(barX, starY, barW, barH);
      const starPct = Math.max(0, active.starEnergy / maxStar);
      this.barUI.starBar.fillStyle(0xfde047, 1);
      this.barUI.starBar.fillRect(barX, starY, barW * starPct, barH);
      this.barUI.starBar.lineStyle(1, 0xfbbf24, 0.5);
      this.barUI.starBar.strokeRect(barX, starY, barW, barH);
      this.barUI.starText.setText(`${active.starEnergy}/${maxStar}`);
    }

    this.turnText.setText(`第 ${this.turn} 回合 · ${active?.name ?? ''}`);
    this.phaseText.setText(this.selectedCard ? `请选择「${this.selectedCard.name}」的目标` : this.isPlayerPhase ? '玩家行动阶段' : '敌方行动阶段');
    this.formButton.setVisible(active != null && this.isPlayerPhase);
  }

  private createSkillEffect(card: CardData, target: Unit): void {
    const isIce = card.owner === 'iris';
    const color = card.artColor;
    const ringCount = card.id === 'iris_zero' || card.id === 'star_fall' ? 3 : 1;

    for (let ringIndex = 0; ringIndex < ringCount; ringIndex++) {
      const ring = this.add.circle(target.x, target.y, 24 + ringIndex * 12, color, 0)
        .setStrokeStyle(isIce ? 3 : 2, color, 0.9)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.tweens.add({
        targets: ring,
        scale: isIce ? 1.8 : 2.3,
        angle: isIce ? 90 : 0,
        alpha: 0,
        duration: 420 + ringIndex * 120,
        delay: ringIndex * 70,
        onComplete: () => ring.destroy(),
      });
    }

    const particleCount = card.id === 'electromagnetic_bolt' ? 14
      : card.id === 'iris_zero' ? 18
        : card.id === 'star_fall' ? 22 : 8;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.PI * 2 * i / particleCount;
      const shard = this.add.rectangle(
        target.x + Math.cos(angle) * 58,
        target.y + Math.sin(angle) * 58,
        isIce ? 3 : 5,
        isIce ? 14 : 5,
        color,
        0.9,
      ).setRotation(angle).setBlendMode(Phaser.BlendModes.ADD).setDepth(899);
      this.tweens.add({
        targets: shard,
        x: target.x,
        y: target.y,
        alpha: 0,
        duration: 260 + i * 8,
        onComplete: () => shard.destroy(),
      });
    }
  }

  private createAttackEffect(x: number, y: number, color: number): void {
    const flash = this.add.circle(x, y, 25, color, 0.9)
      .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
    this.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 200, onComplete: () => flash.destroy() });

    for (let i = 0; i < 12; i++) {
      const angle = Math.PI * 2 * i / 12;
      const dist = 50 + Math.random() * 30;
      const p = this.add.circle(x, y, Math.random() * 3 + 2, color, 0.9).setDepth(898);
      this.tweens.add({
        targets: p, x: x + Math.cos(angle) * dist, y: y + Math.sin(angle) * dist,
        alpha: 0, scale: 0.2, duration: 300 + Math.random() * 100, ease: 'Cubic.easeOut',
        onComplete: () => p.destroy(),
      });
    }

    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2;
      const len = 20 + Math.random() * 20;
      const spark = this.add.rectangle(
        x + Math.cos(angle) * len / 2, y + Math.sin(angle) * len / 2,
        len, 2, color, 0.8,
      ).setRotation(angle).setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.tweens.add({ targets: spark, alpha: 0, scaleX: 0.1, duration: 200, onComplete: () => spark.destroy() });
    }
  }

  private createShieldEffect(x: number, y: number): void {
    const shield = this.add.circle(x, y, 42, 0x60a5fa, 0).setStrokeStyle(4, 0x60a5fa).setDepth(898);
    this.tweens.add({ targets: shield, scale: 1.5, alpha: 0, duration: 500, onComplete: () => shield.destroy() });

    const glow = this.add.circle(x, y, 25, 0x93c5fd, 0.3).setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
    this.tweens.add({ targets: glow, scale: 1.8, alpha: 0, duration: 400, onComplete: () => glow.destroy() });

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const sparkle = this.add.circle(x + Math.cos(angle) * 35, y + Math.sin(angle) * 35, 2, 0xbfdbfe, 0.8)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(898);
      this.tweens.add({
        targets: sparkle, x: x + Math.cos(angle) * 55, y: y + Math.sin(angle) * 55,
        alpha: 0, duration: 350, onComplete: () => sparkle.destroy(),
      });
    }
  }

  private showFloatingText(text: string, x: number, y: number, color: string): void {
    const label = this.add.text(x, y, text, { fontSize: '24px', color, fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(999);
    this.tweens.add({ targets: label, y: y - 55, alpha: 0, duration: 850, onComplete: () => label.destroy() });
  }

  private victory(): void {
    sfx.stopBattleBGM();
    sfx.playVictory();

    // Victory particles burst
    const cam = this.cameras.main;
    for (let i = 0; i < 25; i++) {
      const px = cam.width / 2 + (Math.random() - 0.5) * 400;
      const py = cam.height + 20;
      const particle = this.add.circle(px, py, Math.random() * 3 + 2,
        [0xfbbf24, 0xa78bfa, 0x6366f1, 0x22c55e, 0xec4899][Math.floor(Math.random() * 5)], 1).setDepth(1502);
      this.tweens.add({
        targets: particle,
        y: -20, x: px + (Math.random() - 0.5) * 120, alpha: 0,
        duration: 1500 + Math.random() * 1000,
        onComplete: () => particle.destroy(),
      });
    }

    // Award gold
    const goldReward = 30 + Math.floor(Math.random() * 20);
    const currentGold = loadGold();
    saveGold(currentGold + goldReward);

    // Random equipment drop
    const dropId = rollDrop('chapter1');
    let dropText = '';
    if (dropId) {
      addEquipment(dropId);
      const def = EQUIPMENT_DB[dropId];
      dropText = def ? `\n获得装备: ${def.icon} ${def.name}` : '';
    }

    this.showResult(`战斗胜利！\n💰 +${goldReward}${dropText}`, '#fde047', 'ChapterCompleteScene');
  }
  private defeat(): void {
    sfx.stopBattleBGM();
    sfx.playDefeat();
    this.isAnimating = true;
    const cam = this.cameras.main;

    // Overlay
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.8).setDepth(1500);

    // Title
    this.add.text(cam.width / 2, cam.height / 2 - 60, '战斗失败…', {
      fontSize: '42px', color: '#f87171', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1501);

    // Hint
    this.add.text(cam.width / 2, cam.height / 2 - 10, '不要放弃，再试一次！或者跳过战斗继续剧情', {
      fontSize: '14px', color: '#94a3b8',
    }).setOrigin(0.5).setDepth(1501);

    // Retry button
    const retryBg = this.add.rectangle(cam.width / 2 - 120, cam.height / 2 + 60, 140, 44, 0x4338ca)
      .setStrokeStyle(2, 0x818cf8).setInteractive({ useHandCursor: true }).setDepth(1501);
    this.add.text(cam.width / 2 - 120, cam.height / 2 + 60, '重新挑战', {
      fontSize: '17px', fontFamily: '"Noto Serif SC", serif', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1501);
    retryBg.on('pointerover', () => retryBg.setFillStyle(0x6366f1));
    retryBg.on('pointerout', () => retryBg.setFillStyle(0x4338ca));
    retryBg.on('pointerdown', () => this.scene.start('BattleScene'));

    // Skip battle button — continue story
    const skipBg = this.add.rectangle(cam.width / 2 + 20, cam.height / 2 + 60, 140, 44, 0x78350f)
      .setStrokeStyle(2, 0xfbbf24).setInteractive({ useHandCursor: true }).setDepth(1501);
    this.add.text(cam.width / 2 + 20, cam.height / 2 + 60, '跳过战斗', {
      fontSize: '17px', fontFamily: '"Noto Serif SC", serif', color: '#fbbf24', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1501);
    skipBg.on('pointerover', () => skipBg.setFillStyle(0x92400e));
    skipBg.on('pointerout', () => skipBg.setFillStyle(0x78350f));
    skipBg.on('pointerdown', () => {
      sfx.stopBattleBGM();
      this.scene.start('ChapterCompleteScene');
    });

    // Title screen button
    const titleBg = this.add.rectangle(cam.width / 2 + 160, cam.height / 2 + 60, 140, 44, 0x334155)
      .setStrokeStyle(2, 0x818cf8).setInteractive({ useHandCursor: true }).setDepth(1501);
    this.add.text(cam.width / 2 + 160, cam.height / 2 + 60, '返回标题', {
      fontSize: '17px', fontFamily: '"Noto Serif SC", serif', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1501);
    titleBg.on('pointerover', () => titleBg.setFillStyle(0x6366f1));
    titleBg.on('pointerout', () => titleBg.setFillStyle(0x334155));
    titleBg.on('pointerdown', () => this.scene.start('TitleScreen'));
  }

  private showResult(title: string, color: string, nextScene: string): void {
    this.isAnimating = true;
    const cam = this.cameras.main;
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.8).setDepth(1500);
    this.add.text(cam.width / 2, cam.height / 2 - 40, title, {
      fontSize: '36px', color, fontStyle: 'bold', align: 'center', lineSpacing: 8,
    }).setOrigin(0.5).setDepth(1501);
    this.add.text(cam.width / 2, cam.height / 2 + 60, '点击继续', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5).setDepth(1501);
    this.input.once('pointerdown', () => this.scene.start(nextScene));
  }

  private applyUpgrades(deck: CardData[]): CardData[] {
    const upgrades = loadCardUpgrades();
    return deck.map((card) => {
      const level = upgrades[card.id] ?? 0;
      return level > 0 ? applyCardUpgrade(card, level) : card;
    });
  }

  private shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
