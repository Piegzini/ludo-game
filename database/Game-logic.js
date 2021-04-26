const Room = require('./Models/Room.js');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://admin:admin@ludo-game.yw3mx.mongodb.net/ludo-game?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

class Gamelogic {
  static allGamesInProgress = {};
  constructor(room_id) {
    console.log(room_id);
    this.room_id = room_id;

    Gamelogic.allGamesInProgress[`${room_id}`] = this;
    this.turnTimeInterval;
    this.setElapseTurnTimeInterval();
  }

  elapsedTurnTime = async () => {
    const room = await Room.findOne({ _id: this.room_id });
    const { game, players } = room;
    const { turnTime, currentTurnColor } = game;
    if (!currentTurnColor) {
      //ustawienie peirwszego gracza
      const player = players[0];
      const firstPlayerColor = player.color;
      game.currentTurnColor = firstPlayerColor;
    } else {
      if (turnTime === 0) {
        game.currentTurnColor = await this.nextPlayer(currentTurnColor, players);
        game.turnTime = 10;
      } else {
        game.turnTime = turnTime - 2;
      }
    }

    console.log(game.turnTime);
    await room.updateOne({ game: game });
  };

  setElapseTurnTimeInterval() {
    this.turnTimeInterval = setInterval(this.elapsedTurnTime, 2000);
  }

  async nextPlayer(current_color, players_data) {
    const currentTurnColor = current_color;
    const players = players_data;
    const countOfPlayers = players.length;
    let indexOfCurrentPlayer;
    for (const [index, player] of players.entries()) {
      const { color } = player;
      if (color === currentTurnColor) {
        indexOfCurrentPlayer = index;
      }
    }
    const nextPlayerIndex = indexOfCurrentPlayer + 1 >= countOfPlayers ? 0 : indexOfCurrentPlayer + 1;
    const nextPlayer = players[nextPlayerIndex];
    const colorOfNextPlayer = nextPlayer.color;
    return colorOfNextPlayer;
  }
}

module.exports = Gamelogic;
