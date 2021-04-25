class Game {
  constructor() {
    this.isStarted = false;
    this.currentTurn = null;
    this.turnTime = 50;
    this.rolledNumber = null;
    this.colors = ['red', 'green', 'blue', 'yellow'];
  }
}

module.exports = Game;
