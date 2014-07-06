var check = require('check-types');
var falafel = require('falafel');

(function (env) {
  var _assertionName = 'lazyAss';

  function rewriteLazyAssMessage(statement) {
    var conditionNode = statement.expression.arguments[0];
    var condition = conditionNode.source();
    console.log('condition\n' + condition);
    condition = condition.replace(/'/g, '"');
    var helpfulMessage = '\'condition [' + condition + ']\'';

    var msgArg = statement.expression.arguments[1];
    if (msgArg) {
      var message = msgArg.source();
      helpfulMessage += ', ' + message;
      msgArg.update(helpfulMessage);
    } else {
      conditionNode.update(condition + ', ' + helpfulMessage);
    }
  }

  function isLazyAss(statement) {
    return statement.expression.callee.name === _assertionName;
  }

  function rewriteTestFunction(node) {
    if (node.type === 'BlockStatement') {
      node.body.forEach(function (statement) {
        if (statement.type === 'ExpressionStatement' &&
          statement.expression.type === 'CallExpression') {

          if (isLazyAss(statement)) {
            rewriteLazyAssMessage(statement);
          }
        }
      });
    }
  }

  function wrapSingleFunction(fn, assertionName) {
    check.verify.fn(fn, 'Expected a function');
    _assertionName = assertionName || 'lazyAss';
    check.verify.unemptyString(_assertionName,
      'invalid assertion name', _assertionName);

    var wrapped = function () {
      var testSource = fn.toString();
      // console.log('test source before\n' + testSource);
      if (!fn.name) {
        testSource = '(' + testSource + ')';
      }
      //check.verify.unemptyString(fn.name,
      //  'for now qunit-helpful needs test function to have a name');
      var output = falafel(testSource, rewriteTestFunction);
      // console.log('rewritten function\n' + output);

      /* jshint -W061 */
      var helpfulFn = eval('(' + output + ')');
      return helpfulFn.apply(null, Array.prototype.slice.call(arguments, 0));
    };
    return wrapped;
  }

  function wrapMethod(o, name, assertionName) {
    var method = o[name];
    check.verify.fn(method, 'expected method ' + name + ' in object');
    var wrapped = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      args = args.map(function (a) {
        if (check.fn(a)) {
          a = wrapSingleFunction(a, assertionName);
        }
        return a;
      });
      return method.apply(o, args);
    };
    o[name] = wrapped;
    return wrapped;
  }

  env.lazyAssHelpful = function (a1, a2, a3) {
    if (check.fn(a1)) {
      return wrapSingleFunction(a1, a2);
    } else if (check.object(a1) && check.unemptyString(a2)) {
      return wrapMethod(a1, a2, a3);
    } else {
      throw new Error('Do not know how to handle arguments ' + a1 + ',' + a2);
    }
  };
}(typeof global === 'object' ? global : window));

