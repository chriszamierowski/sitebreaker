export default class Util {
  constructor() {

  }

  addStylesheet() {
    let link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '../stylesheets/sitebreaker.css';

    document.body.appendChild(link);
  }

  getWindowWidth() {
    return window.innerWidth;
  }

  getWindowHeight() {
    return window.innerHeight;
  }
}