"use strict";

let pkg 	= require("../package.json");

module.exports = {
	app: {
	},

	db: {
		options: {
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'nitebite',
      host: process.env.DB_HOST || 'localhost'
		}
	}
};