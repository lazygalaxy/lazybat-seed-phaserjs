import Phaser from 'phaser'
import {centerGameObjects} from '../utils'

//seed variables
const xPosi = 500;
const yPosi = 400;
const skinColor = 0xFFFFFF;
const height = 170;

//derived widths, heights and lengths
const thighHeight = height * 0.25;
const calfHeight = height * 0.25;
const footHeight = height * 0.0625;
const footLength = height * 0.125;

const torsoHeight = height * 0.375;
const backHeight = torsoHeight * 0.30;
const upperArmHeight = torsoHeight * 0.65;
const lowerArmHeight = torsoHeight * 0.35;
const handHeight = torsoHeight * 0.30;

var body = {};

function pythagoras(x, y) {
  return Math.sqrt((x * x) + (y * y));
}

function rotate(parent, angle) {
  for (let i = 0; i < parent.child.length; i++) {
    rotateHelper(parent, parent.child[i], angle);
  }
}

function rotateHelper(parent, other, angle) {
  const distance = pythagoras(parent.point.x - other.point.x, parent.point.y - other.point.y);
  other.point.rotate(parent.point.x, parent.point.y, angle, true, distance);
  for (let i = 0; i < other.child.length; i++) {
    rotateHelper(parent, other.child[i], angle);
  }
}

function draw(game, bodyPart, color) {
  game.context.strokeStyle = color;
  game.context.beginPath();
  game.context.moveTo(bodyPart.point.x, bodyPart.point.y);
  while (bodyPart.child.length > 0) {
    bodyPart = bodyPart.child[0];
    game.context.lineTo(bodyPart.point.x, bodyPart.point.y);
  }
  game.context.stroke();
  game.context.closePath();
}

export default class extends Phaser.State {

  create() {
    //lower right limb
    body.rightFoot = {};
    body.rightFoot.point = new Phaser.Point(xPosi + footLength, yPosi - footHeight);
    body.rightFoot.child = [];

    body.rightAnkle = {};
    body.rightAnkle.point = new Phaser.Point(xPosi, yPosi - footHeight);
    body.rightAnkle.child = [body.rightFoot];

    body.rightKnee = {};
    body.rightKnee.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight);
    body.rightKnee.child = [body.rightAnkle];

    body.rightHip = {};
    body.rightHip.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight);
    body.rightHip.child = [body.rightKnee];

    //lower left limb
    body.leftFoot = {};
    body.leftFoot.point = new Phaser.Point(xPosi + footLength, yPosi - footHeight);
    body.leftFoot.child = [];

    body.leftAnkle = {};
    body.leftAnkle.point = new Phaser.Point(xPosi, yPosi - footHeight);
    body.leftAnkle.child = [body.leftFoot];

    body.leftKnee = {};
    body.leftKnee.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight);
    body.leftKnee.child = [body.leftAnkle];

    body.leftHip = {};
    body.leftHip.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight);
    body.leftHip.child = [body.leftKnee];

    //upper right limb
    body.rightHand = {};
    body.rightHand.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight + upperArmHeight + lowerArmHeight + handHeight);
    body.rightHand.child = [];

    body.rightWrist = {};
    body.rightWrist.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight + upperArmHeight + lowerArmHeight);
    body.rightWrist.child = [body.rightHand];

    body.rightElbow = {};
    body.rightElbow.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight + upperArmHeight);
    body.rightElbow.child = [body.rightWrist];

    body.rightShoulder = {};
    body.rightShoulder.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight);
    body.rightShoulder.child = [body.rightElbow];

    //upper left limb
    body.leftHand = {};
    body.leftHand.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight + upperArmHeight + lowerArmHeight + handHeight);
    body.leftHand.child = [];

    body.leftWrist = {};
    body.leftWrist.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight + upperArmHeight + lowerArmHeight);
    body.leftWrist.child = [body.leftHand];

    body.leftElbow = {};
    body.leftElbow.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight + upperArmHeight);
    body.leftElbow.child = [body.leftWrist];

    body.leftShoulder = {};
    body.leftShoulder.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - torsoHeight);
    body.leftShoulder.child = [body.leftElbow];

    body.back = {};
    body.back.point = new Phaser.Point(xPosi, yPosi - footHeight - calfHeight - thighHeight - backHeight);
    body.back.child = [body.rightShoulder, body.leftShoulder];

    rotate(body.rightHip, 30);
    rotate(body.rightKnee, 20);
    rotate(body.rightAnkle, 10);

    rotate(body.leftHip, -30);
    rotate(body.leftKnee, -20);
    rotate(body.leftAnkle, -10);

    rotate(body.rightShoulder, 30);
    rotate(body.rightElbow, 20);
    rotate(body.rightWrist, 10);

    rotate(body.leftShoulder, -30);
    rotate(body.leftElbow, -20);
    rotate(body.leftWrist, -10);
  }

  update() {

    //p3.rotate(p2.x, p2.y, d3, true, 100);
    //p4.rotate(p3.x, p3.y, d4, true, 50);

  }

  render() {
    draw(game, body.leftHip, 'rgb(0,255,0)');
    draw(game, body.rightHip, 'rgb(0,0,255)');
    draw(game, body.leftShoulder, 'rgb(255,0,0)');
    draw(game, body.rightShoulder, 'rgb(255,255,0)');
  }
}
