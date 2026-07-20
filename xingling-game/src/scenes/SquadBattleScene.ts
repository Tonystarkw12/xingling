import Phaser from 'phaser';
import { Card } from '../ui/Card';
import { BattleTutorial } from '../ui/BattleTutorial';
import {
  type BattleForm,
  type CardData,
  type CharacterId,
  createCharacterDeck,
} from '../data/CardDatabase';
import { loadSave, markBattleTutorialSeen, saveCheckpoint } from '../data/SaveSystem';

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
  deck: CardData[];
  hand: CardData[];
  discard: CardData[];
  sprite?: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;
  hpText?: Phaser.GameObjects.Text;
  statusText?: Phaser.GameObjects.Text;
  intentText?: Phaser.GameObjects.Text;
  selector?: Phaser.GameObjects.Arc;
  x: number;
  y: number;
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
  private resourceText!: Phaser.GameObjects.Text;
  private formButton!: Phaser.GameObjects.Text;
  private endActionButton!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    saveCheckpoint('battle');
    this.sound.stopAll();
    this.sound.removeAll();
    this.createBackground();
    this.createUnits();
    this.createUI();
    this.players.forEach((unit) => this.drawCards(unit, 5));
    this.selectPlayer('ampere');
    this.rollEnemyIntents();
    this.updateUI();

    if (this.cache.audio.exists('bgm_acestep')) this.sound.play('bgm_acestep', { loop: true, volume: 0.4 });
    if (!loadSave().battleTutorialSeen) {
      this.isAnimating = true;
      new BattleTutorial(this, () => {
        markBattleTutorialSeen();
        this.isAnimating = false;
        this.renderHand();
      });
    }
  }

  private createBackground(): void {
    const cam = this.cameras.main;
    if (this.textures.exists('bg_nock_city')) {
      const bg = this.add.image(cam.width / 2, cam.height / 2, 'bg_nock_city');
      const source = bg.texture.getSourceImage();
      if (source) bg.setScale(Math.max(cam.width / source.width, cam.height / source.height));
    } else {
      this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x0f172a);
    }
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x020617, 0.42);
  }

  private createUnits(): void {
    const cam = this.cameras.main;
    this.players = [
      this.makeUnit('ampere', '安培尔', 'player', 60, cam.width * 0.17, cam.height * 0.43, 'char_ampere'),
      this.makeUnit('iris', '艾莉丝', 'player', 52, cam.width * 0.35, cam.height * 0.43, 'char_iris'),
    ];
    this.enemies = [
      this.makeUnit('guard', '暗影卫兵', 'enemy', 42, cam.width * 0.68, cam.height * 0.4),
      this.makeUnit('hunter', '崩坏猎手', 'enemy', 48, cam.width * 0.84, cam.height * 0.4),
    ];
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
      cooldowns: {}, formSwitched: false, plannedDefend: false,
      deck: owner ? this.shuffle(createCharacterDeck(owner)) : [], hand: [], discard: [], x, y,
    };

    if (texture && this.textures.exists(texture)) {
      const image = this.add.image(x, y + 70, texture).setOrigin(0.5, 1);
      const source = image.texture.getSourceImage();
      if (source) image.setScale(Math.min((this.cameras.main.height * 0.3) / source.height, 0.38));
      unit.sprite = image;
    } else {
      const color = id === 'guard' ? 0xef4444 : 0xa855f7;
      unit.sprite = this.add.rectangle(x, y, 72, 112, color, 0.45).setStrokeStyle(3, color);
    }

    this.add.text(x, y - 88, name, {
      fontSize: '16px', color: side === 'player' ? '#fde68a' : '#fca5a5', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);
    unit.hpText = this.add.text(x, y + 78, '', { fontSize: '13px', color: '#ffffff' }).setOrigin(0.5);
    unit.statusText = this.add.text(x, y + 98, '', { fontSize: '12px', color: '#93c5fd' }).setOrigin(0.5);
    unit.intentText = side === 'enemy'
      ? this.add.text(x, y - 116, '', { fontSize: '13px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5)
      : undefined;
    unit.selector = this.add.circle(x, y, 58, 0xfde047, 0).setStrokeStyle(3, 0xfde047, 0).setDepth(20);

    unit.sprite.setInteractive({ useHandCursor: true });
    unit.sprite.on('pointerdown', () => this.handleUnitClick(unit));
    return unit;
  }

  private createUI(): void {
    const cam = this.cameras.main;
    this.turnText = this.add.text(cam.width / 2, 22, '', { fontSize: '18px', color: '#c4b5fd' }).setOrigin(0.5);
    this.phaseText = this.add.text(cam.width / 2, 48, '', { fontSize: '13px', color: '#94a3b8' }).setOrigin(0.5);
    this.resourceText = this.add.text(22, cam.height - 55, '', { fontSize: '14px', color: '#fde68a' });
    this.formButton = this.add.text(22, cam.height - 90, '切换形态', {
      fontSize: '14px', color: '#ffffff', backgroundColor: '#7e22ce', padding: { x: 12, y: 8 },
    }).setInteractive({ useHandCursor: true });
    this.formButton.on('pointerdown', () => this.switchActiveForm());
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
    if (card.cooldown) actor.cooldowns[card.id] = card.cooldown + 1;
    actor.hand.splice(cardIndex, 1);
    actor.discard.push(card);

    const targets = card.target === 'all-enemies' ? this.enemies.filter((unit) => unit.alive) : target ? [target] : [actor];
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
    this.createSkillEffect(card, target);
    if (card.damage) {
      const multiplier = actor.owner === 'ampere' ? actor.form === 'ALE' ? 1.5 : actor.form === 'STAR' ? 2 : 1 : 1;
      this.damageUnit(target, Math.round(card.damage * multiplier), card.artColor);
      if (actor.form === 'ALE') actor.starEnergy = Math.min(30, actor.starEnergy + card.damage);
    }
    if (card.block) {
      target.block += card.block;
      this.createShieldEffect(target.x, target.y);
      this.showFloatingText(`+${card.block}🛡`, target.x, target.y, '#60a5fa');
    }
    card.effects?.forEach((effect) => {
      const recipient = effect.target === 'self' ? actor : target;
      if (effect.type === 'heal') {
        recipient.hp = Math.min(recipient.maxHP, recipient.hp + effect.value);
        this.showFloatingText(`+${effect.value}❤`, recipient.x, recipient.y, '#4ade80');
      } else if (effect.type === 'energy') {
        recipient.energy = Math.min(recipient.maxEnergy + 2, recipient.energy + effect.value);
      } else if (effect.type === 'draw') {
        this.drawCards(recipient, effect.value);
      } else if (effect.type === 'damage') {
        this.damageUnit(recipient, effect.value, card.artColor);
      } else if (effect.type === 'block') {
        recipient.block += effect.value;
        this.createShieldEffect(recipient.x, recipient.y);
      }
    });
  }

  private damageUnit(unit: Unit, amount: number, color: number = 0xef4444): void {
    const absorbed = Math.min(unit.block, amount);
    unit.block -= absorbed;
    const damage = amount - absorbed;
    unit.hp = Math.max(0, unit.hp - damage);
    this.createAttackEffect(unit.x, unit.y, color);
    this.showFloatingText(damage > 0 ? `-${damage}` : '格挡', unit.x, unit.y, damage > 0 ? '#f87171' : '#60a5fa');
    if (unit.hp === 0) {
      unit.alive = false;
      unit.sprite?.setAlpha(0.25).disableInteractive();
      unit.selector?.setVisible(false);
      unit.statusText?.setText('已倒下').setColor('#64748b');
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
    this.runEnemyAction(0);
  }

  private runEnemyAction(index: number): void {
    const enemies = this.enemies.filter((unit) => unit.alive);
    if (index >= enemies.length) {
      this.time.delayedCall(500, () => this.startPlayerTurn());
      return;
    }
    const enemy = enemies[index];
    const defend = enemy.plannedDefend;
    if (defend) {
      const block = Phaser.Math.Between(5, 9);
      enemy.block += block;
      this.createShieldEffect(enemy.x, enemy.y);
      this.showFloatingText(`+${block}🛡`, enemy.x, enemy.y, '#60a5fa');
    } else {
      const targets = this.players.filter((unit) => unit.alive);
      const target = Phaser.Utils.Array.GetRandom(targets);
      const damage = enemy.id === 'hunter' ? Phaser.Math.Between(9, 13) : Phaser.Math.Between(7, 11);
      this.damageUnit(target, target.form === 'STAR' ? 0 : damage);
    }
    this.updateUI();
    if (this.players.every((unit) => !unit.alive)) {
      this.time.delayedCall(500, () => this.defeat());
      return;
    }
    this.time.delayedCall(700, () => this.runEnemyAction(index + 1));
  }

  private startPlayerTurn(): void {
    this.turn++;
    this.isPlayerPhase = true;
    this.players.filter((unit) => unit.alive).forEach((unit) => {
      unit.acted = false;
      unit.formSwitched = false;
      unit.energy = unit.maxEnergy;
      unit.block = 0;
      unit.cooldowns = Object.fromEntries(Object.entries(unit.cooldowns)
        .map(([id, value]) => [id, value - 1]).filter(([, value]) => value > 0));
      if (unit.form === 'ALE') unit.hp = Math.max(0, unit.hp - 5);
      if (unit.form === 'STAR' && --unit.starTurns <= 0) unit.hp = 0;
      if (unit.hp === 0) {
        unit.alive = false;
        unit.sprite?.setAlpha(0.25).disableInteractive();
      } else this.drawCards(unit, 5);
    });
    if (this.players.every((unit) => !unit.alive)) {
      this.defeat();
      return;
    }
    this.selectPlayer(this.players.find((unit) => unit.alive && !unit.acted)!.id);
    this.rollEnemyIntents();
    this.updateUI();
  }

  private switchActiveForm(): void {
    const unit = this.activePlayer;
    if (unit.owner !== 'ampere' || unit.acted || unit.formSwitched || this.isAnimating) return;
    this.selectedCard = undefined;
    this.updateSelection();
    if (unit.starEnergy >= 30) {
      unit.form = 'STAR'; unit.starEnergy = 0; unit.starTurns = 3;
    } else unit.form = unit.form === 'BSE' ? 'ALE' : 'BSE';
    unit.deck = this.shuffle(createCharacterDeck('ampere', unit.form));
    unit.hand = []; unit.discard = [];
    this.drawCards(unit, 5);
    const texture = unit.form === 'ALE' ? 'char_ampere_ale' : unit.form === 'STAR' ? 'char_ampere_star' : 'char_ampere';
    if (unit.sprite instanceof Phaser.GameObjects.Image && this.textures.exists(texture)) unit.sprite.setTexture(texture);
    unit.formSwitched = true;
    this.updateUI();
  }

  private rollEnemyIntents(): void {
    this.enemies.filter((unit) => unit.alive).forEach((unit) => {
      unit.plannedDefend = Math.random() < 0.3;
      unit.intentText?.setText(unit.plannedDefend ? '🛡 防御' : '⚔ 随机目标');
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
    [...this.players, ...this.enemies].forEach((unit) => {
      unit.hpText?.setText(`${unit.hp}/${unit.maxHP}`);
      if (unit.alive) unit.statusText?.setText(`${unit.block ? `🛡${unit.block} ` : ''}${unit.side === 'player' && unit.acted ? '行动结束' : ''}`);
    });
    const active = this.activePlayer;
    this.turnText.setText(`第 ${this.turn} 回合 · ${active?.name ?? ''}`);
    this.phaseText.setText(this.selectedCard ? `请选择「${this.selectedCard.name}」的目标` : this.isPlayerPhase ? '玩家行动阶段' : '敌方行动阶段');
    this.resourceText.setText(active ? `蓝量 ${active.energy}/${active.maxEnergy}${active.owner === 'ampere' ? `　${active.form}　星化 ${active.starEnergy}/30` : '　冰系权能'}` : '');
    this.formButton.setVisible(active?.owner === 'ampere' && this.isPlayerPhase);
  }

  private createSkillEffect(card: CardData, target: Unit): void {
    const isIce = card.owner === 'iris';
    const color = card.artColor;
    const ringCount = card.id === 'iris_zero' || card.id === 'star_fall' ? 3 : 1;

    for (let ringIndex = 0; ringIndex < ringCount; ringIndex++) {
      const ring = this.add.circle(target.x, target.y, 24 + ringIndex * 12, color, 0)
        .setStrokeStyle(isIce ? 3 : 2, color, 0.9)
        .setBlendMode(Phaser.BlendModes.ADD);
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
      ).setRotation(angle).setBlendMode(Phaser.BlendModes.ADD);
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
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(x, y, 4, color);
      const angle = Math.PI * 2 * i / 10;
      this.tweens.add({ targets: particle, x: x + Math.cos(angle) * 60, y: y + Math.sin(angle) * 60, alpha: 0, duration: 350, onComplete: () => particle.destroy() });
    }
  }

  private createShieldEffect(x: number, y: number): void {
    const shield = this.add.circle(x, y, 42, 0x60a5fa, 0).setStrokeStyle(4, 0x60a5fa);
    this.tweens.add({ targets: shield, scale: 1.5, alpha: 0, duration: 500, onComplete: () => shield.destroy() });
  }

  private showFloatingText(text: string, x: number, y: number, color: string): void {
    const label = this.add.text(x, y, text, { fontSize: '24px', color, fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(999);
    this.tweens.add({ targets: label, y: y - 55, alpha: 0, duration: 850, onComplete: () => label.destroy() });
  }

  private victory(): void { this.showResult('战斗胜利！', '#fde047', 'ChapterCompleteScene'); }
  private defeat(): void { this.showResult('战斗失败…', '#f87171', 'BattleScene'); }

  private showResult(title: string, color: string, nextScene: string): void {
    this.isAnimating = true;
    const cam = this.cameras.main;
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x000000, 0.8).setDepth(1500);
    this.add.text(cam.width / 2, cam.height / 2 - 30, title, { fontSize: '48px', color, fontStyle: 'bold' }).setOrigin(0.5).setDepth(1501);
    this.add.text(cam.width / 2, cam.height / 2 + 40, '点击继续', { fontSize: '18px', color: '#ffffff' }).setOrigin(0.5).setDepth(1501);
    this.input.once('pointerdown', () => this.scene.start(nextScene));
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
