import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import AdventureState from './states/Adventure'

class Game extends Phaser.Game {
  constructor() {
    let gameHeight = window.innerHeight * window.devicePixelRatio;
    let gameWidth = window.innerWidth * window.devicePixelRatio;
    let ratio = gameHeight / gameWidth;

    console.info("game ratio before: " + gameHeight / gameWidth);
    if (ratio > 0.75) {
      gameHeight = gameWidth * 0.75;
    } else if (ratio < 0.55) {
      gameWidth = gameHeight / 0.55;
    }
    console.info("game ratio before: " + gameHeight / gameWidth);

    super(gameWidth, gameHeight, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('Adventure', AdventureState, false)

    this.state.start('Game')
  }
}

window.game = new Game()
