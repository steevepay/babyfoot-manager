require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/**
 * Generate the Swagger Documentation for the Babyfoot API 
 */
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./doc/swagger.yml');

/**
 * Import the routes
 */
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Define the routes
 */
app.use('/', indexRouter);
app.use('/api/v1', apiRouter);
app.use('/api/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * If page does not exist, return a 404 error.
 */
app.use((req, res, next) =>  {
  res.status(404).send("Oops, the page you're looking does not exist!")
})

module.exports = app;
