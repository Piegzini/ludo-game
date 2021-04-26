class Game {
  constructor() {
    this.isStarted = false;
    this.currentTurnColor = null;
    this.turnTime = 6;
    this.rolledNumber = null;
    this.colors = ['red', 'green', 'blue', 'yellow'];
  }
}

module.exports = Game;
