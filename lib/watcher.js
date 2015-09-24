var fs = require('fs'),
    _ = require('lodash'),
    read = require('./helpers.js').read;

function Watcher (path) {
  this.watched = {};
  this.path = path;
  this.check = this.check.bind(this);

  this.check();
}

Watcher.prototype.check = function (callback, pass) {
  var now = Date.now(),
      watched = this.watched,
      check = this.check,
      path = this.path,
      callback = callback || _.noop,
      onComplete = _.noop;

  var checkChildren = function (data) {
        var contents = data.contents;
        _.each(data.contents, function (filepath) {
          var fullpath = path + '/' + filepath,
              stats = fs.lstatSync(fullpath);

          if (!watched[fullpath]) // new
            callback('create', fullpath);

          if (watched[fullpath] < stats.mtime.getTime() + 1000) // no milliseconds
            callback('update', fullpath);

          pass[fullpath] = now;
          delete watched[fullpath];

          if (stats.isDirectory())
            return check(fullpath, callback, pass);
        });
      };

  if (!pass) { // top level watch
    pass = {};
    onComplete = function () {
      _.each(watched, function (deleted, fullpath) {
        callback('delete', fullpath);
      });
      this.watched = pass;
    }.bind(this);
  }

  return read(path)
      .then(checkChildren)
      .then(onComplete);
};

module.exports = Watcher;
