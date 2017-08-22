const express = require('express');
const cors = require('cors');
const mysql = require('promise-mysql');
var cluster = require('cluster'); //no need to download anything
var os = require('os'); //no need to download anything

// config loading..
let config		= require("./config");

if(cluster.isMaster) {
  var numWorkers = os.cpus().length;
  console.log('Master cluster setting up ' + numWorkers + ' workers...');

  for(var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });
}
else
require("./index.js");