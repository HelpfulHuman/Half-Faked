import { expect } from 'chai';
import { getType } from '../src/utils';

describe('getType', function () {

  it('returns standard types for "typeof" fallback', function () {
    const num = getType(5);
    expect(num).to.equal('number');

    const str = getType('foo bar');
    expect(str).to.equal('string');

    const obj = getType({});
    expect(obj).to.equal('object');

    const fun = getType(function () {});
    expect(fun).to.equal('function');
  });

  it ('returns "null" for null instead of "object"', function () {
    const nil = getType(null);
    expect(nil).to.equal('null');
  });

  it('returns "array" for arrays instead of "object"', function () {
    const arr = getType([]);
    expect(arr).to.equal('array');
  });

});
