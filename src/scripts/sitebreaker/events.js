//bunch of possibilities
let keys = new Map();
keys.set(8, 'BACKSPACE');
keys.set(9, 'TAB');
keys.set(13, 'RETURN');
keys.set(27, 'ESC');
keys.set(32, 'SPACE');
keys.set(37, 'LEFT');
keys.set(38, 'UP');
keys.set(39, 'RIGHT');
keys.set(40, 'DOWN');
keys.set(46, 'DELETE');

//store whether key is currently pressed (only ones we care about)
let keysPressed = {
  RETURN:    false,
  SPACE:     false,
  LEFT:      false,
  UP:        false,
  RIGHT:     false,
  DOWN:      false
};

addEvents();

function addEvents() {
  document.addEventListener(
    'keydown',
    e => onKey(e, e.keyCode, true),
    false
  );
  document.addEventListener(
    'keyup',
    e => onKey(e, e.keyCode, false),
    false
  );
}

function onKey(e, keyCode, pressed) {
  let key = keys.get(keyCode);

  if(key) {
    keysPressed[key] = pressed;
    e.preventDefault();
  }
}

export function keysPressed() {
  return keysPressed;
}