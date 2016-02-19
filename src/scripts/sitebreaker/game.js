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
    this.left = 0;
    this.right = this.width;
    this.top = 0;
    this.bottom = this.height;

    //do this before adding any elements so we don't have to worry about them getting tagged as blocks
    this.blockList = this.blocks.findBlocks();

    this.setupCanvas();
    this.setupBounds();
    this.setupStateMachine();
    this.setupLoop();

    this.player = new Player(this);
    this.ball = new Ball(this);

    this.stateMachine.play();
  }

  setupCanvas() {
    let canvas = document.createElement('canvas');
    canvas.classList.add('sitebreaker-canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    document.body.appendChild(canvas);

    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
  }

  setupBounds() {
    let boundSize = 10;

    this.bounds = {
      top: this.math.bound({
        x: this.left - boundSize,
        y: this.top - boundSize*2,
        w: this.width + boundSize*2,
        h: boundSize*2
      }),
      left: this.math.bound({
        x: this.left - boundSize,
        y: this.top - boundSize*2,
        w: boundSize,
        h: boundSize*2 + this.height
      }),
      right: this.math.bound({
        x: this.right,
        y: this.top - boundSize*2,
        w: boundSize,
        h: boundSize*2 + this.height
      })
    };
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