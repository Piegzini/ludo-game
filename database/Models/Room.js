const mongoose = require('mongoose');
const Game = require('./Game');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  _id: {
    type: mongoose.ObjectId,
  },
  finished: {
    type: Boolean,
    default: false,
  },
  playersCount: {
    type: Number,
    default: 0,
  },
  players: {
    type: Array,
  },
  game: {
    type: Object,
  },
});

const Room = mongoose.model('room', roomSchema);

module.exports = Room;
