var _ = require('lodash');

var Dispatcher = module.exports = function () {
  var events = {},
      watching = {},
      id = _.uniqueId('d');

  this._wId = id;
  this.trigger = trigger;
  this.on = on;
  this.off = off;
  this.watch = watch;
  this.unwatch = unwatch;

  function trigger (event, data) {
    if (!events[event]) return;

    events[event].forEach(function (callback) {
      callback(data);
    });
  }

  function on (event, callback) {
    if (!events[event]) events[event] = [];
    events[event].push(callback);
  }

  function off (event, callback) {
    if (events[event]) {
      var index = events[event].indexOf(callback);
      if (index > -1) events[event].splice(index, 1);
    }
  }

  function watch (watched, event, callback) {
    var wId = watched._wId;
    if (!watching[wId]) watching[wId] = {};
    if (!watching[wId][event]) watching[wId][event] = [];
    watching[wId][event].push(callback);
    watched.on(event, callback);
  }

  function unwatch (watched, event, callback) {
    var wId = watched._wId;
    if (!watching[wId]) return;

    if (typeof event === 'undefined') {
      var events = Object.keys(watching[wId]);
      events.forEach(function (event) {
        while (watching[wId][event].length) {
          var callback = watching[wId][event].pop();
          watched.off(event, callback);
        }
      });
      return;
    }

    var callbacks = watching[wId][event];
    if (typeof callback === 'undefined' && callbacks) {
      while (callbacks.length) {
        var callback = callbacks.pop();
        watched.off(event, callback);
      }
    } else {
      var index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
      watched.off(event, callback);
    }
  }
}
