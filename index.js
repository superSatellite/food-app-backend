const express = require('express');
const cors = require('cors');
const mysql = require('promise-mysql');


// Express middleware
const bodyParser = require('body-parser')
const checkLoginToken = require('./lib/check-login-token.js');
const morgan = require('morgan');


// Data loader
const NiteBiteDataLoader = require('./lib/niteBite.js');


// Controllers
const searchController = require('./controllers/restaurants.js');
const authController = require('./controllers/auth.js');

// Database / data loader initialization
const connection = mysql.createPool({
  // user: 'nitebite',
  // // //password: 'password321',
  // database: 'nitebite'

  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST

  // user: process.env.DB_USERNAME || 'nitebite',
  // password: process.env.DB_PASSWORD || 'password321',
  // database: process.env.DB_DATABASE || 'nitebite',
  // host: process.env.DB_HOST || 'localhost'
});

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
app.listen(port, () => {
  if (process.env.C9_HOSTNAME) {
    console.log(`Web server is listening on https://${process.env.C9_HOSTNAME}`);
  } else {
    console.log(`Web server is listening on http://localhost:${port}`);
  }
});


