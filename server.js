var http = require('http');
const express = require('express')
var logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const router = require('./app/routes');

const port = 3001
const app = express()

app.use(logger('dev'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router)

var server = http.createServer(app);
server.listen(port);