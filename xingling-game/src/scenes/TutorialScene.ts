import Phaser from 'phaser';
import { markTutorialSeen } from '../data/SaveSystem';

const PAGES = [
  {
    title: '阅读剧情',
    body: '点击画面或按 Enter / 空格推进文字。\n遇到选项时，选择你的回应。',
    color: '#c4b5fd',
  },
  {
    title: '卡牌战斗',
    body: '打出卡牌消耗蓝条。攻击击破敌人，\n防御提供格挡；结束回合后敌人行动。',
    color: '#60a5fa',
  },
  {
    title: 'BSE · ALE · 星化',
    body: 'BSE 稳定，ALE 持续失血但提高伤害。\nALE 伤害充满星化槽后，可进入三回合无敌星化。\n警告：星化结束，生命归零。',
    color: '#fde047',
  },
] as const;

export class TutorialScene extends Phaser.Scene {
  private page = 0;
  private titleText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private nextText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'TutorialScene' });
  }

  create(): void {
    const cam = this.cameras.main;
    this.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x080816);
    this.add.circle(cam.width / 2, cam.height / 2 - 70, 150, 0x312e81, 0.35)
      .setStrokeStyle(2, 0x6366f1, 0.7);

    this.add.text(cam.width / 2, 70, '新手引导', {
      fontSize: '20px',
      color: '#94a3b8',
      letterSpacing: 6,
    }).setOrigin(0.5);

    this.titleText = this.add.text(cam.width / 2, cam.height / 2 - 120, '', {
      fontSize: '38px',
      fontFamily: '"Noto Serif SC", serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.bodyText = this.add.text(cam.width / 2, cam.height / 2 - 30, '', {
      fontSize: '20px',
      fontFamily: '"Noto Serif SC", serif',
      color: '#e2e8f0',
      align: 'center',
      lineSpacing: 12,
    }).setOrigin(0.5);

    this.pageText = this.add.text(cam.width / 2, cam.height - 105, '', {
      fontSize: '14px',
      color: '#64748b',
    }).setOrigin(0.5);

    this.nextText = this.add.text(cam.width / 2, cam.height - 65, '', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4338ca',
      padding: { x: 28, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.nextText.on('pointerdown', () => this.advance());
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)?.on('down', () => this.advance());
    this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)?.on('down', () => this.advance());
    this.renderPage();
  }

  private renderPage(): void {
    const current = PAGES[this.page];
    this.titleText.setText(current.title).setColor(current.color);
    this.bodyText.setText(current.body);
    this.pageText.setText(`${this.page + 1} / ${PAGES.length}`);
    this.nextText.setText(this.page === PAGES.length - 1 ? '开始第一章' : '下一页');
  }

  private advance(): void {
    if (this.page < PAGES.length - 1) {
      this.page++;
      this.renderPage();
      return;
    }

    markTutorialSeen();
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(400, () => this.scene.start('Chapter1Scene'));
  }
}
