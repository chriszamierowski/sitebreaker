import * as SitebreakerMath from './math';

// add a `sitebreaker-block` class to all potential blocks
export function findBlocks() {
  let allTags = Array.from(document.body.querySelectorAll('*')),
      blocks = [];

  for (let [index, elem] of allTags.entries()) {
    if(
      isValidBlock(elem) &&
      elem.offsetHeight > 0 &&
      elem.offsetHeight > 0 &&
      //might need to come back to this for tags like
      // <p>text<span>more</span>text</p>
      hasOnlyTextChildren(elem)
    ) {
      let rect = elem.getBoundingClientRect(),
          block = {
            top: rect.top,
            right: rect.right,
            left: rect.left,
            bottom: rect.bottom,
            x: rect.left,
            y: rect.top,
            w: elem.offsetWidth,
            h: elem.offsetHeight,
            isBlock: true,
            destroyed: false,
            elem: elem
          };

      block.score = Math.round(block.w*block.y/100);

      elem.classList.add('sitebreaker-block');
      blocks.push(SitebreakerMath.bound(block));
    }
  }

  return blocks;
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

export function destroyBlock(block, game) {
  game.increaseScore(block.score);
  block.destroyed = true;
  block.elem.parentNode.removeChild(block.elem);

  game.blocksHit = game.blocksHit ? game.blocksHit + 1 : 1;
  if(game.blocksHit === game.blockList.length) {
    game.stateMachine.win();
  }
}