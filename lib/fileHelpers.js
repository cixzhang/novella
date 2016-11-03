var fs = require('fs');
var path = require('path');
var lwip = require('lwip');
var natSort = require('natural-compare');

function promisify(fn) {
  return (...args) =>
    new Promise((res, rej) => {
      args.push((error, data) => {
        if (error) rej(error);
        else res(data);
      });

      fn.apply(this, args);
    });
}

function check(filepath) {
  return promisify(fs.access)(filepath, fs.R_OK)
    .then(() => fs.lstatSync(filepath))
    .catch(() => {
      throw new Error(`[ERROR]: ${filepath} could not be accessed.`);
    });
}

function stat(filepath) {
  return fs.lstatSync(filepath);
}

function statImage(filepath) {
  return readImage(filepath)
    .then(image => [image.width(), image.height()]);
}

function read(filepath) {
  var name = path.basename(filepath);
  var fn = (path, cb) => fs.readFile(path, { encoding: 'utf8' }, cb);

  return check(filepath).then((stat) => {
    if (stat.isDirectory()) fn = fs.readdir.bind(fs);

    return promisify(fn)(filepath)
      .then((contents) => {
        if (stat.isDirectory()) contents = contents.sort(natSort);
        return { contents, filepath, name };
      });
  });
}

function readImage(filepath) {
  return promisify(lwip.open)(filepath);
}

function write(path, data) {
  return promisify(fs.writeFile)(path, data, { encoding: 'utf8' });
}

function writeImage(path, image) {
  return promisify((...args) => image.writeFile(...args))(path);
}

function mkdir(path) {
  return promisify(fs.mkdir)(path);
}

function remove(path) {
  function unlink(path) {
    return promisify(fs.unlink)(path);
  }

  function rmdir(path) {
    return promisify(fs.rmdir)(path);
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
  readImage,
  write,
  writeImage,
  mkdir,
  remove,
};
