import * as Util from './util';
import * as SitebreakerMath from './math';
import * as Events from './events';
import * as Blocks from './blocks';

let StateMachine = require('./../../../node_modules/javascript-state-machine/state-machine.min'),
    MainLoop = require('./../../../node_modules/mainloop.js/build/mainloop.min'),
    Ball = require('./ball'),
    Player = require('./player');

export default class Game {
  constructor () {
    this.util = Util;
    this.math = SitebreakerMath;
    this.events = Events;
    this.blocks = Blocks;

    this.util.addStylesheet();
    this.width = this.util.getWindowWidth();
    this.height = this.util.getWindowHeight();
    this.setupCanvas();
    this.setupStateMachine();
    this.setupLoop();

    this.player = new Player(this);
    this.ball = new Ball(this);

    this.blocks.findBlocks();

    this.stateMachine.play();
  }

  setupCanvas() {
    let canvas = document.createElement('canvas');
    canvas.className = 'sitebreaker-canvas';
    canvas.width = this.width;
    canvas.height = this.height;
    document.body.appendChild(canvas);

    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
  }

  setupStateMachine() {
    this.stateMachine = StateMachine.create({
      initial: 'menu',
      events: [
        { name: 'play', from: 'menu', to: 'game' },
        { name: 'leave', from: 'game', to: 'menu' },
        { name: 'lose', from: 'game', to: 'menu' },
        { name: 'win', from: 'game', to: 'menu' }
      ],
      callbacks: {
        onmenu: function(event, from, to) {
        },

        ongame: (event, from, to) => {
          this.startLoop();
        },

        onleavegame: (event, from, to) => {
        },

        onbeforeleave: function(event, from, to) {
        }
      }
    });
  }

  setupLoop() {
    this.loop = MainLoop
      .setUpdate((d) => this.updateLoop(d))
      .setDraw((d) => this.drawLoop(d))
      .setEnd((d) => this.endLoop(d));
  }

  startLoop() {
    this.loop.start();
  }

  updateLoop(delta) {
    // console.log('update');
    this.player.update(delta);
    this.ball.update(delta);
  }

  drawLoop(delta) {
    // console.log('draw');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.context);
    this.ball.draw(this.context);
  }

  endLoop(delta) {
  }
}