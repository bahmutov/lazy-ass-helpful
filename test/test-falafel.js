var falafel = require('falafel');

function findVariables(src) {
  var vars = [];
  falafel(src, grabVariables.bind(null, vars));
  return vars;
}

QUnit.module('falafel');

function grabVariables(foundVariableNames, node) {
  if (node.type === 'Identifier') {
    console.log('grabVariables node type:', node.type, node.name);
    foundVariableNames.push(node.name);
    // console.log('grabVariables node:', node);
  }
}

QUnit.test('argument processing', function () {
  var src = 'foo === "foo"';
  var vars = findVariables(src);
  QUnit.equal(vars.length, 1, 'found 1 variable');
  QUnit.equal(vars[0], 'foo');
});
