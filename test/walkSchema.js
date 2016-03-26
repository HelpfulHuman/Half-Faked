import { expect } from 'chai';
import { stub } from 'sinon';
import { walkSchema } from '../src/utils';

describe('walkSchema', function () {

  it('immediately returns simple values like strings and numbers', function () {
    const num = 6;
    expect(walkSchema(num)).to.equal(num);

    const str = 'foo bar';
    expect(walkSchema(str)).to.equal(str);
  });

  it('invokes functions and returns their result', function () {
    const fn = stub().returns(42);
    const res = walkSchema(fn);

    expect(fn.calledOnce).to.equal(true);
    expect(res).to.equal(42);
  });

  it('invokes functions nested in arrays and returns their results', function () {
    const fn = stub().returns(1);
    const arr = [fn, fn, fn, fn];
    const res = walkSchema(arr);

    expect(fn.callCount).to.equal(4);
    expect(res).to.deep.equal([1, 1, 1, 1]);
  });

  it('invokes functions nested in objects and returns their results', function () {
    const fn = stub().returns(1);
    const obj = { foo: fn, bar: fn, baz: fn };
    const iobj = { ...obj };
    const res = walkSchema(obj);

    expect(obj).to.deep.equal(iobj);
    expect(fn.callCount).to.equal(3);
    expect(res).to.deep.equal({ foo: 1, bar: 1, baz: 1 });
  });

  it('invokes functions nested in objects, returned from functions, nested in arrays, nested in objects and returns their results', function () {
    const ran = Math.random();
    const fn2 = stub().returns(ran);
    const fn1 = stub().returns({ a: fn2, b: fn2, c: fn2 });
    const arr = [ fn1, fn1, fn1 ];
    const obj = { foo: arr, bar: arr };
    const res = walkSchema(obj);

    expect(fn2.callCount).to.equal(18);
    expect(fn1.callCount).to.equal(6);
    expect(res).to.deep.equal({
      foo: [
        { a: ran, b: ran, c: ran },
        { a: ran, b: ran, c: ran },
        { a: ran, b: ran, c: ran }
      ],
      bar: [
        { a: ran, b: ran, c: ran },
        { a: ran, b: ran, c: ran },
        { a: ran, b: ran, c: ran }
      ]
    });
  });

});
