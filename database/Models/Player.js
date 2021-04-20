class Player {
  constructor({ id, nick, color }) {
    this._id = id;
    this.nick = nick;
    this.color = color;
    this.status = 0;
  }
}
module.exports = Player;
