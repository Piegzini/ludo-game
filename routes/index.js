const express = require('express');
const routers = express.Router();
const { join, resolve } = require('path');
const htmlPath = resolve('public', 'html');
const { findFreeRoom, addToRoomPlayer, getPlayersInfo, updatePlayerReadyStatus, getColorFromCurrentFreeGame } = require('../database/index.js');
const Gamelogic = require('../database/Game-logic.js');

routers.get('/', (req, res) => {
  res.sendFile(join(htmlPath, 'index.html'));
});

routers.get('/information', async (req, res) => {
  const session_cookie = req.cookies.session_data;
  if (!session_cookie) {
    const information = { buildLobby: true };
    res.send(JSON.stringify(information));
  } else if (session_cookie) {
    const parsed_session_cookie = JSON.parse(session_cookie);
    const room_id = parsed_session_cookie.room_id;
    const information = await getPlayersInfo(room_id);
    res.send(information);
  }
});

routers.get('/rollnumber', async (req, res) => {
  const session_data = JSON.parse(req.cookies.session_data);
  const { room_id } = session_data;
  const logicOfCurrentGame = Gamelogic.allGamesInProgress[room_id];
  const rolledNumber = await logicOfCurrentGame.rollNumber();
  const responseData = { rolledNumber };
  res.send(JSON.stringify(responseData));
});

routers.get('/player', (req, res) => {
  const session_data = req.cookies.session_data;
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

  const session_data = {
    session_id,
    room_id,
    nick,
    color,
  };

  res.cookie('session_data', JSON.stringify(session_data), {
    maxAge: 1 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.end();
});

routers.patch('/player/isready', async (req, res) => {
  const session_data = JSON.parse(req.cookies.session_data);
  const isReady = req.body.isReady;
  const status_data = { isReady };
  console.log(req.body.isReady);
  await updatePlayerReadyStatus(session_data, status_data);

  res.end();
});

module.exports = routers;
