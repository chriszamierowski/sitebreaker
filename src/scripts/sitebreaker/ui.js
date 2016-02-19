export default class UI {
  constructor (game) {
    this.game = game;

    this.setupScoreboard();
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
        <span id="sitebreaker-blocks" class="sitebreaker-blocks"></span>
      </div>`;

    this.game.stage.appendChild(this.scoreboard);

    this.scoreboardScore = document.getElementById('sitebreaker-score');
    this.scoreboardBalls = document.getElementById('sitebreaker-balls');
    this.scoreboardBlocks = document.getElementById('sitebreaker-blocks');
  }

  update() {
    this.updateScore();
    // this.updateBalls();
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
    // this.scoreboardBalls.innerHTML = `${ this.game.balls.length }`;
    this.showUpdate(this.scoreboardBalls);
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
}