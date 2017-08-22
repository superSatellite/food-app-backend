"use strict";

let path 	= require("path");
let fs 		= require("fs");
let _ 		= require("lodash");

global.rootPath = path.normalize(path.join(__dirname, "..", ".."));
// console.log("process.argv: " + process.argv);
console.log("Application root path: " + global.rootPath);

module.exports = {

	isDevMode() {
		return !process.env.NODE_ENV || process.env.NODE_ENV === "development";
	}, 

	isProductionMode() {
		return process.env.NODE_ENV === "production";
	},

	isTestMode() {
		return process.env.NODE_ENV === "test";
	}
};

// Load external configuration if exists `config.js`
let externalConfig = {};

let baseConfig = require("./base");

let config = {};
if (module.exports.isTestMode()) {
	console.log("Load test config...");
	config = require("./test");
	// In test mode, we don't use the external config.js file
	externalConfig = {};
}
else if (module.exports.isProductionMode()) {
	console.log("Load production config...");
	config = require("./prod");
}

module.exports = _.defaultsDeep(externalConfig, config, baseConfig, module.exports);

