import Phaser from 'phaser';
import { DialogueBox, type DialogueBoxConfig } from '../ui/DialogueBox';
import { CharacterPortrait, type PortraitConfig } from '../ui/CharacterPortrait';
import { ChoicePanel, type ChoiceDisplayOption } from '../ui/ChoicePanel';
import { loadSettings, textSpeedToDelay } from '../data/SettingsSystem';

// ============================================================================
// TYPES
// ============================================================================

export interface DialogueEntry {
  type: 'text' | 'choice' | 'event' | 'character' | 'wait';
  speaker?: string;
  text?: string;
  expression?: string;
  id?: string;
  prompt?: string;
  options?: ChoiceOption[];
  action?: string;
  data?: Record<string, any>;
  characterId?: string;
  position?: 'left' | 'center' | 'right';
  duration?: number;
  voiceKey?: string; // Audio key for voice line
}

export interface ChoiceOption {
  text: string;
  next?: string;
  effects?: Record<string, number>;
}

export interface CharacterConfig {
  id: string;
  textureKey: string;
  displayName: string;
  color?: number;
  defaultPosition?: 'left' | 'center' | 'right';
}

// ============================================================================
// BASE CHAPTER SCENE
// ============================================================================

export abstract class BaseChapterScene extends Phaser.Scene {
  protected dialogues: DialogueEntry[] = [];
  protected currentDialogueIndex: number = 0;
  protected isDialoguePlaying: boolean = false;
  protected isWaitingForInput: boolean = false;
  protected isChoiceActive: boolean = false;
  private isAutoAdvancing: boolean = false;

  // Fast-forward & skip
  private isFastForward: boolean = false;
  private ffAutoTimer?: Phaser.Time.TimerEvent;
  private ffIndicator?: Phaser.GameObjects.Text;
  private ffButton?: Phaser.GameObjects.Text;
  private skipIndicator?: Phaser.GameObjects.Text;

  protected characters: Map<string, CharacterConfig> = new Map();
  protected activeCharacters: Map<string, CharacterPortrait> = new Map();

  protected dialogueBox?: DialogueBox;
  protected choicePanel?: ChoicePanel;

  create(): void {
    this.dialogues = [];
    this.currentDialogueIndex = 0;
    this.isDialoguePlaying = false;
    this.isWaitingForInput = false;
    this.isChoiceActive = false;
    this.isAutoAdvancing = false;
    this.activeCharacters.clear();
    this.characters.clear();
    this.dialogueBox = undefined;
    this.choicePanel = undefined;

    this.createBackground();
    this.createCharacters();
    this.createDialogueUI();
    this.createUI();
    this.setupDefaultInputs();
    this.setupInputs();
    this.setupFastForwardAndSkip();
    this.initializeScene();

    this.dialogues = this.initializeDialogues();
    this.startDialogue();
  }

  protected abstract initializeDialogues(): DialogueEntry[];

  protected createBackground(): void {}
  protected createCharacters(): void {}
  protected createUI(): void {}
  protected setupInputs(): void {}
  protected initializeScene(): void {}
  protected onDialogueEvent(action: string, data?: Record<string, any>): void {}
  protected onChoiceMade(choiceId: string, option: ChoiceOption): void {}
  protected onCharacterEnter(characterId: string, position?: string): void {}
  protected onCharacterExit(characterId: string): void {}
  protected onChapterComplete(): void {}

  protected registerCharacter(config: CharacterConfig): void {
    this.characters.set(config.id, config);
  }

  protected createDialogueUI(): void {
    const cam = this.cameras.main;
    const boxConfig = this.getDialogueBoxConfig();

    this.dialogueBox = new DialogueBox(this, boxConfig);
    this.dialogueBox.setBoxVisible(false);

    this.dialogueBox.on('advance', () => {
      this.advanceDialogue();
    });

    this.choicePanel = new ChoicePanel(this, cam.width / 2, cam.height / 2 - 30);
    this.choicePanel.setVisible(false);

    this.choicePanel.on('selected', (index: number) => {
      this.resolveChoice(index);
    });
  }

  protected getDialogueBoxConfig(): DialogueBoxConfig {
    const cam = this.cameras.main;
    const settings = loadSettings();
    return {
      x: cam.width / 2,
      y: cam.height - 100,
      width: Math.min(950, cam.width - 40),
      height: 170,
      backgroundColor: 0x0a0a2e,
      backgroundAlpha: 0.92,
      typeSpeed: textSpeedToDelay(settings.textSpeed),
      padding: 20,
    };
  }

