const express = require('express');
const routers = express.Router();
const { join, resolve } = require('path');
const htmlPath = resolve('public', 'html');

routers.get('/',  (req, res) => {
  if (!req.cookies.session_id) {
    res.cookie('session_id', req.session.id, {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
    });
  }
  res.sendFile(join(htmlPath, 'index.html'));
});
module.exports = routers;
