var findVariables = require('../src/extract-vars');

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
