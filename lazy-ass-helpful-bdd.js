(function registerLazyAssHelpfulBdd(root) {
  var lazyAssName = (function checkLazyAssSetup() {
    if (typeof root.lazyAssHelpful !== 'function') {
      throw new Error('Cannot find lazyAssHelpful function');
    }
    if (typeof root.lazyAss === 'function') {
      return 'lazyAss';
    }

    if (typeof root.la === 'function') {
      return 'la';
    }

    throw new Error('Cannot find lazyAss or la function');
  }());

  (function checkBdd() {
    if (typeof root.describe !== 'function') {
      throw new Error('Cannot find describe function');
    }

    if (typeof root.it !== 'function') {
      throw new Error('Cannot find it function');
    }
  }());

  root.helpIt = function(name, cb) {
    root.it(name, root.lazyAssHelpful(cb, lazyAssName));
  };

  root.helpDescribe = function (name, cb) {
    root.describe(name, root.lazyAssHelpful(cb, lazyAssName));
  };
}(typeof window !== 'undefined' ? window : global));
