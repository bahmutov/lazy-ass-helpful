// not included for now - weird timing / test ordering issue
/* global lazyAss, lazyAssHelpful, la */
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
  QUnit.module('lazy-ass-helpful can wrap method');

  var env = {
    run: function (name, fn) {
      console.log('running', name);
      fn();
    }
  };

  function bar() {
    lazyAss(2 + 2 === 5, 'incorrect addition fails');
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

  QUnit.test('test error in bar', function () {
    lazyAssHelpful(env, 'run');
    try {
      env.run('test bar', bar);
    } catch (err) {
      QUnit.ok(/2 \+ 2 === 5/.test(err.message), 'has failed condition in ' + err.message);
    }
  });

}());

// cannot get to the bottom of the failure
(function () {
  /* global check */
  QUnit.module('wrap method - check string');

  var env = {
    run: function (name, fn) {
      // console.log('running', name);
      fn();
    }
  };

  function foo() {
    lazyAss(check.unemptyString(2));
  }

  QUnit.test('test error in foo', function () {
    lazyAssHelpful(env, 'run', {
      excludeVariables: ['check']
    });
    // console.log('wrapped env object');
    // console.log(env.run.toString());

    try {
      env.run('test foo', foo);
    } catch (err) {
      // console.log('err.message', err.message);
      QUnit.ok(/check\.unemptyString/.test(err.message), 'has helpful condition source');
    }
  });

}());

(function () {
  QUnit.module('adds condition variables to the message');

  function bar() {
    var foo = 'something';
    lazyAss(foo === 'nothing');
  }

  QUnit.test('foo is in the arguments', 2, function () {
    var barHelped = lazyAssHelpful(bar);
    try {
      barHelped();
    } catch (err) {
      // console.log('err.message', err.message);
      QUnit.ok(/foo:/.test(err.message), 'message has foo variable name');
      QUnit.ok(/something/.test(err.message), 'message has foo variable value');
    }
  });
}());

(function () {
  QUnit.module('la: adds condition variables to the message');

  function bar() {
    var foo = 'something';
    la(foo === 'nothing');
  }

  QUnit.test('foo is in the arguments', 2, function () {
    var barHelped = lazyAssHelpful(bar);
    try {
      barHelped();
    } catch (err) {
      // console.log('err.message', err.message);
      QUnit.ok(/foo:/.test(err.message), 'message has foo variable name');
      QUnit.ok(/something/.test(err.message), 'message has foo variable value');
    }
  });
}());
