import { expect } from 'chai';
import { stub } from 'sinon';
import { createFactory } from '../src/utils';

describe('createFactory', function () {

  var r, fn, t1, t2, t3;

  beforeEach(function () {
    r = Math.random();
    fn = stub().returns(r);
    t1 = createFactory([ fn, fn, fn ]);
    t2 = createFactory({ a: 2, b: fn });
    t3 = createFactory(() => { return { a: fn, b: 2 }; });
  });

  it('creates a factory function using the given schema', function () {
    expect(t1).to.be.a('function');
    expect(t2).to.be.a('function');
    expect(t3).to.be.a('function');
  });

  describe('make(1)', function () {

    it('creates a single item if no count is supplied', function () {
      expect(t1()).to.deep.equal([ r, r, r ]);
      expect(t2()).to.deep.equal({ a: 2, b: r });
      expect(t3()).to.deep.equal({ a: r, b: 2 });
    });

    it('creates a single item if no count is supplied and applies the provided modifier to it', function () {
      expect(t1(null, v => {
        return v.map(rv => rv + 5);
      })).to.deep.equal([ r + 5, r + 5, r + 5 ]);

      expect(t2(null, v => {
        return { a: 5, b: v.b + 5 };
      })).to.deep.equal({ a: 5, b: r + 5 });

      expect(t3(null, v => {
        return { a: v.a + 5, b: 5 };
      })).to.deep.equal({ a: r + 5, b: 5 });
    });

  });

  describe('make(n)', function () {

    it('returns an array with one item if a count of 1 is supplied', function () {
      expect(t1(1)).to.deep.equal([ [ r, r, r ] ]);
      expect(t2(1)).to.deep.equal([ { a: 2, b: r } ]);
      expect(t3(1)).to.deep.equal([ { a: r, b: 2 } ]);
    });

    it('returns an array with the specified number of items', function () {
      const arr1 = t1(3);
      const arr2 = t2(3);
      const arr3 = t3(3);

      expect(arr1).to.deep.equal([ [r,r,r], [r,r,r], [r,r,r] ]);
      expect(arr2).to.deep.equal([ {a:2, b:r}, {a:2, b:r}, {a:2, b:r} ]);
      expect(arr3).to.deep.equal([ {a:r, b:2}, {a:r, b:2}, {a:r, b:2} ]);
    });

    it('returns an array with the specified number of items and applies the given modifier to each one', function () {
      const t = 10;
      const arr1 = t1(3, v => t);
      const arr2 = t2(3, { b: t });
      const arr3 = t3(3, { b: t });

      expect(arr1).to.deep.equal([ t, t, t ]);
      expect(arr2).to.deep.equal([ {a:2, b:t}, {a:2, b:t}, {a:2, b:t} ]);
      expect(arr3).to.deep.equal([ {a:r, b:t}, {a:r, b:t}, {a:r, b:t} ]);
    });

  });

});
