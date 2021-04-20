const express = require('express');
const routers = express.Router();
const { join, resolve } = require('path');
const htmlPath = resolve('public', 'html');
const { findFreeRoom, addToRoomPlayer, getPlayersInfo } = require('../database/index.js');

routers.get('/', (req, res) => {
  res.sendFile(join(htmlPath, 'index.html'));
});

routers.get('/information', (req, res) => {
  const session_cookie = req.cookies.session_data;
  if (!session_cookie) {
    const information = { inGame: false };
    res.send(JSON.stringify(information));
  } else if (session_cookie) {
  }
});

routers.post('/player', async (req, res) => {
  const nick = req.body.nick;
  const session_id = req.session.id;
  const player_data = {
    nick: nick,
    id: session_id,
  };

  const freeRoom = await findFreeRoom();
  const room_id = freeRoom.id;
  await addToRoomPlayer(room_id, player_data);

  const session_data = {
    session_id,
    room_id,
    nick,
  };

  // res.cookie('session_data', JSON.stringify(session_data), {
  //   maxAge: 1 * 60 * 60 * 1000,
  //   httpOnly: true,
  // });

  res.end();
});

module.exports = routers;
