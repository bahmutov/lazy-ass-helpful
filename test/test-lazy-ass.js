/* global lazyAss, lazyAssHelpful */
(function () {
  QUnit.module('lazy-ass-helpful individual function');

  function foo() {
    console.log('in foo');
    lazyAss(true, 'everything is ok');
  }

  function bar() {
    console.log('in bar');
    lazyAss(2 + 2 === 5, 'incorrect addition fails');
  }

  QUnit.test('original function', 0, function () {
    foo();
  });

  QUnit.test('original exception thrown', 2, function () {
    QUnit.equal(typeof bar, 'function');
    QUnit.throws(bar, /incorrect addition fails/, 'bar throws');
  });

  QUnit.test('wrapped bar throws helpful exception', 2, function () {
    var _bar = lazyAssHelpful(bar);
    QUnit.equal(typeof _bar, 'function');
    // _bar();
    QUnit.throws(_bar, /2 \+ 2 === 5/, 'throws exception with condition source');
  });

  QUnit.test('lazyAss', function () {
    var wrappedFoo = lazyAssHelpful(foo);
    QUnit.equal(typeof wrappedFoo, 'function', 'wrapped is a function');
    wrappedFoo();
  });
}());

(function (root) {
  QUnit.module('lazy-ass-helpful a function with given name');

  root.bar = lazyAss;
  if (typeof lazyAss !== 'function') {
    throw new Error('lazyAss is undefined');
  }

  function foo() {
    /* global bar */
    bar('some' + 'thing' === 'ss');
  }

  QUnit.test('changed bar name', 2, function () {
    var _foo = lazyAssHelpful(foo, {
      assertionNames: ['bar']
    });
    QUnit.equal(typeof _foo, 'function');
    QUnit.throws(_foo, /ss/, 'throws exception with condition source');
  });
}(typeof window !== 'undefined' ? window : global));
