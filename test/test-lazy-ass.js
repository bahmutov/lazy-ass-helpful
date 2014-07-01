/* global lazyAss, lazyAssHelpful, check */
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

(function () {
  QUnit.module('lazy-ass-helpful wraps any function passed to an object method');

  var env = {
    run: function (name, fn) {
      console.log('running', name);
      fn();
    }
  };

  function bar() {
    lazyAss(2 + 2 === 5, 'incorrect addition fails');
  }

  function foo() {
    lazyAss(check.unemptyString(2));
  }

  QUnit.test('unhelpful exception', function () {
    QUnit.throws(function () {
      env.run('test bar', bar);
    }, /incorrect addition/, 'fails');
  });

  QUnit.test('install wrapper', function () {
    QUnit.equal(typeof env.run, 'function');
    lazyAssHelpful(env, 'run');
    QUnit.equal(typeof env.run, 'function', 'method is still a function');
  });

  QUnit.test('test error in bar', function () {
    QUnit.throws(function () {
      env.run('test bar', bar);
    }, /2 \+ 2 === 5/, 'has helpful condition source');
  });

  QUnit.test('test error in foo', function () {
    QUnit.throws(function () {
      env.run('test foo', foo);
    }, /check\.unemptyString/, 'has helpful condition source');
  });

}());
