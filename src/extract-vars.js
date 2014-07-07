var check = require('check-types');
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

module.exports = findVariables;
