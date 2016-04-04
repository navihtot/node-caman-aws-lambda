var Caman    = require('./dist/caman').Caman;
var async    = require('async');
var imagePath = 'output.jpg';

async.whilst(
  function() {
    return true;
  },
  function(callback) {
    Caman(imagePath, function () {
      console.log(process.memoryUsage());
      setTimeout(callback,1500);
    });
  },
  function () {}
);
