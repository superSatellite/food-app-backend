const express = require('express');
const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const restaurantController = express.Router();


	// Search for a list of restaurants
	restaurantController.post('/search', (req, res) => {

		var address = req.body.address;
		dataLoader.getLatLng(address)
		.then(LatLng => dataLoader.getRestaurants(LatLng))
		.then(data => res.send(data))
	 	.catch(err => res.status(400).json(err))
	})

	//get user's address from latlng 
	restaurantController.post('/location', (req, res) => {
		// console.log(req.body, "req.body")
		var latlng = req.body.latlng;
		dataLoader.getAddressFromLatLng(latlng)
		.then(data => res.send(data))
	 	.catch(err => res.status(400).json(err))
	})


	// Information for restaurants
	restaurantController.get('/:id', (req, res) => {

		//console.log(req.params.id);
		dataLoader.getRestaurantsInfo(req.params.id)
		.then(data => res.send(data))
	 	.catch(err => res.status(400).json(err))

	})


	restaurantController.post('/photo', (req, res) => {
		dataLoader.getPhoto(req.body.reference)
		.then(data => res.send(data))
	 	.catch(err => res.status(400).json(err))		

	})

	restaurantController.post('/comment', onlyLoggedIn, (req, res) => {

		dataLoader.postComment(req.body.placeId, req.body.userId, req.body.comment)
		.then(data => res.send(data))
	 	.catch(err => res.status(400).json(err))

	// console.log(req.body.userId, "user in restaurant.js");
 //  	console.log(req.body.comment, "comment in restaurant.js");
 //  	console.log(req.body.placeId, "placeId in restaurant.js");
  		
  	});

	 


	return restaurantController;
}