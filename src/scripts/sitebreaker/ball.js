export default class Ball {
  constructor (game) {
    this.config = {
      speed: 400,
      radius: 10,
      img: 'images/ball.svg'
    };

    this.img = new Image();
    this.img.src = this.config.img;

    this.game = game;

    this.colliders = [
      this.game.player,
      this.game.bounds.top,
      this.game.bounds.left,
      this.game.bounds.right,
    ].concat(this.game.blockList);

    this.reset();
  }

  reset() {
    this.speed = this.config.speed;
    this.radius = this.config.radius;
    this.moveToPaddle();
    this.setDirection(0,0);
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
    this.moving = dir.m != 0;
  }


  moveToPaddle() {
    this.setPosition(this.game.player.x + (this.game.player.w/2), this.game.player.y - (this.game.player.h/2) - this.radius);
  }

  update(delta) {
    let newPosition,
        mCurrent,
        mClosest = Infinity,
        point,
        item,
        closest = null,
        block;

    if (!this.moving) {
      return this.moveToPaddle();
    }

    newPosition = this.game.math.move(this.x, this.y, this.dx * this.speed, this.dy * this.speed, delta);

    for (let n = 0; n < this.colliders.length; n++) {
      item = this.colliders[n];
      
      if (!item.destroyed) {
        //need to recompute the position of elements because they change when other DOM elements are removed
        this.game.math.bound(item);

        point = this.game.math.ballIntercept(this, item, newPosition.nx, newPosition.ny);
          
        if (point) {
         mCurrent = this.game.math.magnitude(point.x - this.x, point.y - this.y);

          if (mCurrent < mClosest) {
            mClosest = mCurrent;
            closest = {item: item, point: point};
          }
        }
      }
    }

    if (closest) {

      if (closest.item.isBlock) {
        this.game.blocks.destroyBlock(closest.item, this.game);
        if (!this.moving) {
          return;
        }
      }

      if ((closest.item == this.game.player) && (closest.point.d == 'top')) {
        newPosition.dx = this.speed * (closest.point.x - (this.game.player.left + this.game.player.w/2)) / (this.game.player.w/2);
      }

      this.setPosition(closest.point.x, closest.point.y);

      switch(closest.point.d) {
        case 'left':
        case 'right':
          this.setDirection(-newPosition.dx, newPosition.dy);
          break;

        case 'top':
        case 'bottom':
          this.setDirection(newPosition.dx, -newPosition.dy);
          break;
      }

      var udt = delta * (mClosest / this.game.math.magnitude(newPosition.nx, newPosition.ny)); // how far along did we get before intercept ?
      return this.update(delta - udt); // so we can update for time remaining
    }

    if ((newPosition.x < 0) || (newPosition.y < 0) || (newPosition.x > this.game.width) || (newPosition.y > this.game.height)) {
      this.game.removeBall(this);
    }
    else {
      this.setPosition(newPosition.x,  newPosition.y);
      this.setDirection(newPosition.dx, newPosition.dy);
    }
  }

  draw(context) {
    context.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius*2, this.radius*2);
  }

  fire() {
    this.moveToPaddle();
    this.setDirection(Math.abs(this.game.player.dright) - Math.abs(this.game.player.dleft), -1);
  }
}