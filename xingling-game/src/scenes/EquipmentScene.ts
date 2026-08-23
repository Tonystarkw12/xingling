import Phaser from 'phaser';
import { EquipmentCard } from '../ui/EquipmentCard';
import {
  EQUIPMENT_DB, SLOT_NAMES, RARITY_COLORS, SET_DB,
  getEffectiveEffects, getEnhanceCost, getEnhanceSuccessRate,
  calculateTotalStats, getActiveSets,
  type InventoryItem, type EquippedState, type EquipSlot, type EquipStat,
} from '../data/EquipmentDatabase';
import { loadEquipment, saveEquipment, loadGold, saveGold } from '../data/SaveSystem';
import { sfx } from '../ui/SFXManager';

/**
 * Equipment Scene — full equipment management with enhance/dismantle.
 *
 * Layout:
 * ┌────────────────────────────────────────────┐
 * │  [角色选择]                                 │
 * │  [装备槽: 武器/护甲/饰品]  [属性总览]       │
 * │  [套装效果提示]                             │
 * │────────────────────────────────────────────│
 * │  [背包网格]           [装备详情面板]         │
 * │  [筛选按钮]           [强化/卸下/分解按钮]  │
 * └────────────────────────────────────────────┘
 */
export class EquipmentScene extends Phaser.Scene {
  private inventory: InventoryItem[] = [];
  private equipped: EquippedState = {};
  private gold: number = 0;
  private selectedUid: string | null = null;
  private filterSlot: EquipSlot | 'all' = 'all';

  // UI containers
  private slotsContainer!: Phaser.GameObjects.Container;
  private statsContainer!: Phaser.GameObjects.Container;
  private bagContainer!: Phaser.GameObjects.Container;
  private detailContainer!: Phaser.GameObjects.Container;
  private setContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'EquipmentScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    const data = loadEquipment();
    this.inventory = data.inventory;
    this.equipped = data.equipped;
    this.gold = loadGold();
    this.selectedUid = null;
    this.filterSlot = 'all';

