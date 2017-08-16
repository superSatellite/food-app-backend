var fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg',
  Promise: Promise // 'Promise' is the native constructor
});

// Express initialization
const app = express();

app.use(cors());
app.use(bodyParser.json());


app.post('/search', (req, res) => {

	var address = req.body.address;

	getLatLng(address)
	.then(LatLng => getRestaurants(LatLng))
	.then(data => res.send(data.results))
 	.catch(err => res.status(400).json(err));
})


function getLatLng(address) {
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


function getRestaurants(location) {

	var location = location.lat+","+location.lng;
	var radius = "1000";
	var types = "restaurant";
	var key = "AIzaSyCGHLFTTV-WaZ81ZXgOA2p9VOPuttiesWg";
	var openNow = false;

	var url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&types=${types}&openNow=false&key=${key}`;

	console.log(location, "= location")

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



// Start the server
app.listen(3001)


