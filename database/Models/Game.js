class Game {
  constructor() {
    this.currentTurn = null;
    this.turnTime = 50;
    this.rolledNumber = null;
    this.colors = ['red', 'green', 'blue', 'yellow'];
  }

  getColor() {
    const randomNumber = Math.floor(Math.random() * this.colors.length);
    const color = this.colors[randomNumber];
    this.colors.splice(randomNumber, 1);
    return color;
  }
}

module.exports = Game;
