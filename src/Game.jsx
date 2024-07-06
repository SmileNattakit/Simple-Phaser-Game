import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene: [TitleScene, GameScene], 
      parent: gameRef.current
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} />;
};

class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  preload() {
    this.load.image('background', 'https://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    this.add.image(400, 300, 'background');

    const titleText = this.add.text(400, 200, 'My Simple Game', { 
      fontSize: '64px', 
      fill: '#ffffff' 
    }).setOrigin(0.5);

    const startButton = this.add.text(400, 300, 'Start Game', { 
      fontSize: '32px', 
      fill: '#ffffff' 
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => startButton.setStyle({ fill: '#ff0' }))
    .on('pointerout', () => startButton.setStyle({ fill: '#ffffff' }))
    .on('pointerdown', () => this.scene.start('GameScene'));
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/ball.png');
    this.load.image('obstacle', 'https://labs.phaser.io/assets/sprites/red.png');
  }

  create() {
    this.player = this.physics.add.image(400, 550, 'player');
    this.player.setCollideWorldBounds(true);

    this.obstacles = this.physics.add.group();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

    this.time.addEvent({
      delay: 1000,
      callback: this.addObstacle,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    this.physics.overlap(this.player, this.obstacles, this.gameOver, null, this);
  }

  addObstacle() {
    const x = Phaser.Math.Between(0, 800);
    const obstacle = this.obstacles.create(x, 0, 'obstacle');
    obstacle.setBounce(1);
    obstacle.setCollideWorldBounds(true);
    obstacle.setVelocity(Phaser.Math.Between(-200, 200), 20);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }

  gameOver() {
    this.physics.pause();
    this.player.setTint(0xff0000);
    this.add.text(400, 300, 'Game Over', { fontSize: '64px', fill: '#ffffff' }).setOrigin(0.5);
    
    // เพิ่มปุ่มกลับไปหน้า Title
    const restartButton = this.add.text(400, 400, 'Restart', { 
      fontSize: '32px', 
      fill: '#ffffff' 
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerover', () => restartButton.setStyle({ fill: '#ff0' }))
    .on('pointerout', () => restartButton.setStyle({ fill: '#ffffff' }))
    .on('pointerdown', () => this.scene.start('TitleScene'));
  }
}

export default Game;