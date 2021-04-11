import Phaser from 'phaser';

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
  constructor (config) {
    super('PlayScene');
    this.config = config;
    this.bird = null;
    this.pipes = null;
    this.pipeHorizontalDistance = 0;
    this.pipeVerticalDistanceRange  = [150, 250];
    this.pipeHorizontalDistanceRange  = [400, 500];
    this.flapVelocity = 250;
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }

  create() {
    this.createBackground();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.handleInputs();
  }

  update(time, delta) {
    this.checkGameStatus();
    this.recyclePipes();
  }

  checkGameStatus() {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
      this.gameOver();
    }
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createBackground() {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird');
    this.bird.body.gravity.y = 400;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for(let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe')
        .setImmovable(true)
        .setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe')
        .setImmovable(true)
        .setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown-SPACE', this.flap, this);
  }

  placePipe(uPipe, lPipe) {
    const rightMostX = this.getRightMostPipe();
    let pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);

    let pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);
    let pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;

    uPipe.body.velocity.x = -200;
    lPipe.body.velocity.x = -200;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);

        if (tempPipes.length === 2) {
         this.placePipe(...tempPipes)
        }
      }
    })
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xEE4824);
  }
}

export default PlayScene;