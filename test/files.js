var fs = require('fs'),
    expect = require('chai').expect,
    Files = require('../lib/files'),
    Dispatcher = require('../lib/dispatcher');

describe('a files data manager', function () {

  var store, dispatch,
      dataDir = __dirname + '/data',
      fileData = {
            name: 'test',
            file: dataDir + '/test.json',
            data: 1
          };

  var cleanup = function () {
        var contents = fs.readdirSync(dataDir);
        contents.forEach(function (file) {
          fs.unlinkSync(dataDir + '/' + file);
        });
      };

  before(function () {
    dispatch = new Dispatcher();
    fs.writeFileSync(fileData.file, JSON.stringify(fileData.data));
  });

  beforeEach(function () {
    store = new Files(dataDir);
  });

  afterEach(function () {
    dispatch.unwatch(store);
    store.teardown();
  });

  it('can be watched', function (done) {
    dispatch.watch(store, 'ready', done);
  });

  it('initializes with data from a directory', function (done) {
    dispatch.watch(store, 'ready', function () {
      expect(store.data()).to.include.keys(fileData.name);
      done();
    });
  });

  describe('watches for file changes and', function () {

    before(cleanup);
    after(cleanup);

    it('adds new data when a new file is added', function (done) {
      var onReady = function () {
            fs.writeFileSync(fileData.file, JSON.stringify(fileData.data));
          },
          onUpdate = function () {
            expect(store.data()).to.include.keys(fileData.name);
            done();
          };

      dispatch.watch(store, 'ready', onReady);
      dispatch.watch(store, 'update', onUpdate);
    });

    it('updates data when a file is updated', function (done) {
      var newData = 2,
          onReady = function () {
            fs.writeFileSync(fileData.file, JSON.stringify(newData));
          },
          onUpdate = function () {
            expect(store.data()[fileData.name]).to.equal(newData);
            done();

            fs.writeFileSync(fileData.file, JSON.stringify(fileData.data));
          };

      dispatch.watch(store, 'ready', onReady);
      dispatch.watch(store, 'update', onUpdate);
    });

    it('removes data when a file is removed', function (done) {
      var onReady = function () {
            fs.unlinkSync(fileData.file);
          },
          onUpdate = function () {
            expect(store.data()).to.not.include.keys(fileData.name);
            done();
          };

      dispatch.watch(store, 'ready', onReady);
      dispatch.watch(store, 'update', onUpdate);
    });
  });

  describe('accepts data patches and', function () {

    before(cleanup);
    after(cleanup);

    it('creates files when given a create patch');
    it('updates files when given an update patch');
    it('deletes files when given a delete patch');
  });
});
