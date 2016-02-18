let Util = require("./util");
let StateMachine = require("./../../../node_modules/javascript-state-machine/state-machine.min");
let MainLoop = require("./../../../node_modules/mainloop.js/build/mainloop.min");

export default class Game {
  constructor () {
    this.util = new Util();

    this.util.addStylesheet();
    this.canvas = this.setupCanvas();
    this.width = this.util.getWindowWidth();
    this.height = this.util.getWindowHeight();
    
    this.context = this.canvas.getContext('2d');

    this.stateMachine = this.setupStateMachine();

    this.loop = this.setupLoop();

    this.startLoop();
  }

  setupCanvas() {
    let canvas = document.createElement('canvas');
    canvas.className = 'sitebreaker-canvas';
    document.body.appendChild(canvas);
    return canvas;
  }

  setupStateMachine() {
    return StateMachine.create({
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
        },

        onleavegame: (event, from, to) => {
        },

        onbeforeleave: function(event, from, to) {
        }
      }
    });
  }

  setupLoop() {
    return MainLoop
      .setUpdate((d) => this.updateLoop(d))
      .setDraw((d) => this.drawLoop(d))
      .setEnd((d) => this.endLoop(d));
  }

  startLoop() {
    this.loop.start();
  }

  updateLoop(delta) {
    // console.log('update');
  }

  drawLoop(delta) {
    // console.log('draw');
  }

  endLoop(delta) {
  }
}