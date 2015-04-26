var fs = require('fs'),
    expect = require('chai').expect,
    dataDir = __dirname + '/data';

describe('a files data manager', function () {

  var Files = require('../files'),
      dispatch = new require('../dispatcher')(),
      store;

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
      expect(store.data()).to.include.keys('test');
      done();
    });
  });

  it('can add new data when a new file is added', function (done) {
    var data = 2,
        path = __dirname + '/data/new.json',
        onReady = function () {
          fs.writeFileSync(path, JSON.stringify(data));
        },
        onUpdate = function () {
          expect(store.data()).to.include.keys('new');
          done();
        };

    dispatch.watch(store, 'ready', onReady);
    dispatch.watch(store, 'update', onUpdate);

    after(function () { fs.unlink(path); });
  });

  it('can remove data when a file is removed', function (done) {
    var data = 2,
        path = __dirname + '/data/new.json',
        onReady = function () {
          fs.unlinkSync(path);
        },
        onUpdate = function () {
          expect(store.data()).to.not.include.keys('new');
          done();
        };

    fs.writeFileSync(path, JSON.stringify(data));
    dispatch.watch(store, 'ready', onReady);
    dispatch.watch(store, 'update', onUpdate);
  });

  it('can update data when a file is updated', function (done) {
    var data = 2,
        path = __dirname + '/data/test.json',
        onReady = function () {
          fs.writeFileSync(path, JSON.stringify(data));
        },
        onUpdate = function () {
          expect(store.data().test).to.equal(data);
          done();
        };

    dispatch.watch(store, 'ready', onReady);
    dispatch.watch(store, 'update', onUpdate);

    after(function () { fs.writeFileSync(path, JSON.stringify(1)); });
  });
});
