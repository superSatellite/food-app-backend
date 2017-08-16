const express = require('express');

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


	// Information for restaurants
	restaurantController.get('/:id', (req, res) => {

		console.log(req.params.id);
		dataLoader.getRestaurantsInfo(req.params.id)
		.then(data => res.send(data))
	 	.catch(err => res.status(400).json(err))

	})



	return restaurantController;
}