export default class Player {
  constructor (game) {
    this.config = {
      speed: 1,
      width: 150,
      height: 15,
      img: 'images/paddle.svg'
    };

    this.img = new Image();
    this.img.src = this.config.img;


    this.game = game;

    this.reset();
  }

  reset() {
    this.speed = this.config.speed;
    this.width = this.config.width;
    this.height = this.config.height;
    this.minX = this.width/2;
    this.maxX = this.game.width - (this.width/2);

    this.setPosition(this.game.width/2, this.game.height - this.height*2);
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
    context.drawImage(this.img, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
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
    if(this.game.events.keysPressed.LEFT) {
      this.moveLeft();
    } else {
      this.stopMovingLeft();
    }

    if(this.game.events.keysPressed.RIGHT) {
      this.moveRight();
    } else {
      this.stopMovingRight();
    }
  }
}