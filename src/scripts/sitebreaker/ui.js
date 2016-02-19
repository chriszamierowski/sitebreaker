export default class UI {
  constructor (game) {
    this.game = game;

    this.setupScoreboard();
    this.setupDialog();
  }

  setupScoreboard() {
    this.scoreboard = document.createElement('div');
    this.scoreboard.classList.add('sitebreaker-scoreboard');

    this.scoreboard.innerHTML =
      `<div title="Your Score">
        <img src="images/star.svg"/>
        <span id="sitebreaker-score" class="sitebreaker-score"></span>
      </div>
      <div title="Balls Remaining">
        <img src="images/ball.svg"/>
        <i>x</i><span id="sitebreaker-balls" class="sitebreaker-balls"></span>
      </div>
      <div title="Blocks Remaining">
        <img src="images/block.svg"/>
        <i>x</i><span id="sitebreaker-blocks" class="sitebreaker-blocks"></span>
      </div>`;

    this.game.stage.appendChild(this.scoreboard);

    this.scoreboardScore = document.getElementById('sitebreaker-score');
    this.scoreboardBalls = document.getElementById('sitebreaker-balls');
    this.scoreboardBlocks = document.getElementById('sitebreaker-blocks');
  }

  setupDialog() {
    this.dialog = document.createElement('div');
    this.dialog.classList.add('sitebreaker-dialog');
    this.game.stage.appendChild(this.dialog);
  }

  update() {
    this.updateScore();
    this.updateBalls();
    this.updateBlocks();
  }

  updateScore() {
    if(this.game.score != this.lastScore ) {
      this.scoreboardScore.innerHTML = `${ this.game.score }`;
      this.showUpdate(this.scoreboardScore);
      this.lastScore = this.game.score;
    }
  }

  updateBalls() {
    if(this.game.ballsRemaining != this.lastBallsRemaining ) {
      this.scoreboardBalls.innerHTML = `${ this.game.ballsRemaining }`;
      this.showUpdate(this.scoreboardBalls);
      this.lastBallsRemaining = this.game.ballsRemaining;
    }
  }

  updateBlocks() {
    let blocksRemaining = this.game.blockList.length;

    this.game.blockList.forEach(function(e) {
      if(e.destroyed) {
        blocksRemaining--;
      }
    });

    if(blocksRemaining != this.lastBlocksRemaining) {
      this.scoreboardBlocks.innerHTML = `${ blocksRemaining }`;
      this.showUpdate(this.scoreboardBlocks);
      this.lastBlocksRemaining = blocksRemaining;
    }
  }

  showUpdate(elem) {
    elem.classList.add('sitebreaker-updating');
    setTimeout(()=>{
      elem.classList.remove('sitebreaker-updating');
    }, 100);
  }

  showGameOver() {
    this.gameOver = document.createElement('div');
    this.gameOver.innerHTML = 
     `<div class="sitebreaker-gameover">
      <h1>Game Over</h1>
      <h2>Final Score: <span>${ this.game.score }</span></h2>
      </div>`;
    this.dialog.appendChild(this.gameOver);
  }

  showWin() {
    this.win = document.createElement('div');
    this.win.innerHTML = 
     `<div class="sitebreaker-win">
      <h1>You Won!</h1>
      <h2>Final Score: <span>${ this.player.score }</span></h2>
      </div>`;
    this.dialog.appendChild(this.win);
  }
}