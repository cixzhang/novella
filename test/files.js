var fs = require('fs'),
    expect = require('chai').expect,
    Files = require('../lib/files'),
    Dispatcher = require('../lib/dispatcher');

describe('a files data manager', function () {

  var store, storeData, dispatch,
      dataDir = __dirname + '/data',
      folderData = {
            name: 'folder',
            path: dataDir + '/folder'
          };
      fileData = {
            name: 'test',
            typed: 'test.json',
            path: dataDir + '/test.json',
            data: 1
          };

  var cleanup = function (done) {
    cleanPath(dataDir);
    setTimeout(done, 200);
  };

  var cleanPath = function (path) {
    var contents = fs.readdirSync(path);
    contents.forEach(function (file) {
      var filepath = path + '/' + file;
      if (fs.lstatSync(filepath).isDirectory())
        cleanPath(filepath);
      else fs.unlinkSync(filepath);
    });
    if (path !== dataDir) fs.rmdirSync(path);
  }

  before(function () {
    dispatch = new Dispatcher();
    fs.writeFileSync(fileData.path, JSON.stringify(fileData.data));
  });

  beforeEach(function () {
    store = new Files(dataDir);
    storeData = store.data();
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
      expect(storeData).to.include.keys(fileData.name);
      done();
    });
  });

  describe('watches for file changes and', function () {

    before(cleanup);
    after(cleanup);

    it('adds new data when a new file is added', function (done) {
      var onReady = function () {
            fs.writeFileSync(fileData.path, JSON.stringify(fileData.data));
          },
          onUpdate = function () {
            expect(storeData[fileData.name]).to.equal(fileData.data);
            done();
          };

      dispatch.watch(store, 'ready', onReady);
      dispatch.watch(store, 'update', onUpdate);
    });

    it('adds new objects when a new directory is created with files', function (done) {
      var onReady = function () {
            fs.mkdirSync(folderData.path);
            fs.writeFileSync(folderData.path + '/' + fileData.typed, JSON.stringify(fileData.data));
          },
          onUpdate = function () {
            expect(storeData).to.include.keys(folderData.name);
            done();
          };

      dispatch.watch(store, 'ready', onReady);
      dispatch.watch(store, 'update', onUpdate);
    });

    it('updates data when a file is updated', function (done) {
      var newData = 2,
          onReady = function () {
            fs.writeFileSync(fileData.path, JSON.stringify(newData));
          },
          onUpdate = function () {
            expect(storeData[fileData.name]).to.equal(newData);
            done();

            fs.writeFileSync(fileData.path, JSON.stringify(fileData.data));
          };

      dispatch.watch(store, 'ready', onReady);
      dispatch.watch(store, 'update', onUpdate);
    });

    it('removes data when a file is removed', function (done) {
      var onReady = function () {
            fs.unlinkSync(fileData.path);
          },
          onUpdate = function () {
            expect(storeData).to.not.include.keys(fileData.name);
            done();
          };

      dispatch.watch(store, 'ready', onReady);
      dispatch.watch(store, 'update', onUpdate);
    });
  });

  describe('accepts data patches and', function () {

    before(cleanup);
    after(cleanup);

    it('creates folders when given a create patch without data', function (done) {
      var patch = {
            method: 'create',
            path: 'test'
          },
          onUpdate = function () {
            //expect(storeData).to.include.keys('test');
            done();
          };
      dispatch.watch(store, 'update', onUpdate);
      store.patch(patch);
    });

    it('creates files when given a create patch with data', function (done) {
      var patch = {
            method: 'create',
            path: 'test/1',
            data: {a: 1, b: 2}
          },
          onUpdate = function () {
            expect(storeData['test']).to.include.keys('1');
            //expect(storeData['test']['1']).to.equal(patch.data);
            done();
          };

      dispatch.watch(store, 'update', onUpdate);
      store.patch(patch);
    });
    it('updates files when given an update patch');
    it('deletes files when given a delete patch');
  });
});
