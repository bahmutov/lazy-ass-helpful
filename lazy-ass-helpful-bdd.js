(function registerLazyAssHelpfulBdd(root) {
  if (typeof root.lazyAssHelpful !== 'function') {
    throw new Error('Cannot find lazyAssHelpful function');
  }

  if (typeof root.describe !== 'function') {
    throw new Error('Cannot find describe function');
  }

  if (typeof root.it !== 'function') {
    throw new Error('Cannot find it function');
  }

  root.helpIt = function(name, cb) {
    root.it(name, root.lazyAssHelpful(cb, 'la'));
  };

  root.helpDescribe = function (name, cb) {
    root.describe(name, root.lazyAssHelpful(cb, 'la'));
  };
}(typeof window !== 'undefined' ? window : global));
