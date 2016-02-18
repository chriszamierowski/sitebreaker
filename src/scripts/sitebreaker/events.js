export default class Events {
  constructor () {
    //bunch of possibilities
    this.keys = new Map();
    this.keys.set(8, 'BACKSPACE');
    this.keys.set(9, 'TAB');
    this.keys.set(13, 'RETURN');
    this.keys.set(27, 'ESC');
    this.keys.set(32, 'SPACE');
    this.keys.set(37, 'LEFT');
    this.keys.set(38, 'UP');
    this.keys.set(39, 'RIGHT');
    this.keys.set(40, 'DOWN');
    this.keys.set(46, 'DELETE');

    //store whether key is currently pressed (only ones we care about)
    this._keysPressed = {
      RETURN:    false,
      SPACE:     false,
      LEFT:      false,
      UP:        false,
      RIGHT:     false,
      DOWN:      false
    };

    this.addEvents();
  }

  addEvents() {
    document.addEventListener(
      'keydown',
      e => this.onKey(e, e.keyCode, true),
      false
    );
    document.addEventListener(
      'keyup',
      e => this.onKey(e, e.keyCode, false),
      false
    );
  }

  onKey(e, keyCode, pressed) {
    let key = this.keys.get(keyCode);

    if(key) {
      this._keysPressed[key] = pressed;
      e.preventDefault();
    }
  }

  get keysPressed() {
    return this._keysPressed;
  }
}