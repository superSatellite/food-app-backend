const fetch = require('node-fetch');
const md5 = require('md5');
const validate = require('./validations');
const bcrypt = require('bcrypt-as-promised');
const knex = require('knex')({ client: 'mysql' });
const util = require('./util');

const HASH_ROUNDS = 10;
const USER_FIELDS = ['id', 'email', 'createdAt', 'updatedAt'];

// Google Api
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg',
  Promise: Promise
});

var key = "AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg";


class NiteBiteDataLoader {
	constructor(conn) {
    	this.conn = conn;
  }

  query(sql) {
    return this.conn.query(sql);
  }

  // User methods
  createUser(userData) {

    //console.log(userData, "userData");

    const errors = validate.user(userData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }

    return bcrypt.hash(userData.password, HASH_ROUNDS)
    .then((hashedPassword) => {

      console.log(userData.password, "userData");
      console.log(hashedPassword, "hashedPassword");
      
      // return this.conn.query(
      //   `INSERT INTO users (email, password) VALUES (?, ?)`, [userData.email, hashedPassword]
      // );
      return this.query(
        knex
        .insert({
          email: userData.email,
          password: hashedPassword  
        })
        .into('users')
        .toString()
      );
    })
    .then((result) => {

      console.log(result, "result");

      return this.query(
        knex
        .select(USER_FIELDS)
        .from('users')
        .where('id', result.insertId)
        .toString()
      );
    })
    .then(user => {
        var hash = md5(userData.email);
        var url = `https://www.gravatar.com/avatar/${hash}`;
        user[0].avatarUrl = url;
        console.log(user, "user in nitebite.js")
        return user;
    })
    .catch((error) => {
      // Special error handling for duplicate entry
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('A user with this email already exists');
      } else {
        throw error;
      }
    });
  }

  deleteUser(userId) {
    return this.query(
      knex.delete().from('users').where('id', userId).toString()
    );
  }

  getUserFromSession(sessionToken) {

    //console.log(sessionToken, "session");

    return this.query(
      knex
      .select(util.joinKeys('users', USER_FIELDS))
      .from('sessions')
      .join('users', 'sessions.userId', '=', 'users.id')
      .where({
        'sessions.token': sessionToken
      })
      .toString()
    )
    .then((result) => {

      //console.log(result, "result");

      if (result.length === 1) {
        return result[0];
      }

      return null;
    });
  }

  createTokenFromCredentials(email, password) {
    const errors = validate.credentials({
      email: email,
      password: password
    });
    if (errors) {
      return Promise.reject({ errors: errors });
    }

    let sessionToken;
    let user;
    return this.query(
      knex
      .select('id', 'password')
      .from('users')
      .where('email', email)
      .toString()
    )
    .then((results) => {
      if (results.length === 1) {
        user = results[0];
        return bcrypt.compare(password, user.password).catch(() => false);
      }

      return false;
    })
    .then((result) => {
      if (result === true) {
        return util.getRandomToken();
      }

      throw new Error('Username or password invalid');
    })
    .then((token) => {
      sessionToken = token;
      return this.query(
        knex
        .insert({
          userId: user.id,
          token: sessionToken
        })
        .into('sessions')
        .toString()
      );
    })
    .then(() => sessionToken);
  }

  deleteToken(token) {
    return this.query(
      knex
      .delete()
      .from('sessions')
      .where('token', token)
      .toString()
    )
    .then(() => true);
  }


	getLatLng(address) {
		// Geocode an address with a promise
		console.log(address, "= address")
		return googleMapsClient.geocode({address: address}).asPromise()
		  .then((response) => {
		    return response.json.results[0].geometry.location;
		  })
		  .catch((err) => {
		    console.log(err);
		  });
	}

	getAddressFromLatLng(latlng) {
		//reverse geocoding, get address from user's latlng position
		// console.log(latlng, "=latitude and longitude")
		var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${key}`;
	
		return(
			fetch(url)
			.then(response => response.json())
			.then(data => {
				console.log(data.results[0].formatted_address, "=address from latlng")
				return data.results[0].formatted_address
				})
		);
	}
	
	getRestaurants(locationObj) {

		var location = locationObj.lat+","+locationObj.lng;
		var radius = "3000";
		var types = "restaurant";
		var openNow = false;

		console.log(location, "= location")

		var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&types=${types}&openNow=false&key=${key}`;


		return(
			fetch(url)
			.then(response => response.json())
			.then(data => {
				data.initialLocation = locationObj
				return data
				})
		);
	}


	// googleMapsClient.placesNearby({
	// 	location: loc,
	// 	radius: 1000,
	// 	type: "restaurant",
	// ), function(err, response) (
	// 	console.log('err', err);
	// 	if (!err) {
	// 		console.log(response.json);
	// 	}
	// )


	getRestaurantsInfo(placeId) {

		var url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${key}`

		return(
			fetch(url)
			.then(response => response.json())
		);
	}


	getPhoto(reference) {

		console.log(reference, "reference")
		var ref = reference;

		var url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${key}`

		return(
			fetch(url)
		);
	}

  postComment(placeId, userId, comment) {

    return this.conn.query(
      `INSERT INTO comments (placeId, userId, comment) 
      VALUES (?, ?, ?`, [placeId, userId, comment]
      )
    .then((result) => {
      return this.conn.query(
      `SELECT * 
      FROM comments 
      WHERE placeId=?`, [result.placeId]
      )
      });

    console.log(userId, placeId, comment, "place id, user id, comment in nitebite.js")
  }

  getCommentsforPlace(placeId) {


  }


}

module.exports = NiteBiteDataLoader;
