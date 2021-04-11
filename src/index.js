import Phaser from "phaser";

import PlayScene from './scenes/PlayScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

const config = {
  // WebGL (Web graphics library) JS Api for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
    // Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: [new PlayScene(SHARED_CONFIG)]
};

new Phaser.Game(config);

let bird = null;
let pipes = null;
let pipeHorizontalDistance = 0;
let pipeVerticalDistanceRange  = [150, 250];
let pipeHorizontalDistanceRange  = [400, 500];

const initialBirdPosition = {
  x: config.width * 0.1,
  y: config.height / 2,
};
const flapVelocity = 250;
// Loading assets such as images, music, and animations
function preload () {
  // this: context scene
  // the scene context has functions and properties we can use
  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipe', 'assets/pipe.png');
}

// Initialize instances of your objects
function create () {
  // this.add.image(config.width / 2, config.height / 2, 'sky');
  this.add.image(0, 0, 'sky').setOrigin(0);

  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird');
  bird.body.gravity.y = 400;
  pipes = this.physics.add.group();

  for(let i = 0; i < PIPES_TO_RENDER; i++) {
    const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
    const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  pipes.setVelocityX(-200);

  this.input.on('pointerdown', flap);
  this.input.keyboard.on('keydown-SPACE', flap);
}

// 60 fps
// 60 times per second
// 60 * 16 ms = 1000ms
function update(time, delta) {
  if (bird.y > config.height || bird.y < -bird.height) {
    console.log('you have lost')
  }

  recyclePipes();
}


function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostPipe();
  let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(20, config.height - 20 - pipeVerticalDistance);
  let pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;

  uPipe.body.velocity.x = -200;
  lPipe.body.velocity.x = -200;
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if (pipe.getBounds().right <= 0) {
      tempPipes.push(pipe);

      if (tempPipes.length === 2) {
        placePipe(...tempPipes)
      }
    }
  })
}

function getRightMostPipe() {
  let rightMostX = 0;

  pipes.getChildren().forEach((pipe) => {
    rightMostX = Math.max(pipe.x, rightMostX);
  });

  return rightMostX;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

function flap() {
  bird.body.velocity.y = -flapVelocity
}

