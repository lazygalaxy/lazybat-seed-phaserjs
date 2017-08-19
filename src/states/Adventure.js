import Phaser from 'phaser'

var player;
var ball;
let sprites = [];
var cursors;

var facing = 'right';

var gameScaleRatio;
var skyHeight;

var mapCols;
var mapRows;

const sceneCols = 9;
const sceneRows = 5;

const playerCol = 2;
const playerRow = 2;

function readTextFile(game, file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        alert(allText);
      }
    }
  }
  rawFile.send(null);
}

function listener(sprite, pointer) {
  console.info(sprite.key + " " + pointer.x + " " + pointer.y);
}

function setScale(sprite, size) {
  //scale to the sprite size
  let spriteScaleRatio = size / sprite.texture.height;
  //scale to the game size
  spriteScaleRatio = spriteScaleRatio * gameScaleRatio;
  //scale to the distance away from the camera
  spriteScaleRatio = spriteScaleRatio * (sprite.body.position.y / game.height);
  //set the scale
  sprite.scale.set(spriteScaleRatio, spriteScaleRatio);
}

function addSprite(game, key, xPosi, yPosi) {
  const activeSceneHorizontal = Math.floor((mapRows - playerRow) / sceneRows) * sceneRows;
  if (yPosi >= activeSceneHorizontal) {
    //TODO: only add and return sprites that are visible to the user
    const xPerc = (xPosi / (mapCols - 1)) * (mapCols / sceneCols);
    const yPerc = Math.tanh(((yPosi - activeSceneHorizontal) / (sceneRows - 1)) * (Math.PI / 3.0));
    const sprite = game.add.sprite(game.width * xPerc, ((game.height - skyHeight) * (1.0 - yPerc)) + skyHeight, key);
    sprite.anchor.setTo(0.5, 1.0);
    return sprite;
  }
  return null;
}

function hitWorldBounds(sprite) {
  console.info(sprite.x + " " + sprite.y);
  this.state.start('Boot')
}

export default class extends Phaser.State {
  init() {}

  preload() {
    this.stage.backgroundColor = '#54fc54';

    game.load.spritesheet('player', 'assets/sprites/dude2.png', 32, 48);
    this.load.image('tree', './assets/sprites/tree.png');
    this.load.image('rock', './assets/sprites/rock.png');
    this.load.image('castle', './assets/sprites/castle2.png');
    this.load.image('ball', './assets/sprites/ball.png');

    game.load.text('forest.map', '/assets/maps/forest.map');
  }

