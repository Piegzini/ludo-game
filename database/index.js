const mongoose = require('mongoose');
const Room = require('./Models/Room.js');
const Game = require('./Models/Game.js');
const Player = require('./Models/Player.js');

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
    const room = await Room.findOne({ $or: [{ players: { $size: 0 } }, { players: { $size: 1 } }, { players: { $size: 2 } }, { players: { $size: 3 } }] });
    console.log(room);
    return room;
  } catch (error) {
    console.log(error);
  }
};

module.exports.findFreeRoom = findFreeRoom;

const addPlayer = async (room_id, player_data) => {
  try {
    const player = new Player(player_data);
    const room = await Room.findOne({ _id: room_id });

    await room.update({ $push: { players: player } });
  } catch (error) {
    console.log(error);
  }
};
module.exports.addPlayer = addPlayer;
