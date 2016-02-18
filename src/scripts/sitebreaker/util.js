export function addStylesheet() {
  let link = document.createElement('link');

  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = '../stylesheets/sitebreaker.css';

  document.body.appendChild(link);
}

export function getWindowWidth() {
  return window.innerWidth;
}

export function getWindowHeight() {
  return window.innerHeight;
}