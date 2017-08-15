const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const mysql = require('promise-mysql');


// Express middleware
const bodyParser = require('body-parser')
// const morgan = require('morgan');


// Data loader
const NiteBiteDataLoader = require('./lib/niteBite.js');


// Controllers
const searchController = require('./controllers/restaurants.js');


// Database / data loader initialization
const connection = mysql.createPool({
  user: 'root',
  password: 'root',
  database: 'niteBite'
});
const dataLoader = new NiteBiteDataLoader(connection);



// Google Api
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg',
  Promise: Promise
});


// Express initialization
const app = express();
//app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/search', searchController(dataLoader));





// // Start the server
// app.listen(3000)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.C9_HOSTNAME) {
    console.log(`Web server is listening on https://${process.env.C9_HOSTNAME}`);
  } else {
    console.log(`Web server is listening on http://localhost:${port}`);
  }
});

