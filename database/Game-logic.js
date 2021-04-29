const Room = require('./Models/Room.js');
const mongoose = require('mongoose');
const Positions = require('./static-data/Positions.js');
const uri = 'mongodb+srv://admin:admin@ludo-game.yw3mx.mongodb.net/ludo-game?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

class Gamelogic {
  static allGamesInProgress = {};
  constructor(room_id) {
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
        game.rolledNumber = null;
        game.turnTime = 10;
      } else {
        game.turnTime = turnTime - 2;
      }
    }

    process.stdout.write(` ${turnTime}`);
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

  async rollNumber() {
    const room = await Room.findOne({ _id: this.room_id });
    const { game } = room;
    let { rolledNumber } = game;
    const min = 1;
    const max = 7;

    rolledNumber = Math.floor(Math.random() * (max - min)) + min;
    game.rolledNumber = rolledNumber;

    await room.updateOne({ game: game });
    console.log(game);
    return rolledNumber;
  }

  async pawnMove(id, color) {
    const room = await Room.findOne({ _id: this.room_id });
    const pawnId = id;
    const { players, game } = room;
    const { currentTurnColor, rolledNumber } = game;
    const indexOfCurrentPlayer = this.findCurrentPlayer(players, currentTurnColor);
    const currentPlayer = players[indexOfCurrentPlayer];
    const positionsOfCurrentPlayer = currentPlayer.positions;
    for (const key in positionsOfCurrentPlayer) {
      const position = positionsOfCurrentPlayer[key];
      const idOfPosition = position.id;
      const { positionNumber } = position;
      if (idOfPosition === pawnId) {
        if (positionNumber === 'base') {
          const startedPosition = Positions.startedPositions[currentTurnColor];
          positionsOfCurrentPlayer[key].positionNumber = startedPosition;
          positionsOfCurrentPlayer[key].top = Positions.gamePositions[startedPosition].top;
          positionsOfCurrentPlayer[key].left = Positions.gamePositions[startedPosition].left;
        } else {
          positionsOfCurrentPlayer[key].positionNumber += rolledNumber;
          positionsOfCurrentPlayer[key].positionNumber = positionsOfCurrentPlayer[key].positionNumber % 40;
          const current_positionNumber = positionsOfCurrentPlayer[key].positionNumber;

          positionsOfCurrentPlayer[key].top = Positions.gamePositions[current_positionNumber].top;
          positionsOfCurrentPlayer[key].left = Positions.gamePositions[current_positionNumber].left;
        }
      }
    }

    currentPlayer.positions = positionsOfCurrentPlayer;
    players[indexOfCurrentPlayer] = currentPlayer;
    await room.updateOne({ players: players });
  }

  findCurrentPlayer(players_data, currentPlayerColor_data) {
    const players = players_data;
    const currentPlayerData = currentPlayerColor_data;
    for (const [index, player] of players.entries()) {
      const loop_playerColor = player.color;
      if (loop_playerColor === currentPlayerData) {
        return index;
      }
    }
  }
}

module.exports = Gamelogic;
