const express = require('express');
const { join, resolve, extname } = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const router = require('./routes/index.js');
const Database = require('./database/index.js');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.static(join(__dirname, 'public')));
app.use('/', router);

module.exports = app;
