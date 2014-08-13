/* global describe, it, helpDescribe, helpIt, lazyAss, la, check */
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

describe('helpIt', function () {
  la(typeof helpIt === 'function', 'helpIt is a function');

  helpIt('lazyAss wrapped', function () {
    try {
      var foo = 5;
      lazyAss(2 + 2 === foo, 'does not add to foo', foo);
    } catch (err) {
      lazyAss(/2 \+ 2 === foo/.test(err.message), err.message);
      lazyAss(/does not add to foo/.test(err.message), err.message);
      lazyAss(/5/.test(err.message), err.message);
    }
  });

  helpIt('la wrapped', function () {
    try {
      var foo = 5;
      la(2 + 2 === foo, 'does not add to foo', foo);
    } catch (err) {
      la(/2 \+ 2 === foo/.test(err.message), err.message);
      la(/does not add to foo/.test(err.message), err.message);
      la(/5/.test(err.message), err.message);
    }
  });
});

describe('helpDescribe', function () {

  // TODO: test helpDescribe with la

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
});
