// add a `sitebreaker-block` class to all potential blocks
export function findBlocks() {
  let allTags = Array.from(document.body.querySelectorAll('*'));

  for (let [index, elem] of allTags.entries()) {
    if(
      isValidBlock(elem) &&
      elem.offsetHeight > 0 &&
      elem.offsetHeight > 0 &&
      //might need to come back to this for tags like
      // <p>text<span>more</span>text</p>
      hasOnlyTextChildren(elem)
    ) {
      elem.classList.add('sitebreaker-block');
    }
  }
}

function isValidBlock(elem) {
  let ignoredTags = ['HTML', 'HEAD', 'BODY', 'SCRIPT', 'NOSCRIPT', 'STYLE'];

  if(elem) {
    return !ignoredTags.find(t => t == elem.tagName.toUpperCase());
  } else {
    return false;
  }
}

function hasOnlyTextChildren(elem) {
  return elem.childElementCount === 0;
}