import { expect } from 'chai';
import { stub } from 'sinon';
import { applyModifier } from '../src/utils';

describe('applyModifier', function () {

  it('returns the value if modifier or value is null', function () {
    const obj = {};

    expect(applyModifier(obj, null)).to.equal(null);
    expect(applyModifier(null, obj)).to.equal(obj);
  });

  it('returns the value of the given modifier function', function () {
    const fn = stub().returns(42);
    const res = applyModifier(fn, {});

    expect(fn.calledOnce).to.equal(true);
    expect(res).to.equal(42);
  });

  it('passes the value to the given modifier function', function () {
    const fn = stub();
    const obj = {};
    applyModifier(fn, obj);

    expect(fn.calledOnce).to.equal(true);
    expect(fn.calledWith(obj)).to.equal(true);
  });

  it('merges a value and modifier together (with the modifier on top) if both are objects', function () {
    const val = { foo: 1, bar: 2, baz: 3 };
    const mod = { bah: 1, bak: 2, bar: 3 };

    expect(applyModifier(mod, val)).to.deep.equal({
      foo: 1,
      bar: 3,
      baz: 3,
      bah: 1,
      bak: 2
    });
  });

});
