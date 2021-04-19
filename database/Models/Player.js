class Player {
  constructor({ id, nick, color }) {
    this._id = id;
    this.nick = nick;
    this.color = color;
    this.status = 1;
  }
}
module.exports = Player;
