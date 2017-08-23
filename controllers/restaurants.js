const express = require('express');
const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const restaurantController = express.Router();

	// Search for a list of restaurants
	restaurantController.post('/search', (req, res) => {
		console.log(req.body.load_more, "load more in search")
		if(req.body.load_more){
			console.log(res.body, "res.body in search")
			return dataLoader.getMoreRestaurants(req.body.load_more)
			.then(data => res.send(data))
			.catch(err => res.status(400).json(err)) 
		} 
		else {
			var address = req.body.address;
			dataLoader.getLatLng(address)
			.then(LatLng => dataLoader.getRestaurants(LatLng))
			.then(data => res.send(data))
		 	.catch(err => res.status(400).json(err))
		}
	})


	// Search for next page of restaurants
	restaurantController.post('/searchMore', (req, res) => {
		return dataLoader.getMoreRestaurants(req.body.next_page_token)
		.then(data => res.status(201).json(data))
		.catch(err => res.status(400).json(err)) 
	})

	//get user's address from latlng 
	restaurantController.post('/location', (req, res) => {
		var latlng = req.body.latlng;
		dataLoader.getAddressFromLatLng(latlng)
		.then(data => res.send(data))
	 	.catch(err => res.status(400).json(err))
	})


	// Information for restaurants
	restaurantController.get('/:id', (req, res) => {
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