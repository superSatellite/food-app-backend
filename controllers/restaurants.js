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

		dataLoader.postComment({
			userId: req.user.users_id,
			comment: req.body.comment,
			placeId: req.body.placeId
		})
		.then(data => res.status(201).json(data[0]))
    	.catch(err => res.status(400).json(err));
  	});


	restaurantController.get('/comment/:placeId', (req, res) => {

		dataLoader.getComment(req.params.placeId)
		.then(data => res.status(201).json(data))
    	.catch(err => res.status(400).json(err));
  	});


	return restaurantController;
}