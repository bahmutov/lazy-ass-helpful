var check = require('check-types');
var falafel = require('falafel');

(function (env) {
  function rewriteLazyAssMessage(okStatement) {
    var conditionNode = okStatement.expression.arguments[0];
    var condition = conditionNode.source();
    condition = condition.replace(/'/g, '"');
    var helpfulMessage = '\'condition [' + condition + ']';

    var msgArg = okStatement.expression.arguments[1];
    if (msgArg) {
      var message = msgArg.source();
      var strippedQuotes = message.replace(/'/g, '');
      helpfulMessage += ', ' + strippedQuotes + '\'';
      msgArg.update(helpfulMessage);
    } else {
      conditionNode.update(condition + ', ' + helpfulMessage + '\'');
    }
  }

  function isLazyAss(statement) {
    return statement.expression.callee.name === 'lazyAss';
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

  function wrapSingleFunction(fn) {
    check.verify.fn(fn, 'Expected a function');

    var wrapped = function () {
      var testSource = fn.toString();
      // console.log('test source', testSource);
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

  function wrapMethod(o, name) {
    var method = o[name];
    check.verify.fn(method, 'expected method ' + name + ' in object');
    var wrapped = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      args = args.map(function (a) {
        if (check.fn(a)) {
          a = wrapSingleFunction(a);
        }
        return a;
      });
      return method.apply(o, args);
    };
    o[name] = wrapped;
    return wrapped;
  }

  env.lazyAssHelpful = function (a1, a2) {
    if (check.fn(a1)) {
      return wrapSingleFunction(a1);
    } else if (check.object(a1) && check.unemptyString(a2)) {
      return wrapMethod(a1, a2);
    } else {
      throw new Error('Do not know how to handle arguments ' + a1 + ',' + a2);
    }
  };
}(typeof global === 'object' ? global : window));

