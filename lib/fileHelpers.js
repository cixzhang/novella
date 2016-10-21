var fs = require('fs');
var path = require('path');

function check(filepath) {
  return new Promise((res, rej) => {
    fs.access(filepath, fs.R_OK, (err) => {
      if (err) rej(`[ERROR]: ${filepath} could not be accessed.`);
      else res(fs.lstatSync(filepath));
    });
  });
}

function read(filepath) {
  var fn = fs.readFile.bind(fs);

  return check(filepath).then((stat) => {
    if (stat.isDirectory) fn = fs.readdir.bind(fs);

    return new Promise(function (res, rej) {
      fn(filepath, function (error, contents) {
        var name = path.basename(filepath);
        if (error) rej({ error, filepath });
        else res({ contents, filepath, name });
      });
    });
  });
}

function write(path, data) {
  return new Promise(function (res, rej) {
    fs.writeFile(path, data, function (err) {
      if (err) rej(err);
      else res();
    });
  });
}

function mkdir(path) {
  return new Promise(function (res, rej) {
    fs.mkdir(path, function (err) {
      if (err) rej(err);
      else res();
    });
  });
}

function remove(path) {
  function unlink(path) {
    return new Promise(function (res, rej) {
      fs.unlink(path, function (err) {
        if (err) rej(err);
        else res();
      });
    });
  }

  function rmdir(path) {
    return new Promise(function (res, rej) {
      fs.rmdir(path, function (err) {
        if (err) rej(err);
        else res();
      });
    });
  }

  return check(path).then((stat) => {
    if (stat.isDirectory())
      return rmdir(path);
    else return unlink(path);
  });
}

module.exports = {
  read: read,
  write: write,
  mkdir: mkdir,
  remove: remove
};
