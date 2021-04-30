const express = require('express');
const routers = express.Router();
const { join, resolve } = require('path');
const htmlPath = resolve('public', 'html');
const { findFreeRoom, addToRoomPlayer, getPlayersInfo, updatePlayerReadyStatus, getColorFromCurrentFreeGame } = require('../database/index.js');
const Gamelogic = require('../database/Game-logic.js');

routers.get('/', (req, res) => {
  console.log(req.session.room_id);
  res.sendFile(join(htmlPath, 'index.html'));
});

routers.get('/information', async (req, res) => {
  const session = req.session;
  const session_data = {
    session_id: session.session_id,
    room_id: session.room_id,
    nick: session.nick,
    color: session.color,
  };
  if (!session.color) {
    const information = { buildLobby: true };
    res.send(JSON.stringify(information));
  } else if (req.session.color) {
    const information = await getPlayersInfo(session_data.room_id);
    if (information === 'no room') {
      req.session.destroy();
      res.redirect('/');
    } else {
      res.send(information);
    }
  }
});

routers.get('/rollnumber', async (req, res) => {
  const session = req.session;
  const session_data = {
    session_id: session.session_id,
    room_id: session.room_id,
    nick: session.nick,
    color: session.color,
  };
  const { room_id } = session_data;
  const logicOfCurrentGame = Gamelogic.allGamesInProgress[room_id];
  const rolledNumber = await logicOfCurrentGame.rollNumber();
  const responseData = { rolledNumber };
  res.send(JSON.stringify(responseData));
});

routers.get('/player', (req, res) => {
  const session = req.session;
  const session_data = {
    session_id: session.session_id,
    room_id: session.room_id,
    nick: session.nick,
    color: session.color,
  };
  if (session_data) {
    res.send(session_data);
  } else if (!session_data) {
    const data = JSON.stringify({ noPlayer: true });
    res.send(data);
  }
});
routers.post('/player', async (req, res) => {
  const nick = req.body.nick;
  const session_id = req.session.id;
  const freeRoom = await findFreeRoom();
  const color = await getColorFromCurrentFreeGame();
  const player_data = {
    nick: nick,
    id: session_id,
    color: color,
  };
  const room_id = freeRoom.id;
  await addToRoomPlayer(room_id, player_data);
  req.session.session_id = session_id;
  req.session.room_id = room_id;
  req.session.nick = nick;
  req.session.color = color;

  res.end();
});

routers.post('/player/move', async (req, res) => {
  const session = req.session;
  const session_data = {
    session_id: session.session_id,
    room_id: session.room_id,
    nick: session.nick,
    color: session.color,
  };
  const { room_id } = session_data;
  console.log('zapyanie');
  const logicOfCurrentGame = Gamelogic.allGamesInProgress[room_id];
  const { id, color } = req.body;
  await logicOfCurrentGame.pawnMove(id, color);
  res.send('succes');
});

routers.patch('/player/isready', async (req, res) => {
  const session = req.session;
  const session_data = {
    session_id: session.session_id,
    room_id: session.room_id,
    nick: session.nick,
    color: session.color,
  };
  const isReady = req.body.isReady;
  const status_data = { isReady };
  console.log(req.body.isReady);
  await updatePlayerReadyStatus(session_data, status_data);

  res.end();
});

module.exports = routers;
