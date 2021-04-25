class Player {
  constructor({ id, nick, color }) {
    this._id = id;
    this.nick = nick;
    this.color = color;
    this.isReady = false;
    this.positions = {};
  }
}
module.exports = Player;
