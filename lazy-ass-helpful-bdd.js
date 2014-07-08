(function registerLazyAssHelpfulBdd(root) {
  root.lazyAssHelpfulBdd = function (opts) {
    opts = opts || {};
    var assertionName = opts.assertionName || 'lazyAss';

    if (typeof root.lazyAssHelpful !== 'function') {
      throw new Error('Cannot find lazyAssHelpful function');
    }

    (function checkBdd() {
      if (typeof root.describe !== 'function') {
        throw new Error('Cannot find describe function');
      }

      if (typeof root.it !== 'function') {
        throw new Error('Cannot find it function');
      }
    }());

    root.helpIt = function(name, cb) {
      root.it(name,
        root.lazyAssHelpful(cb, assertionName, opts));
    };

    root.helpDescribe = function (name, cb) {
      root.describe(name,
        root.lazyAssHelpful(cb, opts));
    };
  };

  var lazyAssName = (function checkLazyAssSetup() {
    if (typeof root.lazyAss === 'function') {
      return 'lazyAss';
    }

    if (typeof root.la === 'function') {
      return 'la';
    }

    throw new Error('Cannot find lazyAss or la function');
  }());

  root.lazyAssHelpfulBdd({
    assertionName: lazyAssName,
    excludeVariables: ['check', '_', 'angular']
  });
}(typeof window !== 'undefined' ? window : global));
