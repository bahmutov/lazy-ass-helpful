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
      assertionName: 'bar'
    });
    QUnit.equal(typeof _foo, 'function');
    QUnit.throws(_foo, /ss/, 'throws exception with condition source');
  });
}(typeof window !== 'undefined' ? window : global));

(function (root) {
  QUnit.module('lazy-ass-helpful wrap a method with custom assertion');

  root.bar = lazyAss;
  if (typeof lazyAss !== 'function') {
    throw new Error('lazyAss is undefined');
  }

  var env = {
    run: function (name, fn) {
      console.log('running', name);
      fn();
    }
  };

  function foo() {
    /* global bar */
    bar('some' + 'thing' === 'ss');
  }

  QUnit.test('running method', 1, function () {
    lazyAssHelpful(env, 'run', {
      assertionName: 'bar'
    });
    QUnit.throws(function () {
      env.run('test foo', foo);
    }, /ss/, 'has helpful condition source');
  });
}(typeof window !== 'undefined' ? window : global));

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

(function () {
  QUnit.module('adds condition variables to the message');

  function bar() {
    var foo = 'something';
    lazyAss(foo === 'nothing');
  }

  var barHelped = lazyAssHelpful(bar);

  QUnit.test('foo is in the arguments', 2, function () {
    try {
      barHelped();
    } catch (err) {
      QUnit.ok(/foo:/.test(err.message), 'message has foo variable name');
      QUnit.ok(/something/.test(err.message), 'message has foo variable value');
    }
  });

}());
