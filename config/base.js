"use strict";

let path = require("path");
let pkg = require("../package.json");

module.exports = {
  app: {
    title: pkg.title,
    version: pkg.version,
    description: pkg.description,
    url: "http://localhost:" + (process.env.PORT || 3000) + "/",
    //googleAnalyticsID: 'UA-xxxxx-x',
    contactEmail: "something@decodemtl.com"
  },

  ip: process.env.NODE_IP || "0.0.0.0",
  port: process.env.PORT || 3001,

  rootPath: global.rootPath,

  test: false,

  db: {
    options: {
      user: "nitebite",
      password: "password321",
      database: 'nitebite',
      host: 'localhost'
    }
  }
};