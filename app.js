require('dotenv').config()
// const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);

app.use((req, res, next) =>  {
  res.status(404).send("Oops, the page you're looking does not exist!")
})

module.exports = app;
