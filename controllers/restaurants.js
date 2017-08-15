const express = require('express');

module.exports = (dataLoader) => {
  const restaurantController = express.Router();


// Search for a list of restaurants
restaurantController.post('/', (req, res) => {

	var address = req.body.address;
	dataLoader.getLatLng(address)
	.then(LatLng => dataLoader.getRestaurants(LatLng))
	.then(data => res.send(data.results))
 	.catch(err => res.status(400).json(err))
})

	return restaurantController;
}