  create() {
    //calculations
    gameScaleRatio = game.height / 10;
    skyHeight = game.height * 0.23;

    const mapCache = game.cache.getText('forest.map').trim();
    const map = mapCache.split('\n');
    mapRows = map.length;
    mapCols = map[0].trim().length;

    //game definitions
    game.world.setBounds(0, 0, game.width * (mapCols / sceneCols), game.height);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // add the sky
    let sky = game.add.graphics(0, 0);
    sky.beginFill(0x5454FC);
    sky.drawRect(0, 0, game.width * (mapCols / sceneCols), skyHeight);
    game.physics.enable(sky, Phaser.Physics.ARCADE)
    sky.body.immovable = true;
    sprites.push(sky);

    for (let y = 0; y < mapRows; y++) {
      for (let x = 0; x < mapCols; x++) {
        const item = map[y].trim()[x];
        switch (item) {
          case 'C':
            let castle = addSprite(game, 'castle', x, mapRows - y - 1);
            if (castle) {
              game.physics.enable(castle, Phaser.Physics.ARCADE);
              castle.body.setSize(6469, 860, 0, 7000);
              castle.body.immovable = true;
              setScale(castle, 30);
              sprites.push(castle);
            }
            break;
          case 'T':
            let tree = addSprite(game, 'tree', x, mapRows - y - 1);
            if (tree) {
              game.physics.enable(tree, Phaser.Physics.ARCADE);
              tree.body.setSize(181, 5, 200, 460);
              tree.body.immovable = true;
              setScale(tree, 6);
              //tree.inputEnabled = true;
              //tree.events.onInputDown.add(listener, this);
              //tree.input.pixelPerfectOver = true;
              //tree.input.useHandCursor = true;
              sprites.push(tree);
            }
            break;
          case 'R':
            let rock = addSprite(game, 'rock', x, mapRows - y - 1);
            if (rock) {
              game.physics.enable(rock, Phaser.Physics.ARCADE);
              rock.body.setSize(200, 40, 25, 115);
              rock.body.immovable = true;
              setScale(rock, 1);
              sprites.push(rock);
            }
            break;
          case 'B':
            //ball = addSprite(game, 'ball', x, mapRows - y - 1);
            if (ball) {
              game.physics.enable(ball, Phaser.Physics.ARCADE);
              sprites.push(ball);
            }
            break;
          case 'K':

            const xPosi = 500;
            const yPosi = 400;

            const skinColor = 0xFFFFFF;

            //width and heights
            const height = 170;

            const headWidth = height * 0.75;
            const torsoWidth = height * 0.4;
            const torsoHeight = height * 0.4;
            const armWidth = torsoWidth * 0.25;
            const armHeight = torsoHeight * 1.1;
            const legsHeight = height * 0.4;
            const feetHeight = height * 0.05;

            //start drawing
            let kounnas = game.add.graphics(0, 0);

            //feet
            kounnas.beginFill(0x0000000);
            kounnas.drawEllipse(xPosi - (torsoWidth / 4.0), yPosi - feetHeight, torsoWidth / 4.0, feetHeight);
            kounnas.drawEllipse(xPosi + (torsoWidth / 4.0), yPosi - feetHeight, torsoWidth / 4.0, feetHeight);

            //legs
            kounnas.beginFill(0xFFFF00);
            kounnas.drawRect(xPosi - (torsoWidth / 2.0), yPosi - feetHeight - legsHeight, torsoWidth, legsHeight);
            kounnas.beginFill(0x0000000);
            kounnas.drawRect(xPosi, yPosi - feetHeight - legsHeight / 2.0, 1, legsHeight / 2.0);

            //torso
            kounnas.beginFill(0xFF0000);
            kounnas.drawRect(xPosi - (torsoWidth / 2.0), yPosi - feetHeight - legsHeight - torsoHeight, torsoWidth, torsoHeight);

            const armXOffset = armWidth / 2.0;
            const armYOffset = 0;

            //hands
            kounnas.beginFill(skinColor);
            kounnas.drawCircle(xPosi - (torsoWidth / 2.0) - armXOffset, yPosi - feetHeight - legsHeight - torsoHeight + armHeight + armYOffset, armWidth);
            kounnas.drawCircle(xPosi + (torsoWidth / 2.0) + armXOffset, yPosi - feetHeight - legsHeight - torsoHeight + armHeight + armYOffset, armWidth);

            //arms
            kounnas.beginFill(0xFF00FF);
            kounnas.drawRect(xPosi - (torsoWidth / 2.0) - armXOffset - (armWidth / 2.0), yPosi - feetHeight - legsHeight - torsoHeight + armYOffset, armWidth, armHeight);
            kounnas.drawRect(xPosi + (torsoWidth / 2.0) + armXOffset - (armWidth / 2.0), yPosi - feetHeight - legsHeight - torsoHeight + armYOffset, armWidth, armHeight);

            const headYOffset = headWidth / 3.0;

            //head
            kounnas.beginFill(skinColor);
            kounnas.drawCircle(xPosi, yPosi - feetHeight - legsHeight - torsoHeight - headYOffset, headWidth);
            kounnas.beginFill(0x0000FF);

            const eyeWidth = headWidth / 5.0;
            const eyeXOffset = headWidth / 4.0;

            //eyes
            kounnas.drawCircle(xPosi - eyeXOffset, yPosi - feetHeight - legsHeight - torsoHeight - headYOffset, eyeWidth);
            kounnas.drawCircle(xPosi + eyeXOffset, yPosi - feetHeight - legsHeight - torsoHeight - headYOffset, eyeWidth);

            //game.physics.enable(kounnas, Phaser.Physics.ARCADE)
            //sky.body.immovable = true;
            //sprites.push(kounnas);
        }
      }
    }

    player = addSprite(game, 'player', playerCol, mapRows - playerRow - 1);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    player.body.setSize(32, 8, 0, 40);
    player.events.onInputDown.add(listener, this);

    player.body.collideWorldBounds = true;
    player.body.onWorldBounds = new Phaser.Signal();
    player.body.onWorldBounds.add(hitWorldBounds, this);

    player.animations.add('left', [
      0, 1, 2, 3
    ], 10, true);
    player.animations.add('down', [
      4, 5, 6, 7
    ], 20, true);
    player.animations.add('right', [
      8, 9, 10, 11
    ], 10, true);
    player.animations.add('up', [
      12, 13, 14, 15
    ], 10, true);
    //player.body.onCollide = new Phaser.Signal();
    //player.body.onCollide.add(hitWorldBounds, this);

    //game.world.wrap(player, 0, true);
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    cursors = game.input.keyboard.createCursorKeys();
  }

  //TODO update is executed continuously, maybe an optimization here?
  update() {
    setScale(player, 1.7);
    //setScale(ball, 1.0);
    game.world.bringToTop(player);

    for (var i = 0; i < sprites.length; i++) {
      this.physics.arcade.collide(player, sprites[i]);
      if (player.body.position.y < sprites[i].body.position.y) {
        game.world.bringToTop(sprites[i]);
      }
    }

    //ball.body.velocity.x = 0;
    //ball.body.velocity.y = 0;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    const speed = 200 * (player.body.position.y / game.height);

    if (cursors.up.isDown) {
      player.body.velocity.y = -speed;
      if (facing != 'up') {
        player.animations.play('up');
        facing = 'up';
      }
    } else if (cursors.down.isDown) {
      player.body.velocity.y = speed;
      if (facing != 'down') {
        player.animations.play('down');
        facing = 'down';
      }
    } else if (cursors.left.isDown) {
      player.body.velocity.x = -speed;
      if (facing != 'left') {
        player.animations.play('left');
        facing = 'left';
      }
    } else if (cursors.right.isDown) {
      player.body.velocity.x = speed;
      if (facing != 'right') {
        player.animations.play('right');
        facing = 'right';
      }
    } else {
      if (facing != 'idle') {
        player.animations.stop();
        if (facing == 'left') {
          player.frame = 0;
        } else if (facing == 'down') {
          player.frame = 4;
        } else if (facing == 'right') {
          player.frame = 8;
        } else if (facing == 'up') {
          player.frame = 12;
        }
        facing = 'idle';
      }
    }
    //console.info('player position: ' + player.body.x + ' ' + player.body.y);
  }

  render() {
    //game.debug.body(player);
    for (var i = 0; i < sprites.length; i++) {
      //game.debug.body(sprites[i]);
    }
  }
};;;
