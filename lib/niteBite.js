const fetch = require('node-fetch');

// Google Api
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg',
  Promise: Promise
});


class NiteBiteDataLoader {


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


	getRestaurants(location) {

		var location = location.lat+","+location.lng;
		var radius = "1000";
		var types = "restaurant";
		var key = "AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg";
		var openNow = false;

		console.log(location, "= location")

		var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&types=${types}&openNow=false&key=${key}`;


		return(
			fetch(url)
			.then(response => response.json())
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

}

module.exports = NiteBiteDataLoader;
