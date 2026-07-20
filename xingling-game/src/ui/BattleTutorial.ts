import Phaser from 'phaser';

const STEPS = [
  { title: '蓝条与卡牌', text: '卡牌左上角是蓝耗。点击可用卡牌发动技能；灰色卡牌表示蓝量不足或技能正在冷却。', x: 250, y: 560 },
  { title: '敌方意图', text: '敌人头顶会显示下一步行动。先根据攻击或防御意图规划卡牌。', x: 760, y: 145 },
  { title: '状态切换', text: '点击左下角状态按钮切换 BSE / ALE。ALE 提高伤害并积累星化能量，但每回合失血。', x: 120, y: 590 },
  { title: '技能冷却', text: '强力技能打出后进入 CD。相同技能共享冷却，每个玩家回合减少 1。', x: 500, y: 535 },
  { title: '选择目标', text: '多单位战斗中，先点击卡牌，再点击高亮目标。击倒敌方全部单位即可获胜。', x: 760, y: 330 },
] as const;

export class BattleTutorial {
  private step = 0;
  private readonly overlay: Phaser.GameObjects.Container;
  private readonly title: Phaser.GameObjects.Text;
  private readonly body: Phaser.GameObjects.Text;
  private readonly marker: Phaser.GameObjects.Arc;
  private readonly progress: Phaser.GameObjects.Text;
  private readonly next: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, onComplete: () => void) {
    const cam = scene.cameras.main;
    const shade = scene.add.rectangle(cam.width / 2, cam.height / 2, cam.width, cam.height, 0x020617, 0.82)
      .setInteractive();
    const panel = scene.add.rectangle(cam.width / 2, cam.height / 2, 620, 230, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0x818cf8);
    this.title = scene.add.text(cam.width / 2, cam.height / 2 - 72, '', {
      fontSize: '28px', color: '#fde047', fontStyle: 'bold', fontFamily: '"Noto Serif SC", serif',
    }).setOrigin(0.5);
    this.body = scene.add.text(cam.width / 2, cam.height / 2 - 8, '', {
      fontSize: '17px', color: '#e2e8f0', align: 'center', wordWrap: { width: 540 }, lineSpacing: 7,
    }).setOrigin(0.5);
    this.progress = scene.add.text(cam.width / 2 - 250, cam.height / 2 + 82, '', { fontSize: '13px', color: '#64748b' });
    this.next = scene.add.text(cam.width / 2 + 245, cam.height / 2 + 82, '', {
      fontSize: '15px', color: '#ffffff', backgroundColor: '#4338ca', padding: { x: 16, y: 8 },
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.marker = scene.add.circle(0, 0, 36, 0xfde047, 0.08).setStrokeStyle(3, 0xfde047, 0.9);
    scene.tweens.add({ targets: this.marker, scale: 1.35, alpha: 0.35, duration: 650, yoyo: true, repeat: -1 });

    this.overlay = scene.add.container(0, 0, [shade, this.marker, panel, this.title, this.body, this.progress, this.next])
      .setDepth(2000);
    this.next.on('pointerdown', () => {
      if (this.step < STEPS.length - 1) {
        this.step++;
        this.render();
      } else {
        this.overlay.destroy(true);
        onComplete();
      }
    });
    this.render();
  }

  private render(): void {
    const current = STEPS[this.step];
    this.title.setText(current.title);
    this.body.setText(current.text);
    this.progress.setText(`${this.step + 1} / ${STEPS.length}`);
    this.next.setText(this.step === STEPS.length - 1 ? '开始战斗' : '下一步');
    this.marker.setPosition(current.x, current.y);
  }
}
