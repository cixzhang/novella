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

 [filesystem]   ->[*Data]    ->[Novella]   ->[UI]
      ^                           |
      |                           v
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

  // queues
  this.patches = [];
  this.watches = [];

  this._ready = null;
  this._data = {};

  this.ready()
      .then(watch.bind(this))
      .then(loop.bind(this));
  return this;
};

Files.prototype.data = function () { return this._data; }

Files.prototype.ready = function () {
  var doTrigger = function () { this.trigger('ready'); }.bind(this),
      logError = function (e) { console.log(e); };

  if (!this._ready) this._ready = read(this.path).then(getData.bind(this), logError);
  return this._ready.then(doTrigger);
}

Files.prototype.patch = function (patches) {
  if (patches instanceof Array)
    while (patches.length) this.patches.push(patches.unshift());
  else this.patches.push(patches);
  return this;
}

Files.prototype.teardown = function () {
  this._ready = null;
}

/** Private loops
  * -------------
  */

function loop () {
  patchLoop.call(this);
  watchLoop.call(this);
}

function patchLoop () {
  var boundLoop = patchLoop.bind(this);

  if (this.patches.length) {
    // console.log('Streaming to filesystem...');
    var start = time = Date.now(),
        len = this.patches.length,
        aPatch;

    while (this.patches.length > 0 && time - start < 100) {
      aPatch = this.patches.shift();
      patchMethods[aPatch.method](aPatch, this.path);
      time = Date.now();
    }
    // console.log((len - this.patches.length) + ' file(s) updated.');
  }

  if (this._ready) setTimeout(boundLoop, 10);
}

function watchLoop () {
  var boundLoop = watchLoop.bind(this);

  if (this.watches.length) {
    // console.log('Updating data...');
    var trigger = function () { this.trigger('update'); }.bind(this),
        start = time = Date.now(),
        len = this.watches.length,
        promises = [],
        aWatch;

    while (this.watches.length > 0 && time - start < 100) {
      aWatch = this.watches.shift();
      promises.push(watchMethods[aWatch.method].call(this, aWatch.filepath));
      time = Date.now();
    }

    Promise.all(promises).then(trigger);
    // console.log((len - this.watches.length) + ' object(s) updated.');
  }

  if (this._ready) setTimeout(boundLoop, 10);
}

/** Watching
  * --------
  */

function watch (root) {
  root = root || this.path;

  var trigger = this.trigger.bind(this),
      watches = this.watches,
      callback = function (method, filename, path) {
        watches.push({
          method: method,
          filepath: path + '/' + filename
        });
      };

  rewatch(root, callback);
}

function rewatch (path, callback) { // recursive watch
  fs.watch(path, function (event, filename) {
    callback(event, filename, path);
  });

  read(path).then(function (data) {
    var contents = data.contents;
    _.each(data.contents, function (filepath) {
      if (fs.lstatSync(path + '/' + filepath).isDirectory())
        rewatch(path + '/' + filepath, callback);
    });
  });
}

var watchMethods = {
  rename: function (filepath) {
    var boundGet = getData.bind(this),
        boundRemove = removeData.bind(this);

    try {
      var promise = read(filepath).then(boundGet);
      if (fs.lstatSync(filepath).isDirectory())
        promise.then(function () { watch(filepath); });
      return promise;
    }
    catch (e) { return Promise.resolve(boundRemove(filepath)); }
  },
  change: function (filepath) {
    var boundGet = getData.bind(this);
    return read(filepath).then(boundGet);
  }
}

/** Data Ingestion
  * --------------
  */

function splitFiletype (filename) {
  var parts = filename.split('.');
  var type = parts.pop();
  return [parts.join('.'), type];
}

function getData (data) {
  var contents = data.contents,
      filename = data.file,
      bound = getData.bind(this);

  if (contents instanceof Array) {
    var promises = _.map(contents, function (file) {
      return read(filename + '/' + file).then(bound);
    });
    return Promise.all(promises);
  }

  var hierarchy = filename.replace(this.path + '/', '').split('/'),
      child = splitFiletype(hierarchy.pop()),
      childName = child[0], childType = child[1];

  var obj = this._data;
  hierarchy.forEach(function (tier) {
    if (!obj[tier]) obj[tier] = {};
    obj = obj[tier];
  });
  if (childType == 'json') obj[childName] = JSON.parse(contents);
  else obj[childName] = filename;
  return;
}

function removeData (filename) {
  var hierarchy = filename.replace(this.path + '/', '').split('/'),
      childName = splitFiletype(hierarchy.pop())[0];

  var obj = this._data;
  hierarchy.forEach(function (tier) {
    obj = obj[tier];
  });
  delete obj[childName];
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

var patchMethods = {
  'create': patched(write),
  'update': patched(write),
  'delete': patched(remove)
};

/** CRUD
  * ----
  */

function read (filepath) {
  var fn = fs.readFile.bind(fs);
  if (fs.lstatSync(filepath).isDirectory()) fn = fs.readdir.bind(fs);
  return new Promise(function (res, rej) {
    fn(filepath, function (err, data) {
      if (err) rej({error: err, file: filepath});
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

  if (fs.lstatSync(path).isDirectory())
    return mkdir(path);
  else return writeFile(path, data);
}

function remove (path) {
  function unlink (path) {
    return new Promise(function (res, rej) {
      fs.unlink(path, function (err) {
        if (err) rej(err);
        else res();
      });
    });
  }

  function rmdir (path) {
    return new Promise(function (res, rej) {
      fs.rmdir(path, function (err) {
        if (err) rej(err);
        else res();
      });
    });
  }

  if (fs.lstatSync(path).isDirectory())
    return rmdir(path);
  else return unlink(path, data);
}