  protected setupDefaultInputs(): void {
    this.input.on('pointerdown', () => {
      if (this.isChoiceActive) return;
      if (this.isFastForward) return; // Don't advance on click during FF
      if (this.isWaitingForInput) {
        this.handleDialogueInput();
      }
    });

    const enterKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    enterKey?.on('down', () => {
      if (this.isChoiceActive) return;
      if (this.isWaitingForInput) this.handleDialogueInput();
    });

    spaceKey?.on('down', () => {
      if (this.isChoiceActive) return;
      if (this.isWaitingForInput) this.handleDialogueInput();
    });
  }

  /**
   * Fast-forward: Ctrl (hold) or F (toggle) — auto-advance at 2x speed.
   * Skip: S key — jump to next choice point or chapter end.
   */
  private setupFastForwardAndSkip(): void {
    const cam = this.cameras.main;

    // ── Visible buttons (top-right) ──
    const btnY = 22;
    const btnH = 30;
    const btnW = 80;
    const gap = 8;
    const rightEdge = cam.width - 16;

    // Skip button
    const skipBtn = this.add.text(rightEdge - btnW, btnY, '跳过 S', {
      fontSize: '13px', fontFamily: '"Noto Serif SC", serif',
      color: '#f87171', fontStyle: 'bold',
      backgroundColor: '#7f1d1d', padding: { x: 10, y: 6 },
    }).setOrigin(0, 0).setDepth(500).setInteractive({ useHandCursor: true });
    skipBtn.on('pointerdown', () => {
      if (!this.isChoiceActive) this.skipToNextChoice();
    });

    // Fast-forward button (toggle)
    this.ffButton = this.add.text(rightEdge - btnW * 2 - gap, btnY, '快进 F', {
      fontSize: '13px', fontFamily: '"Noto Serif SC", serif',
      color: '#fbbf24', fontStyle: 'bold',
      backgroundColor: '#78350f', padding: { x: 10, y: 6 },
    }).setOrigin(0, 0).setDepth(500).setInteractive({ useHandCursor: true });
    this.ffButton.on('pointerdown', () => {
      if (this.isChoiceActive) return;
      if (this.isFastForward) {
        this._ffToggled = false;
        this.stopFastForward();
      } else {
        this._ffToggled = true;
        this.startFastForward();
      }
    });

    // Status indicator (shows when active)
    this.ffIndicator = this.add.text(rightEdge, btnY + btnH + 6, '▶▶ 快进中', {
      fontSize: '14px', fontFamily: '"Noto Serif SC", serif',
      color: '#fbbf24', fontStyle: 'bold',
      backgroundColor: '#78350f', padding: { x: 8, y: 4 },
    }).setOrigin(1, 0).setDepth(500).setVisible(false);

    this.skipIndicator = this.add.text(rightEdge, btnY + btnH + 6, '⏩ 跳过中...', {
      fontSize: '14px', fontFamily: '"Noto Serif SC", serif',
      color: '#f87171', fontStyle: 'bold',
      backgroundColor: '#7f1d1d', padding: { x: 8, y: 4 },
    }).setOrigin(1, 0).setDepth(500).setVisible(false);

    // ── Keyboard shortcuts ──
    // Ctrl — hold for fast-forward
    const ctrlKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
    ctrlKey?.on('down', () => { if (!this.isFastForward) this.startFastForward(); });
    ctrlKey?.on('up', () => { if (this.isFastForward && !this._ffToggled) this.stopFastForward(); });

    // F — toggle fast-forward
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F)?.on('down', () => {
      if (this.isChoiceActive) return;
      if (this.isFastForward) { this._ffToggled = false; this.stopFastForward(); }
      else { this._ffToggled = true; this.startFastForward(); }
    });

