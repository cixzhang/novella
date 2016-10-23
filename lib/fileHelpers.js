var fs = require('fs');
var path = require('path');
var lwip = require('lwip');
var natSort = require('natural-compare');

function check(filepath) {
  return new Promise((res, rej) => {
    fs.access(filepath, fs.R_OK, (err) => {
      if (err) rej(`[ERROR]: ${filepath} could not be accessed.`);
      else res(fs.lstatSync(filepath));
    });
  });
}

function stat(filepath) {
  return fs.lstatSync(filepath);
}

function statImage(filepath) {
  return new Promise((res, rej) => {
    lwip.open(filepath, (error, image) => {
      if (error) rej(error);
      res([image.width(), image.height()]);
    });
  });
}

function read(filepath) {
  var fn = (path, cb) => fs.readFile(path, { encoding: 'utf8' }, cb);

  return check(filepath).then((stat) => {
    if (stat.isDirectory()) fn = fs.readdir.bind(fs);

    return new Promise((res, rej) => {
      fn(filepath, (error, contents) => {
        var name = path.basename(filepath);
        if (error) rej(error);
        else {
          if (stat.isDirectory()) contents = contents.sort(natSort);
          res({ contents, filepath, name });
        }
      });
    });
  });
}

function write(path, data) {
  return new Promise((res, rej) => {
    fs.writeFile(path, data, { encoding: 'utf8' },
      (err) => {
        if (err) rej(err);
        else res();
      }
    );
  });
}

function mkdir(path) {
  return new Promise((res, rej) => {
    fs.mkdir(path, (err) => {
      if (err) rej(err);
      else res();
    });
  });
}

function remove(path) {
  function unlink(path) {
    return new Promise((res, rej) => {
      fs.unlink(path, (err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  function rmdir(path) {
    return new Promise((res, rej) => {
      fs.rmdir(path, (err) => {
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
  check,
  stat,
  statImage,
  read,
  write,
  mkdir,
  remove,
};
