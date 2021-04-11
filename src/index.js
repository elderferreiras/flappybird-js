import Phaser from "phaser";

import "./index.css";

import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = screen.width < 800 ? screen.width : 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

const scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => scenes.map(createScene);

const config = {
  // WebGL (Web graphics library) JS Api for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  pixelArt: true,
  physics: {
    // Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: initScenes(),
};

new Phaser.Game(config);
