var fs = require('fs'),
    _ = require('lodash'),
    Dispatcher = require('./dispatcher.js'),
    Watcher = require('./watcher.js'),
    helpers = require('./helpers.js');

// Unpacking helpers
var read = helpers.read,
    write = helpers.write,
    mkdir = helpers.mkdir,
    remove = helpers.remove;

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

Revised patch object:
  {
    method: create/update/delete,
    path: dir/subdir/id (filepath without type),
    data: object (will be json stringified) or string
  }

Watching:

There are some gains and drawbacks from using the watch.
The main benefit is that we can easily detect changes in the file system
when they occur. Some drawbacks are managing which files are watched; need to
add any new files to be watched or unwatch deleted files.

  * Can watch detect when new files are added?

There are also limitations to how many files can be watched at a time. These
limitations are sometimes at an OS level with some way of allowing the user to
specify size.

It may be more robust to do a recursive directory sweep each time. The issue
here is that it would involve a bit more work to determine whether a file has
changed.

  * Can we obtain a file's timestamp? Possibly can use this as an indicator.
    -> Possible to track the last modified time as well as the time
        last accessed.

Working plan:

Create a map of each file path plus the last accessed time. The start should be
an empty map. (mapA)

Create a new map each loop. (mapB)

Recursively read the directory. As each file is accessed:
  if it doesn't exist in mapA -> rename method (creation)
  if the access time is earlier than the modified time -> change method
  Add the file and access time to mapB and remove it from mapA.

Re-iterate through the values in mapA. These are the files that have been deleted.s
*/

var Files = module.exports = function (path) {
  Dispatcher.call(this);
  this.path = path;

  // queues
  this.patches = [];
  this.watches = [];

  this.watcher = new Watcher(path);

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
  updateLoop.call(this);
}

function patchLoop () {
  if (!this._ready) return;
  var boundLoop = patchLoop.bind(this);

  if (this.patches.length) {
    // console.log('Streaming to filesystem...');
    var start = time = Date.now(),
        len = this.patches.length,
        aPatch;

    while (this.patches.length > 0 && time - start < 100) {
      aPatch = this.patches.shift();
      patchMethods[aPatch.method](aPatch, this.path, this.watches);
      time = Date.now();
      this.trigger('patch', aPatch);
    }
    // console.log((len - this.patches.length) + ' file(s) updated.');
  }

  setTimeout(boundLoop, 10);
}

function updateLoop () {
  if (!this._ready) return;
  var boundLoop = updateLoop.bind(this);

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

    if (promises.length) Promise.all(promises).then(trigger);
    // console.log((len - this.watches.length) + ' object(s) updated.');
  }

  setTimeout(boundLoop, 10);
}

/** Watching
  * --------
  */

function watch (root, watches) {
  this.watcher.check();
  watchLoop.call(this);
}

function watchLoop () {
  if (!this._ready) return;
  var boundLoop = watchLoop.bind(this);

  var watches = this.watches;
  var callback = function (method, path) {
    watches.push({
      method: method,
      filepath: path
    });
  };

  this.watcher.check(callback)
  setTimeout(boundLoop, 1000);
}

var watchMethods = {
  create: function (filepath) {
    var boundGet = getData.bind(this);
    return read(filepath).then(boundGet);
  },
  update: function (filepath) {
    var boundGet = getData.bind(this);
    return read(filepath).then(boundGet);
  },
  delete: function (filepath) {
    var boundRemove = removeData.bind(this);
    return Promise.resolve(boundRemove(filepath));
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
  else obj[childName] = contents; // just get the contents as a string
  return;
}

function removeData (filename) {
  var hierarchy = filename.replace(this.path + '/', '').split('/'),
      childName = splitFiletype(hierarchy.pop())[0];

  var obj = this._data;
  hierarchy.forEach(function (tier) {
    obj = obj[tier] || null;
  });
  if (obj !== null) delete obj[childName];
}

/** Patching
  * --------
  */

function patched(fileFn, dirFn, doWatch) {
  return function (ptch, basePath, watches) {
    var data = ptch.data,
        path = basePath + '/' + ptch.path,
        fn = fileFn;

    var onComplete = function () {
      if (doWatch) watch(path, watches);
    };

    if (data && typeof data != 'string') {
      data = JSON.stringify(data, null, 2);
      path += '.json';
    }

    if (!data && dirFn) fn = dirFn;

    fn(path, data).then(onComplete);
  }
}

var patchMethods = {
  'create': patched(write, mkdir, true),
  'update': patched(write),
  'delete': patched(remove)
};
