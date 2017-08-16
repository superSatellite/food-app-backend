const fetch = require('node-fetch');

// Google Api
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg',
  Promise: Promise
});

var key = "AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg";


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


	getRestaurants(locationObj) {

		var location = locationObj.lat+","+locationObj.lng;
		var radius = "1000";
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


}

module.exports = NiteBiteDataLoader;
