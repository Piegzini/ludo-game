const mongoose = require('mongoose');
const Room = require('./Models/Room.js');
const Game = require('./Models/Game.js');
const Player = require('./Models/Player.js');
const Gamelogic = require('./Game-logic.js');

const Positions  = require('./static-data/Positions.js');
const uri = 'mongodb+srv://admin:admin@ludo-game.yw3mx.mongodb.net/ludo-game?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createRoom = async (player_data) => {
  try {
    const game = new Game();

    const roomId = mongoose.Types.ObjectId();
    const room_data = {
      _id: roomId,
      game,
      players: [],
    };
    const room = new Room(room_data);
    await room.save();
    return room;
  } catch (error) {
    console.log(error);
  }
};

module.exports.createRoom = createRoom;

const findFreeRoom = async () => {
  try {
    let freeRoom;
    let freeRooms = await Room.find({
      $or: [{ players: { $size: 0 } }, { players: { $size: 1 } }, { players: { $size: 2 } }, { players: { $size: 3 } }],
    });

    if (freeRooms) {
      for (const freeRoom_loop of freeRooms) {
        const room_id = freeRoom_loop._id;
        roomStartedGame = await checkStartGame(room_id);

        if (!roomStartedGame) {
          freeRoom = freeRoom_loop;
          break;
        }
      }
    }

    if (!freeRoom) {
      freeRoom = await createRoom();
    }
    return freeRoom;
  } catch (error) {
    console.log(error);
  }
};
module.exports.findFreeRoom = findFreeRoom;

const getColorFromCurrentFreeGame = async () => {
  try {
    const room = await findFreeRoom();
    const colors = room.game.colors;
    const randomNumber = Math.floor(Math.random() * colors.length);
    const color = colors[randomNumber];
    await room.updateOne({ $pull: { 'game.colors': color } });
    return color;
  } catch (error) {
    console.log(error);
  }
};
module.exports.getColorFromCurrentFreeGame = getColorFromCurrentFreeGame;

const createPlayer = async (player_data) => {
  try {
    const player_positions = Positions.basePositions[player_data.color];
    const end_Positions = Positions.endPositions[player_data.color];
    const relevant_player_data = {
      id: player_data.id,
      nick: player_data.nick,
      color: player_data.color,
      positions: player_positions,
      endPositions: end_Positions,
    };
    const createdPlayer = new Player(relevant_player_data);
    return createdPlayer;
  } catch (error) {
    console.log(error);
  }
};

const addToRoomPlayer = async (room_id, player_data) => {
  try {
    const room = await Room.findOne({ _id: room_id });
    const player = await createPlayer(player_data);
    await room.updateOne({ $push: { players: player } });
  } catch (error) {
    console.log(error);
  }
};
module.exports.addToRoomPlayer = addToRoomPlayer;

const getPlayersInfo = async (room_id) => {
  const room = await Room.findOne({ _id: room_id });
  const players = room.players;
  const game = room.game;
  const information = {
    game,
    players,
  };
  const json_players = JSON.stringify(information);

  return json_players;
};
module.exports.getPlayersInfo = getPlayersInfo;

const startGame = async (room_id) => {
  const room = await Room.findOne({ _id: room_id });
  const game = room.game;
  if (!game.isStarted) {
    game.isStarted = true;
    new Gamelogic(room_id);
    await room.updateOne({ game: game });
  }
};

const checkStartGame = async (room_id) => {
  const room = await Room.findOne({ _id: room_id });
  let readyPlayers = [];
  const players = room.players;

  for (const player of players) {
    if (player.isReady) {
      readyPlayers.push(player);
    }
  }
  const playersMoreThanTwo = players.length >= 1;
  const allPlayersReady = readyPlayers.length === players.length;

  if (playersMoreThanTwo && allPlayersReady) {
    await startGame(room_id);
    return true;
  } else {
    return false;
  }
};

const updatePlayerReadyStatus = async (data_to_find, status_data) => {
  try {
    const { room_id, session_id } = data_to_find;
    const { isReady } = status_data;
    const room = await Room.findOne({ _id: room_id });
    const players = room.players;
    for (const loop_player of players) {
      const validator = loop_player._id === session_id;
      if (validator) {
        loop_player.isReady = isReady;
      }
    }

    await room.updateOne({ players: players });
    await checkStartGame(room_id);
    console.log(room);
  } catch (error) {
    console.log(error);
  }
};
module.exports.updatePlayerReadyStatus = updatePlayerReadyStatus;
