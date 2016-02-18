export default class Ball {
  constructor (game) {
    this.config = {
      speed: .1,
      radius: 10,
      img: 'images/ball.svg'
    };

    this.img = new Image();
    this.img.src = this.config.img;


    this.game = game;

    this.reset();
  }

  reset() {
    this.speed = this.config.speed;
    this.radius = this.config.radius;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.game.math.bound(this);
  }

  setDirection(dx, dy) {
    let dir = this.game.math.normalize({ x: dx, y: dy });

    this.dx = dir.x;
    this.dy = dir.y;
  }


  move(x) {
    
  }

  update(delta) {
    var newPosition;

    this.handleEvents();

    newPosition = this.game.math.move(this.x, this.y, this.dx * this.speed, this.dy * this.speed, delta);

    this.setPosition(newPosition.x,  newPosition.y);
    this.setDirection(newPosition.dx, newPosition.dy);
  }

  draw(context) {
    context.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius*2, this.radius*2);
  }

  fire() {
    this.setPosition(this.game.player.x, this.game.player.y - (this.game.player.height/2) - this.radius);
    this.setDirection(Math.abs(this.game.player.dright) - Math.abs(this.game.player.dleft), -1);
  }

  handleEvents() {
    if(this.game.events.keysPressed.SPACE) {
      this.fire();
    }
  }
}