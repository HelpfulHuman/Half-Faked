const expect = require('chai').expect;
const stub = require('sinon').stub;
const createFactory = require('../dist/index.js');

describe('dist', function () {

  it('runs as expected when compiled', function () {
    const obj = { a: 1, b: 2 };
    const fn = stub().returns(obj);
    const fac = createFactory(fn);

    expect(fac).to.be.a('function');
    expect(fac()).to.deep.equal(obj);
    expect(fac(1)).to.deep.equal([ obj ]);
    expect(fac(3)).to.deep.equal([ obj, obj, obj ]);
  });

});
