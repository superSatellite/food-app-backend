"use strict";

let pkg 	= require("../package.json");

module.exports = {
	app: {
	},

	db: {
		options: {
      user: process.env.DB_USERNAME || 'nitebite',
      password: process.env.DB_PASSWORD || 'password321',
      database: process.env.DB_DATABASE || 'nitebite',
      host: process.env.DB_HOST || 'localhost'
		}
	}
};