// {
//   "title": "Some Page Title",
//   "description": "Some description.",
//   "uploaded": "4/5/2015, 1:15:25 PM", // auto
//   "image": "someimage.png"
// }

// corroborate data and fs
// on startup:
//  fs -> data
// on occasion:
//  data -> fs (streaming possible)
// We can divide the server into these parts:
// 1. a manager than ensures the data and fs match up
//    - we need to make sure this is the case before shut down
// 2. an api server that allows the client to CRUD
// 3. a manager that periodically saves the fs to git

var _ = require('lodash'),
    express = require('express'),
    Dispatcher = require('./lib/dispatcher.js'),
    Files = require('./lib/files');

var Novella = function () {
  Dispatcher.call(this);
  this.store = new Files('./data');
  this.watch(this.store, 'ready', onReady.bind(this));
  this.watch(this.store, 'update', onUpdate.bind(this));
};

Novella.prototype.start = function () {
  var app = this.app = express();

  app.get('/', function (req, res) {
    res.send('Hello World');
  });

  var server = this.server = this.app.listen(3000, function () {
    var port = server.address().port;
    console.log('Novella CMS listening at http://localhost:%s', port);
  });
};


// Anonymous event handlers
function onReady () {
  var data = this.store.data();
  console.log(data);
}

function onUpdate () {
  console.log(data);
}


// Start application
var novella = new Novella();
novella.start();
