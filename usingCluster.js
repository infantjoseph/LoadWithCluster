var cluster = require('cluster');  
var crypto = require('crypto');  
var express = require('express');  
var sleep = require('sleep');  
var numCPUs = require('os').cpus().length;
const http = require('http');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
    var app = express();
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  app.get('/', function (req, res) {
        // Simulate route processing delay
        var randSleep = Math.round(10000 + (Math.random() * 10000));
        sleep.usleep(randSleep);

        var numChars = Math.round(5000 + (Math.random() * 5000));
        var randChars = crypto.randomBytes(numChars).toString('hex');
        res.send(randChars);
    }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}