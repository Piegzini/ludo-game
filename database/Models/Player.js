class Player {
  constructor({ id, nick, color, positions, endPositions }) {
    this._id = id;
    this.nick = nick;
    this.color = color;
    this.isReady = false;
    this.positions = positions;
    this.endPositions = endPositions
  }
}
module.exports = Player;
