export default class BlockList {
  constructor () {
    let allTags = Array.from(document.body.querySelectorAll('*'));

    for (let [index, elem] of allTags.entries()) {
      if(
        this.isValidBlock(elem) &&
        elem.offsetHeight > 0 &&
        elem.offsetHeight > 0 &&
        //might need to come back to this for tags like
        // <p>text<span>more</span>text</p>
        this.hasOnlyTextChildren(elem)
      ) {
        elem.classList.add('sitebreaker-block');
      }
    }
  }

  isValidBlock(elem) {
    let ignoredTags = ['HTML', 'HEAD', 'BODY', 'SCRIPT', 'NOSCRIPT', 'STYLE'];

    if(elem) {
      return !ignoredTags.find(t => t == elem.tagName.toUpperCase());
    } else {
      return false;
    }
  }

  hasOnlyTextChildren(elem) {
    return elem.childElementCount === 0;
  }
}