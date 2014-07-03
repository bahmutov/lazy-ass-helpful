/* global describe, it, helpDescribe, lazyAss */
if (typeof describe === 'undefined') {
  throw new Error('Cannot find describe function');
}

if (typeof helpDescribe === 'undefined') {
  require('../lazy-ass-helpful-bdd.js');
  throw new Error('Cannot find helpDescribe function');
}

if (typeof lazyAss === 'undefined') {
  throw new Error('Missing lazyAss function');
}

describe('normal test suite', function () {
  it('still works', function () {
    lazyAss(2 + 2 === 4, 'addition');
  });
});

helpDescribe('a few tests using lazy-ass', function () {
  it('does not throw', function () {
    lazyAss(true);
  });

  it('puts expression into message', function () {
    lazyAss('foo' + 2 + 4 === 'foo24');
  });
});