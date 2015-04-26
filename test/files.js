var fs = require('fs'),
    expect = require('chai').expect,
    Files = require('../lib/files'),
    Dispatcher = require('../lib/dispatcher');

describe('a files data manager', function () {

  var dataDir = __dirname + '/data',
      fileA = __dirname + '/data/A.json',
      fileB = __dirname + '/data/B.json',
      dataA = 1,
      dataB = 2,
      store, dispatch;

  before(function () {
    dispatch = new Dispatcher();
    fs.writeFileSync(fileA, JSON.stringify(dataA));
  });

  beforeEach(function () {
    store = new Files(dataDir);
  });

  afterEach(function () {
    dispatch.unwatch(store);
    store.teardown();
  });

  it('can exist', function () {
    expect(store).to.exist;
  });

  it('can be watched', function (done) {
    dispatch.watch(store, 'ready', done);
  });

  it('can read data from a directory', function (done) {
    dispatch.watch(store, 'ready', function () {
      expect(store.data()).to.include.keys('A');
      done();
    });
  });

  it('can add new data when a new file is added', function (done) {
    var onReady = function () {
          fs.writeFileSync(fileB, JSON.stringify(dataB));
        },
        onUpdate = function () {
          expect(store.data()).to.include.keys('B');
          done();
        };

    dispatch.watch(store, 'ready', onReady);
    dispatch.watch(store, 'update', onUpdate);

    after(function () { fs.unlink(dataB); });
  });

  it('can remove data when a file is removed', function (done) {
    var onReady = function () {
          fs.unlinkSync(dataB);
        },
        onUpdate = function () {
          expect(store.data()).to.not.include.keys('B');
          done();
        };

    fs.writeFileSync(fileB, JSON.stringify(dataB));
    dispatch.watch(store, 'ready', onReady);
    dispatch.watch(store, 'update', onUpdate);
  });

  it('can update data when a file is updated', function (done) {
    var newData = 2,
        onReady = function () {
          fs.writeFileSync(fileA, JSON.stringify(newData));
        },
        onUpdate = function () {
          expect(store.data().A).to.equal(newData);
          done();
        };

    dispatch.watch(store, 'ready', onReady);
    dispatch.watch(store, 'update', onUpdate);

    after(function () { fs.writeFileSync(fileA, JSON.stringify(dataA)); });
  });
});
