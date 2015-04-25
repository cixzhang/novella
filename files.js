var fs = require('fs'),
    _ = require('lodash'),
    Promise = require('promise'),
    Dispatcher = require('./dispatcher.js');

/**
  [x] var files = new Files(path); -> initialize, calls ready(), creates promise
  [.] files.ready().then(...); -> ready() returns already created promise

  listenTo(files, 'update', function () {...}); -> listen for changes to files
  [.] // trigger update each patch queue

  [x] files.patch(...); // files module will manage the data
  [x] files.data(); // get data object

  Data Flow:

  * - part of Files

 [filesystem]   ->[*Data]   ->[Novella]   ->[UI]
      ^              |            |
      |              v            v
      -----------[*Queue]<-----[*patch]

Patch Object:
  {
    method: create/update/delete(/move?),
    type: object class,
    id: id, also used as filename,
    data: null or some object
  }
*/

var Files = module.exports = function (path) {
  Dispatcher.call(this);
  this.path = path;
  this.queue = [];

  this._ready = null;
  this._data = {};

  var _loop = loop.bind(this),
      _watch = watch.bind(this);

  this.ready().then(_watch).then(_loop);
  return this;
};

Files.prototype.data = function () { return this._data; }

Files.prototype.ready = function () {
  var trigger = function () { this.trigger('ready'); }.bind(this),
      logError = function (e) { console.log(e); },
      getData = function (data, filename) {
          var contents = data.contents,
              filename = data.file;

          if (contents instanceof Array) {
            var promises = _.map(contents, function (file) {
              return read(filename + '/' + file).then(getData, logError);
            });
            return Promise.all(promises);
          }

          var hierarchy = filename.replace(this.path, '').split('/'),
              child = hierarchy.pop().replace('.json', ''),
              parent = hierarchy.pop();

          if (parent) {
            this._data[parent] = this._data[parent] || {};
            this._data[parent][child] = JSON.parse(contents);
          } else this._data[child] = JSON.parse(contents);
        }.bind(this);

  if (!this._ready) this._ready = read(this.path).then(getData, logError);
  return this._ready.then(trigger);
}

Files.prototype.patch = function (patches) {
  if (patches instanceof Array)
    while (patches.length) this.queue.push(patches.unshift());
  else this.queue.push(patches);
  return this;
}

/** Private functions
  * -----------------
  */

function loop () {
  var boundLoop = loop.bind(this);
  if (!this.queue.length) return;

  console.log('Streaming to filesystem...');
  var start = time = Date.now(),
      len = this.queue.length;
  while (this.queue.length > 0 && time - start < 100) {
    patch(this.queue.shift(), this.path);
    time = Date.now();
  }
  console.log((len - this.queue.length) + 'patches done.');

  setTimeout(boundLoop, 10000);
}

function watch () {
  // TODO
  fs.watch(this.path, function (event, filename) {
    console.log(arguments);
  });
}

/** CRUD
  * ----
  */

function read (filepath) {
  var fn = fs.readFile.bind(fs);
  if (fs.lstatSync(filepath).isDirectory()) fn = fs.readdir.bind(fs);
  return new Promise(function (res, rej) {
    fn(filepath, function (err, data) {
      if (err) rej(err);
      else res({contents: data, file: filepath}); // res only accepts one arg
    });
  });
}

function write (path, data) {
  function writeFile (filename, data) {
    return new Promise(function (res, rej) {
      fs.writeFile(filename, data, function (err) {
        if (err) rej(err);
        else res();
      });
    });
  }

  function mkdir (path) {
    return new Promise(function (res, rej) {
      fs.mkdir(path, function (err) {
        if (err) rej(err);
        else res();
      });
    });
  }

  if (path.substring(path.length - 5) === '.json')
    return writeFile(path, data);
  else return mkdir(path);
}

function unlink (path) {
  return new Promise(function (res, rej) {
    fs.unlink(path, function (err) {
      if (err) rej(err);
      else res();
    });
  });
}


/** Patching
  * --------
  */

function patched(fn) {
  return function (ptch, dataPath) {
    var typePath = ptch.type && ptch.type + '/' || '',
      idPath = ptch.id && ptch.id + '.json' || '',
      path = dataPath + '/' + typePath + idPath,
      data = JSON.stringify(ptch.data, null, 2);
    return fn(path, data);
  }
}

var methods = {
  'create': patched(write),
  'update': patched(write),
  'delete': patched(unlink)
};

function patch (ptch, path) { methods[ptch.method](ptch, path); }
