import * as Util from './util';
import * as SitebreakerMath from './math';
import * as Events from './events';
import * as Blocks from './blocks';

let StateMachine = require('./../../../node_modules/javascript-state-machine/state-machine.min'),
    MainLoop = require('./../../../node_modules/mainloop.js/build/mainloop.min'),
    Ball = require('./ball'),
    Player = require('./player'),
    UI = require('./ui');

export default class Game {
  constructor () {
    this.config = {
      ballsRemaining: 3,
      fireWait: 1000
    };

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
    this.score = 0;
    this.balls = [];
    this.ballsRemaining = this.config.ballsRemaining;
    this.lastFire = new Date().getTime();
    this.fireWait = this.config.fireWait;

    //do this before adding any elements so we don't have to worry about them getting tagged as blocks
    this.blockList = this.blocks.findBlocks();

    this.setupStage();
    this.setupCanvas();
    this.setupBounds();

    this.ui = new UI(this);

    this.setupStateMachine();
    // this.loop();

    this.player = new Player(this);
  }

  setupStage() {
    let stage = document.createElement('div');

    stage.classList.add('sitebreaker-stage');
    stage.width = this.width;
    stage.height = this.height;
    this.stage = stage;
    document.body.appendChild(this.stage);
  }

  setupCanvas() {
    let canvas = document.createElement('canvas');
    canvas.classList.add('sitebreaker-canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.stage.appendChild(canvas);

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
      initial: 'intro',
      events: [
        { name: 'start', from: 'intro', to: 'game' },
        { name: 'play', from: 'dialog', to: 'game' },
        { name: 'lose', from: 'game', to: 'dialog' },
        { name: 'win', from: 'game', to: 'dialog' }
      ],
      callbacks: {
        ongame: (event, from, to) => {
          this.startLoop();
        },

        onintro: () => {
          this.ui.showInstructions();
        },

        onleaveintro: () => {
          this.ui.hideInstructions();
        },

        onleavegame: (event, from, to) => {
          // MainLoop.stop();
          this.endLoop();
          if(event === 'win') {
            this.ui.showWin();
          } else {
            this.ui.showGameOver();
          }
        }
      }
    });
  }

  loop() {
    // MainLoop
    //   .setUpdate((d) => this.updateLoop(d))
    //   .setDraw(() => this.drawLoop())
    //   .setEnd(() => this.endLoop());
    this._start  = new Date().getTime();
    this.updateLoop((this._start - this.lastFrame)/1000.0); // send dt as seconds
    this._middle = new Date().getTime();
    this.drawLoop();
    this._end    = new Date().getTime();
    // this.updateStats(this._middle - this._start, this._end - this._middle);
    this.lastFrame = this._start;
  }

  startLoop() {
    // MainLoop.start();
    this.lastFrame = new Date().getTime();
    this.timer     = setInterval(this.loop.bind(this), this.interval);
  }

  updateLoop(delta) {
    // console.log('update');
    this.handleEvents();
    // console.log('update');
    this.player.update(delta);
    this.balls.forEach((b) => b.update(delta));
    this.ui.update();
  }

  drawLoop() {
    // console.log('draw');
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.draw(this.context);
    this.balls.forEach((b) => b.draw(this.context));
  }

  endLoop() {
    clearInterval(this.timer);
  }

  increaseScore(s) {
    this.score+=s;
  }

  handleEvents() {
    let keys = this.events.keysPressed();

    if(keys.SPACE && this.stateMachine.is('game')) {
      let now = new Date().getTime();

      if(this.ballsRemaining > 0 && (now - this.lastFire > this.fireWait)) {
        let ball = new Ball(this);

        this.balls.push(ball);
        ball.fire();
        this.ballsRemaining--;
        this.lastFire = now;
      }
    }
  }

  removeBall(ball) {
    let ind = this.balls.find((b) => b == ball);

    this.balls.splice(ind, 1);

    if(this.balls.length + this.ballsRemaining === 0) {
      this.stateMachine.lose();
    }
  }
}