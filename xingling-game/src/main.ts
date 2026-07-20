import Phaser from 'phaser';
import { screenSize, renderConfig } from './gameConfig.json';
import './styles/tailwind.css';

import { Preloader } from './scenes/Preloader';
import { TitleScreen } from './scenes/TitleScreen';
import { Chapter1Scene } from './scenes/Chapter1Scene';
import { BattleScene } from './scenes/BattleScene';
import { ChapterCompleteScene } from './scenes/ChapterCompleteScene';
import { TutorialScene } from './scenes/TutorialScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: screenSize.width.value,
  height: screenSize.height.value,
  backgroundColor: '#0a0a1e',
  parent: 'game-container',
  dom: {
    createContainer: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: renderConfig.pixelArt.value,
};

const game = new Phaser.Game(config);

// Scene order: Preloader → TitleScreen → Chapter scenes → Battle
game.scene.add('Preloader', Preloader, true);
game.scene.add('TitleScreen', TitleScreen);
game.scene.add('TutorialScene', TutorialScene);
game.scene.add('Chapter1Scene', Chapter1Scene);
game.scene.add('BattleScene', BattleScene);
game.scene.add('ChapterCompleteScene', ChapterCompleteScene);
