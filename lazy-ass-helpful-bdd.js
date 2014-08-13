(function registerLazyAssHelpfulBdd(root) {
  root.lazyAssHelpfulBdd = function (opts) {
    opts = opts || {};
    var assertionNames = opts.assertionNames || 'lazyAss';

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
        root.lazyAssHelpful(cb, assertionNames, opts));
    };

    root.helpDescribe = function (name, cb) {
      root.describe(name,
        root.lazyAssHelpful(cb, opts));
    };
  };

  var lazyAssNames = (function checkLazyAssSetup() {
    var names = [];
    if (typeof root.lazyAss === 'function') {
      names.push('lazyAss');
    }

    if (typeof root.la === 'function') {
      names.push('la');
    }

    if (!names.length) {
      throw new Error('Cannot find lazyAss or la function');
    }
  }());

  root.lazyAssHelpfulBdd({
    assertionNames: lazyAssNames,
    excludeVariables: ['check', '_', 'angular']
  });
}(typeof window !== 'undefined' ? window : global));
