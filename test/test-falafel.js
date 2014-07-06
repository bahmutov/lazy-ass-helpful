var falafel = require('falafel');

function grabVariables(foundVariableNames, node) {
  if (node.type === 'Identifier') {
    console.log('grabVariables node type:', node.type, node.name);
    foundVariableNames.push(node.name);
    // console.log('grabVariables node:', node);
  }
}

function excludedVars(opts) {
  var exclude = opts.exclude || [];
  if (typeof exclude === 'string') {
    exclude = [exclude];
  }
  return function (varName) {
    return exclude.indexOf(varName) === -1;
  };
}

function findVariables(src, opts) {
  opts = opts || {};
  var vars = [];
  falafel(src, grabVariables.bind(null, vars));

  vars = vars.filter(excludedVars(opts));

  return vars;
}

QUnit.module('falafel');


QUnit.test('argument processing', function () {
  var src = 'foo === "foo"';
  var vars = findVariables(src);
  QUnit.equal(vars.length, 1, 'found 1 variable');
  QUnit.equal(vars[0], 'foo');
});

QUnit.test('several variables', function () {
  var src = 'foo === bar';
  var vars = findVariables(src);
  QUnit.equal(vars.length, 2);
  QUnit.equal(vars[0], 'foo');
  QUnit.equal(vars[1], 'bar');
});

QUnit.test('object.method', function () {
  var src = 'foo.bar()';
  var vars = findVariables(src);
  QUnit.equal(vars.length, 2);
  QUnit.equal(vars[0], 'foo');
  QUnit.equal(vars[1], 'bar');
});

QUnit.test('can exclude variables', function () {
  var src = 'foo.bar()';
  var vars = findVariables(src, {
    exclude: 'foo'
  });
  QUnit.equal(vars.length, 1);
  QUnit.equal(vars[0], 'bar');
});

QUnit.test('can exclude all variables', function () {
  var src = 'foo.bar()';
  var vars = findVariables(src, {
    exclude: ['foo', 'bar']
  });
  QUnit.equal(vars.length, 0);
});
