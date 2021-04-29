class Player {
  constructor({ id, nick, color, positions }) {
    this._id = id;
    this.nick = nick;
    this.color = color;
    this.isReady = false;
    this.positions = positions;
  }
}
module.exports = Player;
