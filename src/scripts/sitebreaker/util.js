export function addStylesheet() {
  let link = document.createElement('link');

  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = 'https://chriszamierowski.github.io/sitebreaker/stylesheets/sitebreaker.css';

  document.body.appendChild(link);
}

export function getWindowWidth() {
  return window.innerWidth;
}

export function getWindowHeight() {
  return window.innerHeight;
}

export function getElementFromPoint(game, x, y) {
  let element;
  // hide canvas so it isn't picked up
  game.canvas.classList.add('sitebreaker-hidden');

  element = document.elementFromPoint(x, y);

  if (!element) {
    game.canvas.classList.remove('sitebreaker-hidden');
    return false;
  }
  
  // if it's a text node, take the parent instead
  if (element.nodeType == Node.TEXT_NODE) {
    element = element.parentNode;
  }

  game.canvas.classList.remove('sitebreaker-hidden');
  return element;
}