    // Background
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x080816);

    // Title
    this.add.text(cam.width / 2, 28, '装备管理', {
      fontSize: '26px', fontFamily: '"Noto Serif SC", serif',
      color: '#e0e7ff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Gold display
    this.add.text(cam.width - 20, 28, `💰 ${this.gold}`, {
      fontSize: '16px', color: '#fbbf24', fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    // Containers
    this.slotsContainer = this.add.container(0, 0);
    this.statsContainer = this.add.container(0, 0);
    this.bagContainer = this.add.container(0, 0);
    this.detailContainer = this.add.container(0, 0);
    this.setContainer = this.add.container(0, 0);

    this.renderAll();

    // Back button
    this.createButton(cam.width - 70, cam.height - 30, 120, 36, '返回', 0x334155, () => this.goBack());

    // ESC
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.on('down', () => this.goBack());

    cam.fadeIn(300, 0, 0, 0);
  }

  private renderAll(): void {
    this.renderSlots();
    this.renderStats();
    this.renderSetBonuses();
    this.renderBag();
    this.renderDetail();
  }

  // ── Equipment Slots (top-left) ──
  private renderSlots(): void {
    this.slotsContainer.removeAll(true);
    const cam = this.cameras.main;
    const pad = cam.width * 0.026;  // ~30px at 1152
    const y = cam.height * 0.085;   // ~65px at 768
    const slotWidth = Math.min(140, cam.width * 0.12);

    (['weapon', 'armor', 'accessory'] as EquipSlot[]).forEach((slot, i) => {
      const x = pad + i * (slotWidth + cam.width * 0.01);
      const uid = this.equipped[slot];
      const item = uid ? this.inventory.find((it) => it.uid === uid) : null;
      const def = item ? EQUIPMENT_DB[item.id] : null;

      // Slot frame
      const frame = this.add.rectangle(x + slotWidth / 2, y + 40, slotWidth, 80, 0x0f172a, 0.9);
      frame.setStrokeStyle(2, def ? RARITY_COLORS[def.rarity].phaser : 0x334155);
      frame.setInteractive({ useHandCursor: true });
      this.slotsContainer.add(frame);

      // Slot label
      const label = this.add.text(x + slotWidth / 2, y - 2, SLOT_NAMES[slot], {
        fontSize: '13px', color: '#94a3b8', fontStyle: 'bold',
      }).setOrigin(0.5);
      this.slotsContainer.add(label);

      if (def && item) {
        // Icon
        const icon = this.add.text(x + slotWidth / 2, y + 28, def.icon, {
          fontSize: '24px', color: '#ffffff',
        }).setOrigin(0.5);
        this.slotsContainer.add(icon);

        // Name + level
        const levelStr = item.level > 0 ? ` +${item.level}` : '';
        const name = this.add.text(x + slotWidth / 2, y + 54, `${def.name}${levelStr}`, {
          fontSize: '11px', color: RARITY_COLORS[def.rarity].hex, fontStyle: 'bold',
        }).setOrigin(0.5);
        this.slotsContainer.add(name);

        // Click to unequip
        frame.on('pointerdown', () => {
          this.equipped[slot] = undefined;
          this.saveAndRefresh();
        });
      } else {
        const empty = this.add.text(x + slotWidth / 2, y + 40, '空', {
          fontSize: '18px', color: '#374151',
        }).setOrigin(0.5);
        this.slotsContainer.add(empty);
      }
    });
  }

  // ── Stats Overview (top-right) ──
  private renderStats(): void {
    this.statsContainer.removeAll(true);
    const cam = this.cameras.main;
    const x = cam.width * 0.81;  // ~220px from right at 1152
    const y = cam.height * 0.07; // ~55px at 768

    const title = this.add.text(x, y, '属性总览', {
      fontSize: '14px', color: '#c4b5fd', fontStyle: 'bold',
    });
    this.statsContainer.add(title);

    const totals = calculateTotalStats(this.equipped, this.inventory);
    const labels: { key: EquipStat; label: string; color: string }[] = [
      { key: 'hp', label: 'HP', color: '#22c55e' },
      { key: 'attack', label: '攻击', color: '#ef4444' },
      { key: 'defense', label: '防御', color: '#3b82f6' },
      { key: 'speed', label: '速度', color: '#fbbf24' },
      { key: 'energy', label: '能量', color: '#a78bfa' },
      { key: 'block', label: '格挡', color: '#60a5fa' },
    ];

    labels.forEach((stat, i) => {
      const sy = y + 24 + i * 20;
      const value = totals[stat.key];
      if (value > 0) {
        const text = this.add.text(x, sy, `${stat.label}: +${value}`, {
          fontSize: '12px', color: stat.color,
        });
        this.statsContainer.add(text);
      }
    });
  }

  // ── Set Bonuses (top-center) ──
  private renderSetBonuses(): void {
    this.setContainer.removeAll(true);
    const activeSets = getActiveSets(this.equipped, this.inventory);
    if (activeSets.length === 0) return;

    const cam = this.cameras.main;
    const x = cam.width / 2 - 100;
    const y = 120;

    let currentY = y;
    activeSets.forEach(({ set, equipped: count }) => {
      const text = this.add.text(x, currentY, `${set.name} (${count}/${set.pieces.length})`, {
        fontSize: '12px', color: '#fbbf24', fontStyle: 'bold',
      });
      this.setContainer.add(text);
      currentY += 18;
    });
  }

  // ── Bag Grid (bottom) ──
  private renderBag(): void {
    this.bagContainer.removeAll(true);
    const cam = this.cameras.main;

    // Filter buttons
    const filterY = cam.height * 0.195;  // ~150px at 768
    const filters: { label: string; value: 'all' | EquipSlot }[] = [
      { label: '全部', value: 'all' },
      { label: '武器', value: 'weapon' },
      { label: '护甲', value: 'armor' },
      { label: '饰品', value: 'accessory' },
    ];

    filters.forEach((f, i) => {
      const fx = cam.width * 0.026 + i * cam.width * 0.056;
      const isActive = this.filterSlot === f.value;
      const btn = this.add.text(fx, filterY, f.label, {
        fontSize: '12px', color: isActive ? '#fbbf24' : '#64748b',
        backgroundColor: isActive ? '#78350f' : '#1e293b',
        padding: { x: 8, y: 4 },
      }).setInteractive({ useHandCursor: true });
      this.bagContainer.add(btn);
      btn.on('pointerdown', () => {
        this.filterSlot = f.value;
        this.renderBag();
        this.renderDetail();
      });
    });

    // Filter inventory
    const equippedUids = new Set([this.equipped.weapon, this.equipped.armor, this.equipped.accessory].filter(Boolean));
    let items = this.inventory.filter((it) => !equippedUids.has(it.uid));
    if (this.filterSlot !== 'all') {
      items = items.filter((it) => EQUIPMENT_DB[it.id]?.slot === this.filterSlot);
    }

    // Grid layout
    const cols = 6;
    const cardW = Math.min(115, cam.width * 0.1);
    const cardH = Math.min(135, cam.height * 0.175);
    const gap = cam.width * 0.007;
    const startX = cam.width * 0.026;
    const startY = cam.height * 0.23;

    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * (cardW + gap) + cardW / 2;
      const cy = startY + row * (cardH + gap) + cardH / 2;

      const card = new EquipmentCard(this, cx, cy, item);
      card.setSelected(item.uid === this.selectedUid);
      card.on('selected', (selectedItem: InventoryItem) => {
        this.selectedUid = selectedItem.uid;
        this.renderBag();
        this.renderDetail();
      });
      this.bagContainer.add(card);
    });

    // Empty message
    if (items.length === 0) {
      const emptyText = this.add.text(cam.width / 2 - 80, cam.height * 0.34, '背包中没有此类型装备', {
        fontSize: '14px', color: '#4b5563',
      });
      this.bagContainer.add(emptyText);
    }
  }

  // ── Detail Panel (right side) ──
  private renderDetail(): void {
    this.detailContainer.removeAll(true);
    const cam = this.cameras.main;
    const x = cam.width * 0.81;
    const y = cam.height * 0.195;

    if (!this.selectedUid) {
      const hint = this.add.text(x, y + 60, '点击装备查看详情', {
        fontSize: '13px', color: '#4b5563',
      });
      this.detailContainer.add(hint);
      return;
    }

    const item = this.inventory.find((it) => it.uid === this.selectedUid);
    if (!item) return;
    const def = EQUIPMENT_DB[item.id];
    if (!def) return;
    const rarityColor = RARITY_COLORS[def.rarity];

    // Detail frame
    const frame = this.add.rectangle(x + 95, y + 120, 200, 240, 0x0f172a, 0.95);
    frame.setStrokeStyle(2, rarityColor.phaser, 0.6);
    this.detailContainer.add(frame);

    let cy = y + 8;

    // Icon + Name
    this.addDetailText(x, cy, `${def.icon} ${def.name}`, {
      fontSize: '16px', color: rarityColor.hex, fontStyle: 'bold',
    });
    cy += 24;

    // Rarity + Slot
    const rarityNames: Record<string, string> = { common: '普通', uncommon: '精良', rare: '稀有', legendary: '传说' };
    this.addDetailText(x, cy, `${rarityNames[def.rarity]} · ${SLOT_NAMES[def.slot]}`, {
      fontSize: '12px', color: '#94a3b8',
    });
    cy += 22;

    // Level
    this.addDetailText(x, cy, `强化等级: +${item.level}`, {
      fontSize: '12px', color: '#fbbf24',
    });
    cy += 22;

    // Effects
    const effects = getEffectiveEffects(item);
    effects.forEach((effect) => {
      const sign = effect.value > 0 ? '+' : '';
      const suffix = effect.type === 'percent' ? '%' : '';
      this.addDetailText(x, cy, `${effect.stat}: ${sign}${effect.value}${suffix}`, {
        fontSize: '12px', color: '#22c55e',
      });
      cy += 18;
    });
    cy += 8;

    // Set info
    if (def.setId) {
      const set = SET_DB[def.setId];
      if (set) {
        this.addDetailText(x, cy, `套装: ${set.name}`, {
          fontSize: '11px', color: '#fbbf24',
        });
        cy += 16;
        set.bonuses.forEach((bonus) => {
          this.addDetailText(x, cy, bonus.desc, {
            fontSize: '10px', color: '#94a3b8',
          });
          cy += 14;
        });
      }
    }
    cy += 8;

    // Description
    this.addDetailText(x, cy, def.description, {
      fontSize: '11px', color: '#6b7280',
      wordWrap: { width: 180 }, lineSpacing: 2,
    });

    // Action buttons at bottom of detail
    const btnY = y + 230;
    const equippedUids = new Set([this.equipped.weapon, this.equipped.armor, this.equipped.accessory].filter(Boolean));
    const isEquipped = equippedUids.has(this.selectedUid);

    if (isEquipped) {
      this.createSmallButton(x + 45, btnY, 80, 28, '卸下', 0x334155, () => {
        for (const slot of ['weapon', 'armor', 'accessory'] as EquipSlot[]) {
          if (this.equipped[slot] === this.selectedUid) {
            this.equipped[slot] = undefined;
            break;
          }
        }
        this.selectedUid = null;
        this.saveAndRefresh();
      });
    } else {
      // Equip button
      this.createSmallButton(x + 45, btnY, 80, 28, '装备', 0x4338ca, () => {
        this.equipped[def.slot] = this.selectedUid!;
        this.saveAndRefresh();
      });

      // Enhance button
      const cost = getEnhanceCost(item.level);
      const rate = getEnhanceSuccessRate(item.level);
      const canEnhance = item.level < 10 && this.gold >= cost;
      this.createSmallButton(x + 135, btnY, 80, 28, `强化(${cost})`, canEnhance ? 0x78350f : 0x1e293b, () => {
        if (!canEnhance) return;
        this.enhanceItem(item);
      });

      // Dismantle button
      const dismantleGold = 20 + item.level * 10;
      this.createSmallButton(x + 90, btnY + 34, 80, 28, `分解(+${dismantleGold})`, 0x7f1d1d, () => {
        this.dismantleItem(item, dismantleGold);
      });

      // Success rate display
      if (item.level < 10) {
        this.addDetailText(x + 135, btnY - 16, `成功率: ${Math.round(rate * 100)}%`, {
          fontSize: '10px', color: rate < 1 ? '#fca5a5' : '#86efac',
        });
      }
    }
  }

  private enhanceItem(item: InventoryItem): void {
    const cost = getEnhanceCost(item.level);
    const rate = getEnhanceSuccessRate(item.level);
    if (this.gold < cost || item.level >= 10) return;

    this.gold -= cost;
    const success = Math.random() < rate;
    if (success) {
      item.level++;
      sfx.playEnhanceSuccess();
    } else if (item.level >= 5) {
      item.level = Math.max(0, item.level - 1);
      sfx.playEnhanceFail();
    } else {
      sfx.playEnhanceFail();
    }
    this.saveAndRefresh();
  }

  private dismantleItem(item: InventoryItem, gold: number): void {
    // Unequip if equipped
    for (const slot of ['weapon', 'armor', 'accessory'] as EquipSlot[]) {
      if (this.equipped[slot] === item.uid) {
        this.equipped[slot] = undefined;
      }
    }
    // Remove from inventory
    this.inventory = this.inventory.filter((it) => it.uid !== item.uid);
    this.gold += gold;
    this.selectedUid = null;
    this.saveAndRefresh();
  }

  private addDetailText(x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle): Phaser.GameObjects.Text {
    const t = this.add.text(x, y, text, { fontFamily: '"Noto Serif SC", serif', ...style });
    this.detailContainer.add(t);
    return t;
  }

  private createSmallButton(
    x: number, y: number, width: number, height: number,
    label: string, color: number, action: () => void,
  ): void {
    const bg = this.add.rectangle(x, y, width, height, color)
      .setStrokeStyle(1, 0x818cf8, 0.6)
      .setInteractive({ useHandCursor: true });
    this.detailContainer.add(bg);
    const text = this.add.text(x, y, label, {
      fontSize: '11px', fontFamily: '"Noto Serif SC", serif',
      color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.detailContainer.add(text);
    bg.on('pointerover', () => bg.setFillStyle(0x6366f1));
    bg.on('pointerout', () => bg.setFillStyle(color));
    bg.on('pointerdown', action);
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

  private saveAndRefresh(): void {
    saveEquipment(this.inventory, this.equipped);
    saveGold(this.gold);
    this.scene.restart();
  }

  private goBack(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => this.scene.start('TitleScreen'));
  }
}
