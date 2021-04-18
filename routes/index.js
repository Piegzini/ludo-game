const express = require('express');
const routers = express.Router();
const bodyParser = require('body-parser');
const { join, resolve } = require('path');
const htmlPath = resolve('public', 'html');

routers.get('/', (req, res) => {
  const session_data = req.cookies.session_data ? JSON.parse(req.cookies.session_data) : false;
  console.log(session_data);
  if (!session_data) {
    const session_data = {
      id: req.session.id,
      nick: null,
      date: Date.now(),
    };

    res.cookie('session_data', JSON.stringify(session_data), {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.sendFile(join(htmlPath, 'opening.html'));
  } else if (!session_data.nick) {
    res.sendFile(join(htmlPath, 'opening.html'));
  } else if (session_data.nick) {
    res.sendFile(join(htmlPath, 'game.html'));
  }
});

routers.post('/', (req, res) => {
  const nick = req.body.nick;
  const session_data = JSON.parse(req.cookies.session_data);
  session_data.nick = nick;

  res.cookie('session_data', JSON.stringify(session_data), {
    maxAge: 1 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.sendFile(join(htmlPath, 'game.html'));
});


module.exports = routers;
