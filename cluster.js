const throng = require('throng');
const WORKERS = process.env.WEB_CONCURRENCY || 4;

throng({
  workers: WORKERS,
  master: startMaster,
  start: startWorker
});

// This will only be called once
function startMaster() {
  console.log('Started master');
}

function startWorker(id) {
  require("./index.js");
}



