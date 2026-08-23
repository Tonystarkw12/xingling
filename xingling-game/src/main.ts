import Phaser from 'phaser';
import { screenSize, renderConfig } from './gameConfig.json';
import { loadSettings, getResolutionSize } from './data/SettingsSystem';
import './styles/tailwind.css';

import { Preloader } from './scenes/Preloader';
import { TitleScreen } from './scenes/TitleScreen';
import { SettingsScene } from './scenes/SettingsScene';
import { ChapterSelectScene } from './scenes/ChapterSelectScene';
import { CharacterPanelScene } from './scenes/CharacterPanelScene';
import { EquipmentScene } from './scenes/EquipmentScene';
import { CardUpgradeScene } from './scenes/CardUpgradeScene';
import { Chapter1Scene } from './scenes/Chapter1Scene';
import { SquadBattleScene } from './scenes/SquadBattleScene';
import { ChapterCompleteScene } from './scenes/ChapterCompleteScene';
import { TutorialScene } from './scenes/TutorialScene';

// Apply saved resolution (or use default)
const settings = loadSettings();
const res = getResolutionSize(settings.resolution);

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: res.width,
  height: res.height,
  backgroundColor: '#0a0a1e',
  parent: 'game-container',
  dom: {
    createContainer: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 640, height: 426 },
    max: { width: 1920, height: 1280 },
  },
  pixelArt: renderConfig.pixelArt.value,
};

const game = new Phaser.Game(config);

// Scene order: Preloader → TitleScreen → Chapter scenes → Battle
game.scene.add('Preloader', Preloader, true);
game.scene.add('TitleScreen', TitleScreen);
game.scene.add('SettingsScene', SettingsScene);
game.scene.add('ChapterSelectScene', ChapterSelectScene);
game.scene.add('CharacterPanelScene', CharacterPanelScene);
game.scene.add('EquipmentScene', EquipmentScene);
game.scene.add('CardUpgradeScene', CardUpgradeScene);
game.scene.add('TutorialScene', TutorialScene);
game.scene.add('Chapter1Scene', Chapter1Scene);
game.scene.add('BattleScene', SquadBattleScene);
game.scene.add('ChapterCompleteScene', ChapterCompleteScene);
