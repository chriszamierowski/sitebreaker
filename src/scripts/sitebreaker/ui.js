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
      <h2>Final Score: <span>${ this.game.score }</span></h2>
      </div>`;
    this.dialog.appendChild(this.win);
  }

  showInstructions() {
    this.instructions = document.createElement('div');
    this.instructions.innerHTML = 
     `<div class="sitebreaker-instructions">
      <p>&#9664; &amp; &#9654; to move.</p>
      <p>Spacebar to shoot a ball.</p>
      <p>Destroy all blocks.</p>
      <button id="sitebreaker-close-instructions"><img src="data:image/svg+xml;utf8,<svg width='185' height='51' viewBox='0 0 185 51' xmlns='http://www.w3.org/2000/svg'><title>Begin</title><path d='M16.648 31.488h6.264V38.4h-6.264v-6.912zm6.264-12.6h-6.264v-5.616h6.264v5.616zM32.344 51c3.744 0 6.336-2.592 6.336-6.264V31.992c0-3.744-3.024-6.12-6.48-6.12v-1.368c3.456 0 6.48-2.376 6.48-6.048V6.864C38.68 3.192 36.088.6 32.344.6H.88V51h31.464zm45.072 0V38.4h-18v-6.912h15.48v-12.6h-15.48v-5.616h15.48l2.52-6.408V.6H43.72V51h33.696zM88.072.6c-3.744 0-6.336 2.592-6.336 6.264v37.872c0 3.672 2.592 6.264 6.336 6.264h31.464V21.48h-15.768V38.4h-6.264V13.272h19.224l2.52-6.408V.6H88.072zm52.92 50.4V.6h-15.696V51h15.696zM170.8 23.928L163.456.6h-16.704V51h14.472v-6.264l-2.016-16.992h1.224L167.848 51h16.704V.6h-14.544v6.264l2.088 17.064H170.8z' fill='#FFF' fill-rule='evenodd'/></svg>"></button>
      </div>`;
    this.dialog.appendChild(this.instructions);

    document.getElementById('sitebreaker-close-instructions').addEventListener('click', (e) => {
      this.game.stateMachine.start();
    });
  }

  hideInstructions() {
    this.dialog.innerHTML = '';
  }
}