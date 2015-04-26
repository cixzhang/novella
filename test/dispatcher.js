var expect = require('chai').expect,
    Dispatcher = require('../lib/dispatcher');

describe('a dispatcher', function () {

  var dispatchA, dispatchB;

  var e = 'boom';
      originalVal = val = 1,
      callback = function (v) { val = v; };

  before(function () {
    dispatchA = new Dispatcher();
    dispatchB = new Dispatcher();
  });

  beforeEach(function () {
    val = 1;
  });

  it('can trigger events', function () {
    expect(dispatchA.trigger).to.exist;
    expect(dispatchA.trigger).to.be.a('function');
  });

  it('can call a callback when triggered', function () {
    dispatchA.on(e, callback);
    dispatchA.trigger(e, 2);
    expect(val).to.equal(2);
  });

  it('can remove a callback from being triggered', function () {
    dispatchA.off(e, callback);
    dispatchA.trigger(e, 2);
    expect(val).to.equal(originalVal);
  });

  it('can watch another dispatcher', function () {
    dispatchB.watch(dispatchA, e, callback);
    dispatchA.trigger(e, 3);
    expect(val).to.equal(3);
  });

  it('can unwatch another dispatcher', function () {
    dispatchB.unwatch(dispatchA, e, callback);
    dispatchA.trigger(e, 3);
    expect(val).to.equal(originalVal);
  });

});