    // S — skip to next choice
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S)?.on('down', () => {
      if (!this.isChoiceActive) this.skipToNextChoice();
    });
  }

  private _ffToggled: boolean = false;

  private startFastForward(): void {
    if (this.isFastForward || this.isChoiceActive) return;
    this.isFastForward = true;
    this.ffIndicator?.setVisible(true);
    this.ffButton?.setBackgroundColor('#b45309').setText('停止 F');

    // Double the typewriter speed
    if (this.dialogueBox) {
      const settings = loadSettings();
      const baseSpeed = textSpeedToDelay(settings.textSpeed);
      this.dialogueBox.setTypeSpeed(Math.max(8, Math.floor(baseSpeed / 2)));
    }

    // Auto-advance after short delay
    this.scheduleFFAdvance();
  }

  private stopFastForward(): void {
    this.isFastForward = false;
    this._ffToggled = false;
    this.ffIndicator?.setVisible(false);
    this.ffButton?.setBackgroundColor('#78350f').setText('快进 F');
    this.ffAutoTimer?.destroy();
    this.ffAutoTimer = undefined;

    // Restore normal typewriter speed
    if (this.dialogueBox) {
      const settings = loadSettings();
      this.dialogueBox.setTypeSpeed(textSpeedToDelay(settings.textSpeed));
    }
  }

  private scheduleFFAdvance(): void {
    this.ffAutoTimer?.destroy();
    if (!this.isFastForward || this.isChoiceActive) return;

    this.ffAutoTimer = this.time.delayedCall(400, () => {
      if (!this.isFastForward || this.isChoiceActive) return;

      if (this.isWaitingForInput) {
        // Complete typewriter first if still typing
        if (this.dialogueBox?.getIsTyping()) {
          this.dialogueBox.completeTypewriter();
          // Then advance after a short pause
          this.time.delayedCall(150, () => {
            if (this.isFastForward && this.isWaitingForInput) {
              this.advanceDialogue();
            }
            this.scheduleFFAdvance();
          });
        } else {
          this.advanceDialogue();
          this.scheduleFFAdvance();
        }
      } else if (this.isAutoAdvancing) {
        // Wait for auto-advance to finish
        this.scheduleFFAdvance();
      }
    });
  }

  /**
   * Skip to next choice entry or end of chapter.
   * Plays a brief "skipping" animation.
   */
  private skipToNextChoice(): void {
    if (this.isChoiceActive || !this.isDialoguePlaying) return;

    this.skipIndicator?.setVisible(true);

    // Stop fast-forward if active
    if (this.isFastForward) this.stopFastForward();

    // Find next choice or end
    let targetIndex = this.currentDialogueIndex + 1;
    while (targetIndex < this.dialogues.length) {
      const entry = this.dialogues[targetIndex];
      if (entry.type === 'choice') break;
      targetIndex++;
    }

    // Skip animations
    this.isAutoAdvancing = false;
    this.isWaitingForInput = false;
    this.ffAutoTimer?.destroy();

    // Process character enter/exit events along the way (so characters appear correctly)
    for (let i = this.currentDialogueIndex; i < targetIndex; i++) {
      const entry = this.dialogues[i];
      if (entry.type === 'character') {
        const charId = entry.characterId ?? '';
        const charConfig = this.characters.get(charId);
        if (entry.action === 'enter' && charConfig) {
          const position = entry.position ?? charConfig.defaultPosition ?? 'center';
          this.handleCharacterEnter(charId, charConfig, position);
        } else if (entry.action === 'exit') {
          this.handleCharacterExit(charId);
        }
      } else if (entry.type === 'event') {
        this.onDialogueEvent(entry.action ?? '', entry.data);
      }
    }

    this.currentDialogueIndex = targetIndex;

    // Brief delay for visual feedback
    this.time.delayedCall(300, () => {
      this.skipIndicator?.setVisible(false);
      if (this.currentDialogueIndex >= this.dialogues.length) {
        this.isDialoguePlaying = false;
        if (this.dialogueBox) this.dialogueBox.setBoxVisible(false);
        this.onChapterComplete();
      } else {
        this.processCurrentEntry();
      }
    });
  }

  protected handleDialogueInput(): void {
    if (this.dialogueBox) this.dialogueBox.handleInput();
  }

  protected showDialogueText(speaker: string, text: string, expression?: string, voiceKey?: string): void {
    this.activeCharacters.forEach((portrait, id) => {
      portrait.setSpeakerActive(id === speaker);
    });

    let speakerName = speaker;
    const charConfig = this.characters.get(speaker);
    if (charConfig) speakerName = charConfig.displayName;

    if (this.dialogueBox) this.dialogueBox.showText(speakerName, text);

    // Play voice line if available
    if (voiceKey && this.cache.audio.exists(voiceKey)) {
      this.sound.play(voiceKey, { volume: 0.8 });
    }
  }

  protected showChoiceUI(prompt: string, options: ChoiceDisplayOption[]): void {
    if (this.dialogueBox) this.dialogueBox.setBoxVisible(false);
    if (this.choicePanel) this.choicePanel.showChoices(prompt, options);
  }

  protected handleCharacterEnter(
    characterId: string,
    config: CharacterConfig,
    position: 'left' | 'center' | 'right',
  ): void {
    if (!this.activeCharacters.has(characterId)) {
      const portrait = new CharacterPortrait(this, {
        id: config.id,
        textureKey: config.textureKey,
        displayName: config.displayName,
        color: config.color,
        position: position,
      });
      this.activeCharacters.set(characterId, portrait);
    }
    this.activeCharacters.get(characterId)!.enter();
  }

  protected handleCharacterExit(characterId: string): void {
    const portrait = this.activeCharacters.get(characterId);
    if (portrait) {
      portrait.exit(() => { this.activeCharacters.delete(characterId); });
    }
  }

  protected startDialogue(fromIndex: number = 0): void {
    if (this.dialogues.length === 0) {
      this.isDialoguePlaying = false;
      this.onChapterComplete();
      return;
    }
    this.currentDialogueIndex = fromIndex;
    this.isDialoguePlaying = true;
    this.processCurrentEntry();
  }

  protected advanceDialogue(): void {
    if (!this.isDialoguePlaying || this.isChoiceActive || this.isAutoAdvancing) return;

    this.isWaitingForInput = false;
    this.currentDialogueIndex++;
    if (this.currentDialogueIndex >= this.dialogues.length) {
      this.isDialoguePlaying = false;
      this.stopFastForward();
      if (this.dialogueBox) this.dialogueBox.setBoxVisible(false);
      this.onChapterComplete();
      return;
    }
    this.processCurrentEntry();
  }

  protected resolveChoice(optionIndex: number): void {
    if (!this.isChoiceActive) return;
    const entry = this.dialogues[this.currentDialogueIndex];
    if (!entry || entry.type !== 'choice' || !entry.options) return;

    const visibleOptions = (entry.options ?? []).filter(() => true);
    const option = visibleOptions[optionIndex];
    if (!option) return;

    if (this.choicePanel) this.choicePanel.hide();
    this.isChoiceActive = false;

    if (this.dialogueBox) this.dialogueBox.setBoxVisible(true);
    this.onChoiceMade(entry.id ?? '', option);
    this.advanceDialogue();
  }

  private processCurrentEntry(): void {
    if (this.currentDialogueIndex >= this.dialogues.length) return;

    const entry = this.dialogues[this.currentDialogueIndex];
    switch (entry.type) {
      case 'text':
        this.isWaitingForInput = true;
        this.showDialogueText(entry.speaker ?? '', entry.text ?? '', entry.expression, entry.voiceKey);
        break;

      case 'choice': {
        const options: ChoiceDisplayOption[] = (entry.options ?? []).map((opt) => ({
          text: opt.text,
          enabled: true,
        }));
        if (options.length === 0) { this.advanceDialogue(); break; }
        this.isChoiceActive = true;
        this.stopFastForward(); // Stop FF when reaching a choice
        this.showChoiceUI(entry.prompt ?? '', options);
        break;
      }

      case 'character': {
        const charId = entry.characterId ?? '';
        const charConfig = this.characters.get(charId);
        if (entry.action === 'enter' && charConfig) {
          const position = entry.position ?? charConfig.defaultPosition ?? 'center';
          this.handleCharacterEnter(charId, charConfig, position);
          this.onCharacterEnter(charId, position);
        } else if (entry.action === 'exit') {
          this.handleCharacterExit(charId);
          this.onCharacterExit(charId);
        }
        this.isAutoAdvancing = true;
        this.time.delayedCall(entry.action === 'enter' ? 300 : 50, () => {
          this.isAutoAdvancing = false;
          this.advanceDialogue();
        });
        break;
      }

      case 'event':
        this.onDialogueEvent(entry.action ?? '', entry.data);
        this.advanceDialogue();
        break;

      case 'wait':
        this.isAutoAdvancing = true;
        this.time.delayedCall(entry.duration ?? 1000, () => {
          this.isAutoAdvancing = false;
          this.advanceDialogue();
        });
        break;

      default:
        this.advanceDialogue();
        break;
    }
  }
}
