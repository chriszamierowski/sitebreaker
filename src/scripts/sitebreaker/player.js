export default class Player {
  constructor (game) {
    this.config = {
      speed: 500,
      w: 150,
      h: 15,
      img: 'images/paddle.svg'
    };

    this.img = new Image();
    this.img.src = this.config.img;


    this.game = game;

    this.reset();
  }

  reset() {
    this.speed = this.config.speed;
    this.w = this.config.w;
    this.h = this.config.h;
    this.minX = 0;
    this.maxX = this.game.width - this.w;

    //position upper left hand corner
    this.setPosition(this.game.width/2 - this.w/2, this.game.height - this.h*2);
    this.setDirection(0);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.game.math.bound(this);
  }

  setDirection(dx) {
    this.dleft  = (dx < 0 ? -dx : 0);
    this.dright = (dx > 0 ?  dx : 0);
  }

  move(x) {
    this.setPosition(Math.min(this.maxX, Math.max(this.minX, x)), this.y);
  }

  update(delta) {
    let amount;

    this.handleEvents();

    amount = this.dright - this.dleft;

    if (amount != 0) {
      this.move(this.x + (amount * delta * this.speed));
    }
  }

  draw(context) {
    context.drawImage(this.img, this.x, this.y, this.w, this.h);
  }

  moveLeft() {
    this.dleft  = 1;
  }

  moveRight() {
    this.dright = 1;
  }  

  stopMovingLeft() {
    this.dleft  = 0;
  }

  stopMovingRight() {
    this.dright = 0;
  }

  handleEvents() {
    let keys = this.game.events.keysPressed();
    
    if(keys.LEFT) {
      this.moveLeft();
    } else {
      this.stopMovingLeft();
    }

    if(keys.RIGHT) {
      this.moveRight();
    } else {
      this.stopMovingRight();
    }
  }
}