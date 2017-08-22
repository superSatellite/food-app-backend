const express = require('express');
const cors = require('cors');
const mysql = require('promise-mysql');

// config loading..
let config		= require("./config");

// Express middleware
const bodyParser = require('body-parser');
const checkLoginToken = require('./lib/check-login-token.js');
const morgan = require('morgan');

// Data loader
const NiteBiteDataLoader = require('./lib/niteBite.js');

// Controllers
const searchController = require('./controllers/restaurants.js');
const authController = require('./controllers/auth.js');

// Database / data loader initialization
const connection = mysql.createPool(config.db.options);
const dataLoader = new NiteBiteDataLoader(connection);


// Express initialization
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(checkLoginToken(dataLoader));
app.use(cors());
app.use('/places', searchController(dataLoader));
app.use('/auth', authController(dataLoader));

// Start the server

const port = process.env.PORT || 3001;

app.listen(config.port, () => {
  console.log(`Web server is listening on http://${config.ip}:${config.port}`);
});


