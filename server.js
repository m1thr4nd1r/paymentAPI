var http = require('http');
const express = require('express')
const httpProxy = require('express-http-proxy')
var logger = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express()
const port = 3001

const gateway1Proxy = httpProxy('https://gtw1.rafaelverger.com.br');
const gateway2Proxy = httpProxy('https://gtw2.rafaelverger.com.br');

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./app/routes')(app, {});

var server = http.createServer(app);
server.listen(3000);

//app.listen(port, () => {
//  console.log(`Server running at http://localhost:${port}`)
//  console.log('To shutdown the server: ctrl + c')
//})