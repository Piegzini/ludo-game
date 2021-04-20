const express = require('express');
const routers = express.Router();
const { join, resolve } = require('path');
const htmlPath = resolve('public', 'html');
const { createRoom, findFreeRoom, addPlayer } = require('../database/index.js');

routers.get('/', (req, res) => {
  res.sendFile(join(htmlPath, 'index.html'));
});

routers.post('/player', async (req, res) => {
  const nick = req.body.nick;
  const session_id = req.session.id;
  const player_data = {
    nick: nick,
    id: session_id,
  };

  let freeRoom = await findFreeRoom();
  if (!freeRoom) {
    freeRoom = await createRoom();
  }
  const room_id = freeRoom.id;
  await addPlayer(room_id, player_data);
  const session_data = {
    session_id,
    room_id,
    nick,
  };

  res.cookie('session_data', JSON.stringify(session_data), {
    maxAge: 1 * 60 * 60 * 1000,
    httpOnly: true,
  });

  console.log('stworzone');
  res.send();
});

module.exports = routers;
