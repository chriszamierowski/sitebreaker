// this is the main file that pulls in all other modules
// you can require() bower components too!
var example = require("./example");
example.welcome();

let grid = document.getElementById('grid'),
    rows = 0,
    block,
    widthRemaining,
    widthChoices = [5, 10, 15],
    widthChoice;

for(rows = 0; rows<5; rows++) {
  widthRemaining = 100;

  while(widthRemaining > 0) {
    widthChoice = pickWidth();
    widthRemaining -= widthChoice;
    block = document.createElement('div');
    block.classList.add('grid-block');
    block.innerHTML = '&nbsp;';
    block.style.top = rows*10+'vh';
    block.style.right = widthRemaining+'%';
    block.style.width = widthChoice+'%';
    grid.appendChild(block);
  }
}

function pickWidth() {
  let index = Math.round(Math.random()*(widthChoices.length - 1)),
      w = widthChoices[index];

  if(w <= widthRemaining) {
    return w;
  } else {
    return widthRemaining;
  }
}