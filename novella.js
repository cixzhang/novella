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

var //_ = require('lodash'),
    //Promise = require('promise'),
    //app = require('express')(),
    //http = require('http').Server(app),
    //io = require('socket.io')(http),
    Dispatcher = require('./dispatcher.js'),
    Files = require('./files');

var Novella = function () {
  Dispatcher.call(this);
  this.store = new Files('./data');
  this.watch(this.store, 'ready', onReady.bind(this));
};

function onReady () {
  console.log(this.store.data());
};

module.exports = new Novella();
