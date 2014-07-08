/* global describe, it, helpDescribe, lazyAss, check */
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

  it('has extra arguments', function () {
    var foo = 'bar';
    try {
      lazyAss(foo + 2 + 4 === 'bar245', 'value of foo (should be bar) = "', foo, '"');
    } catch (err) {
      if (!/= " bar "$/.test(err.message)) {
        throw new Error('cannot find expected value in error message: ' + err.message);
      }
    }
  });

  it('has extra arguments without string message', function () {
    var foo = 'bar';
    try {
      lazyAss(foo + 2 + 4 === 'bar245', foo);
    } catch (err) {
      if (!/bar$/.test(err.message)) {
        throw new Error('cannot find expected value in error message: ' + err.message);
      }
    }
  });
});

helpDescribe('adds variables', function () {
  it('adds vars from predicate expression', function () {
    function hasVariableName(str) {
      return /foo:/.test(str);
    }

    function hasVariableValue(str) {
      return /bar/.test(str);
    }

    var foo = 'bar';
    try {
      lazyAss(foo === 'foo');
    } catch (err) {
      // console.log('error message\n' + err.message);
      if (!hasVariableName(err.message)) {
        throw new Error('cannot find expected variable name in error message: ' + err.message);
      }
      if (!hasVariableValue(err.message)) {
        throw new Error('cannot find variable from expression value ' + err.message);
      }
    }
  });

  it('handles check-types in conditions', function () {
    try {
      lazyAss(check.unemptyString(2));
    } catch (err) {
      // console.log('error message\n' + err.message);
      if (!/check\.unemptyString/.test(err.message)) {
        throw new Error('Cannot find check in condition\n' + err.message);
      }
    }
  });

  it('check object is skipped by default', function () {
    /* global lazyAssHelpfulBdd */
    check.verify.fn(lazyAssHelpfulBdd, 'function lazyAssHelpfulBdd');
    try {
      lazyAss(check.unemptyString(2));
    } catch (err) {
      // console.log('error message\n' + err.message);
      if (!/check\.unemptyString/.test(err.message)) {
        throw new Error('Cannot find check in condition\n' + err.message);
      }
      if (/check:/.test(err.string)) {
        throw new Error('Found check variable name in error message\n' + err.message);
      }
    }
  });
});
