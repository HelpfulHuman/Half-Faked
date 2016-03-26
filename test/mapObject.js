import { expect } from 'chai';
import { mapObject } from '../src/utils';

describe('mapObject', function () {

  it('invokes the given function for each value in an object', function () {
    const obj = { foo: 0, bar: 1, baz: 2 };
    const res = mapObject(obj, (val) => val + 1);
    expect(res).to.deep.equal({ foo: 1, bar: 2, baz: 3 });
  });

});
