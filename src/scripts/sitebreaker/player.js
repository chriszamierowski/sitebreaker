export default class Player {
  constructor (game) {
    this.config = {
      speed: 30,
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

  draw(context) {
    context.drawImage(this.img, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
  }
}