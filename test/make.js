import { expect } from 'chai';
import { stub } from 'sinon';
import { make } from '../src/utils';

describe('make', function () {

  it('invokes the function the given number of times and returns the results', function () {
    const ran = Math.random();
    const fn = stub().returns(ran);
    const res = make(fn, 5);

    expect(res).to.deep.equal([ran, ran, ran, ran, ran]);
  });

});
