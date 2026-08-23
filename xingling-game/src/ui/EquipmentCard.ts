import Phaser from 'phaser';
import { EQUIPMENT_DB, RARITY_COLORS, SLOT_NAMES, getEffectiveEffects, type InventoryItem, type EquipSlot } from '../data/EquipmentDatabase';

/**
 * Equipment card UI — rendered in the equipment scene.
 * Supports click-to-equip interaction.
 */
export class EquipmentCard extends Phaser.GameObjects.Container {
  private item: InventoryItem;
  private bg!: Phaser.GameObjects.Rectangle;
  private isSelected: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, item: InventoryItem) {
    super(scene, x, y);
    this.item = item;
    scene.add.existing(this);
    this.setDepth(100);
    this.createCard();
  }

  private createCard(): void {
    const def = EQUIPMENT_DB[this.item.id];
    if (!def) return;

    const width = 110;
    const height = 130;
    const rarityColor = RARITY_COLORS[def.rarity];

    // Background
    this.bg = this.scene.add.rectangle(0, 0, width, height, 0x0f172a, 0.95);
    this.bg.setStrokeStyle(2, rarityColor.phaser, 0.8);
    this.add(this.bg);

    // Icon
    const iconText = this.scene.add.text(0, -30, def.icon, {
      fontSize: '32px', color: '#ffffff', stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5);
    this.add(iconText);

    // Name
    const nameText = this.scene.add.text(0, 4, def.name, {
      fontSize: '12px', fontFamily: '"Noto Serif SC", serif',
      color: rarityColor.hex, fontStyle: 'bold',
    }).setOrigin(0.5);
    this.add(nameText);

    // Slot
    const slotText = this.scene.add.text(0, 20, SLOT_NAMES[def.slot], {
      fontSize: '10px', color: '#64748b',
    }).setOrigin(0.5);
    this.add(slotText);

    // Level
    if (this.item.level > 0) {
      const levelText = this.scene.add.text(width / 2 - 6, -height / 2 + 6, `+${this.item.level}`, {
        fontSize: '12px', color: '#fbbf24', fontStyle: 'bold',
      }).setOrigin(1, 0);
      this.add(levelText);
    }

    // Effects summary (compact)
    const effects = getEffectiveEffects(this.item);
    const effectStr = effects.map((e) => {
      const sign = e.value > 0 ? '+' : '';
      return e.type === 'flat' ? `${sign}${e.value}` : `${sign}${e.value}%`;
    }).join(' ');
    const effectText = this.scene.add.text(0, 38, effectStr, {
      fontSize: '10px', color: '#94a3b8',
    }).setOrigin(0.5);
    this.add(effectText);

    // Set indicator
    if (def.setId) {
      const setDot = this.scene.add.circle(-width / 2 + 10, -height / 2 + 10, 4, 0xfbbf24, 0.7);
      this.add(setDot);
    }

    // Click interaction
    this.bg.setInteractive({ useHandCursor: true });
    this.bg.on('pointerover', () => {
      if (!this.isSelected) this.bg.setFillStyle(0x1e293b, 1);
    });
    this.bg.on('pointerout', () => {
      if (!this.isSelected) this.bg.setFillStyle(0x0f172a, 0.95);
    });
    this.bg.on('pointerdown', () => {
      this.emit('selected', this.item);
    });
  }

  setSelected(selected: boolean): void {
    this.isSelected = selected;
    const def = EQUIPMENT_DB[this.item.id];
    if (!def) return;
    const rarityColor = RARITY_COLORS[def.rarity];
    if (selected) {
      this.bg.setFillStyle(0x1e3a5f, 1);
      this.bg.setStrokeStyle(3, rarityColor.phaser, 1);
    } else {
      this.bg.setFillStyle(0x0f172a, 0.95);
      this.bg.setStrokeStyle(2, rarityColor.phaser, 0.8);
    }
  }

  getItem(): InventoryItem {
    return this.item;
  }
}
