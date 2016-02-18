/* taken from https://github.com/jakesgordon/javascript-breakout */
export function bound(box) {
  if (box.radius) {
    box.w      = 2 * box.radius;
    box.h      = 2 * box.radius;
    box.left   = box.x - box.radius;
    box.right  = box.x + box.radius;
    box.top    = box.y - box.radius;
    box.bottom = box.y + box.radius;
  }
  else {
    box.left   = box.x;
    box.right  = box.x + box.w;
    box.top    = box.y;
    box.bottom = box.y + box.h;
  }
  return box;
}

export function overlap(box1, box2, returnOverlap) {
  if ((box1.right < box2.left)   ||
      (box1.left  > box2.right)  ||
      (box1.top   > box2.bottom) ||
      (box1.bottom < box2.top)) {
    return false;
  }
  else {
    if (returnOverlap) {
      var left   = Math.max(box1.left,  box2.left);
      var right  = Math.min(box1.right, box2.right);
      var top    = Math.max(box1.top,   box2.top);
      var bottom = Math.min(box1.bottom, box2.bottom);
      return {x: left, y: top, w: right-left, h: bottom-top, left: left, right: right, top: top, bottom: bottom };
    }
    else {
      return true;
    }
  }
}

export function normalize(vec, m) {
  vec.m = magnitude(vec.x, vec.y);
  if (vec.m == 0) {
    vec.x = vec.y = vec.m = 0;
  }
  else {
    vec.m = vec.m / (m || 1);
    vec.x = vec.x / vec.m;
    vec.y = vec.y / vec.m;
    vec.m = vec.m / vec.m;
  }
  return vec; 
}

export function magnitude(x, y) {
  return Math.sqrt(x*x + y*y);
}

export function move(x, y, dx, dy, dt) {
  var nx = dx * dt;
  var ny = dy * dt;
  return { x: x + nx, y: y + ny, dx: dx, dy: dy, nx: nx, ny: ny };
}

export function accelerate(x, y, dx, dy, accel, dt) {
  var x2  = x + (dt * dx) + (accel * dt * dt * 0.5);
  var y2  = y + (dt * dy) + (accel * dt * dt * 0.5);
  var dx2 = dx + (accel * dt) * (dx > 0 ? 1 : -1);
  var dy2 = dy + (accel * dt) * (dy > 0 ? 1 : -1);
  return { nx: (x2-x), ny: (y2-y), x: x2, y: y2, dx: dx2, dy: dy2 };
}

export function intercept(x1, y1, x2, y2, x3, y3, x4, y4, d) {
  var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
  if (denom != 0) {
    var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
    if ((ua >= 0) && (ua <= 1)) {
      var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
      if ((ub >= 0) && (ub <= 1)) {
        var x = x1 + (ua * (x2-x1));
        var y = y1 + (ua * (y2-y1));
        return { x: x, y: y, d: d};
      }
    }
  }
  return null;
}

export function ballIntercept(ball, rect, nx, ny) {
  var pt;
  if (nx < 0) {
    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                             rect.right  + ball.radius, 
                             rect.top    - ball.radius, 
                             rect.right  + ball.radius, 
                             rect.bottom + ball.radius, 
                             "right");
  }
  else if (nx > 0) {
    pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                             rect.left   - ball.radius, 
                             rect.top    - ball.radius, 
                             rect.left   - ball.radius, 
                             rect.bottom + ball.radius,
                             "left");
  }
  if (!pt) {
    if (ny < 0) {
      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                               rect.left   - ball.radius, 
                               rect.bottom + ball.radius, 
                               rect.right  + ball.radius, 
                               rect.bottom + ball.radius,
                               "bottom");
    }
    else if (ny > 0) {
      pt = intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                               rect.left   - ball.radius, 
                               rect.top    - ball.radius, 
                               rect.right  + ball.radius, 
                               rect.top    - ball.radius,
                               "top");
    }
  }
  return pt;
}