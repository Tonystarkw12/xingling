export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload(): void {
    const cam = this.cameras.main;
    const width = cam.width;
    const height = cam.height;
    const barWidth = Math.floor(width * 0.6);
    const barHeight = 20;
    const x = Math.floor((width - barWidth) / 2);
    const y = Math.floor(height * 0.5);

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x1e1b4b, 0.8);
    progressBox.fillRect(x - 4, y - 4, barWidth + 8, barHeight + 8);

    const progressBar = this.add.graphics();

    const loadingText = this.add.text(width / 2, y - 30, '载入星灵世界...', {
      fontSize: '24px',
      fontFamily: '"Noto Serif SC", "Source Han Serif CN", STSong, serif',
      color: '#c4b5fd',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0.5);

    const statusText = this.add.text(width / 2, y + 40, '', {
      fontSize: '14px',
      color: '#94a3b8',
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x6366f1, 1);
      progressBar.fillRect(x, y, barWidth * value, barHeight);
    });

    this.load.on('fileprogress', (file: any) => {
      statusText.setText(`正在加载: ${file.key}`);
    });

    this.load.on('loaderror', (file: any) => {
      console.error(`Failed to load: ${file.key} from ${file.url}`);
      statusText.setText(`加载失败: ${file.key}`);
      statusText.setColor('#ef4444');
    });

    // Load all assets directly
    // Characters (background removed)
    this.load.image('char_ampere', 'assets/characters/ampere_nobg.png');
    this.load.image('char_iris', 'assets/characters/iris_nobg.png');
    this.load.image('char_peter', 'assets/characters/peter_nobg.png');

    // Scene backgrounds
    this.load.image('bg_nock_city', 'assets/scenes/nock_city.png');

    // Storyboard backgrounds
    for (let i = 1; i <= 14; i++) {
      const num = String(i).padStart(2, '0');
      this.load.image(`bg_story${num}`, `assets/storyboards/scene_E01S${num}.png`);
    }

    // Props
    this.load.image('prop_star_key', 'assets/props/star_key_dawn.png');

    // Audio
    this.load.audio('bgm_episode1', 'assets/audio/bgm_episode1.mp3');
    this.load.audio('bgm_acestep', 'assets/audio/bgm_acestep.mp3');

    // Voice lines
    const voiceFiles = [
      'E01S01_silent', 'E01S02_00', 'E01S02_01', 'E01S02_02',
      'E01S03_silent', 'E01S04_03', 'E01S04_04', 'E01S04_05', 'E01S04_06', 'E01S04_07',
      'E01S05_08', 'E01S05_09', 'E01S06_10', 'E01S06_11', 'E01S06_12',
      'E01S07_13', 'E01S07_14', 'E01S07_15', 'E01S08_16', 'E01S08_17', 'E01S08_18',
      'E01S09_19', 'E01S09_20', 'E01S09_21', 'E01S10_silent',
      'E01S11_22', 'E01S11_23', 'E01S11_24', 'E01S12_25', 'E01S12_26',
      'E01S13_27', 'E01S14_28', 'E01S14_29', 'E01S14_30', 'E01S14_31',
    ];
    voiceFiles.forEach(name => {
      this.load.audio(`voice_${name}`, `assets/audio/voice_${name}.wav`);
    });

    this.load.once('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      statusText.destroy();
    });
  }

  create(): void {
    this.scene.start('TitleScreen');
  }
}
