var fs = require('fs'),
    expect = require('chai').expect,
    Watcher = require('../lib/watcher');

describe('a file watcher', function () {
  var watcher;
  var dataDir = __dirname + '/data';
  var file = dataDir + '/test';

  var cleanup = function (done) {
    var path = dataDir;
    var contents = fs.readdirSync(path);
    contents.forEach(function (file) {
      var filepath = path + '/' + file;
      if (fs.lstatSync(filepath).isDirectory())
        cleanPath(filepath);
      else fs.unlinkSync(filepath);
    });
    if (path !== dataDir) fs.rmdirSync(path);
    setTimeout(done, 200);
  };

  beforeEach(function (done) {
    cleanup(function () {
      watcher = new Watcher(dataDir);
      fs.writeFileSync(file, '123');
      watcher.check().then(function () { done(); });
    });
  });
  after(cleanup);

  it('calls the callback when a file is created', function (done) {
    var newFile = dataDir + '/new';
    var callback = function (method, path) {
          expect(method).to.equal('create');
          expect(path).to.equal(newFile);
          done();
        };

    fs.writeFileSync(newFile, '123');
    watcher.check(callback);
  });

  it('calls the callback when a file is updated', function (done) {
    var callback = function (method, path) {
          expect(method).to.equal('update');
          expect(path).to.equal(file);
          done();
        };
    fs.writeFileSync(file, '1234');
    watcher.check(callback);
  });

  it('calls the callback when a file is deleted', function (done) {
    var callback = function (method, path) {
          expect(method).to.equal('delete');
          expect(path).to.equal(file);
          done();
        };
    fs.unlinkSync(file);
    watcher.check(callback);
  });
});
