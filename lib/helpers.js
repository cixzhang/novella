var fs = require('fs');

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
  return new Promise(function (res, rej) {
    fs.writeFile(path, data, function (err) {
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

module.exports = {
  read: read,
  write: write,
  mkdir: mkdir,
  remove: remove
};
