var check = require('check-types');
var falafel = require('falafel');
var findVariables = require('./src/extract-vars');
check.verify.fn(findVariables, 'could not find findVariables');

(function (env) {
  var _assertionNames = ['lazyAss', 'la'];

  function rewriteLazyAssMessage(opts, statement) {
    var conditionNode = statement.expression.arguments[0];
    var condition = conditionNode.source();
    var vars = findVariables(condition, opts);
    check.verify.array(vars, 'could not find variables in condition ' + condition);

    /*
    console.log('condition', condition, 'vars', vars);
    console.log('opts', opts);
    */

    condition = condition.replace(/'/g, '"');
    var helpfulMessage = '\'condition [' + condition + ']\'';
    vars.forEach(function (variable) {
      helpfulMessage += ',\n "' + variable + ':"';
      helpfulMessage += ', typeof ' + variable + ' !== "undefined" && typeof ' +
        variable + ' !== "function" ? ' + variable + ' : "skipped"';
    });

    var msgArg = statement.expression.arguments[1];
    if (msgArg) {
      var message = msgArg.source();
      helpfulMessage += ', ' + message;
      msgArg.update(helpfulMessage);
    } else {
      conditionNode.update(condition + ', ' + helpfulMessage);
    }
  }
  var rewrite;

  function isLazyAss(statement) {
    return _assertionNames.indexOf(statement.expression.callee.name) !== -1;
  }

  function rewriteTestFunction(node) {
    if (node.type === 'BlockStatement') {
      node.body.forEach(function (statement) {
        if (statement.type === 'ExpressionStatement' &&
          statement.expression.type === 'CallExpression') {

          if (isLazyAss(statement)) {
            rewrite(statement);
          }
        }
      });
    }
  }

  function wrapSingleFunction(fn, opts) {
    check.verify.fn(fn, 'Expected a function');
    opts = opts || {};

    if (check.unemptyString(opts.assertionName) &&
      !check.array(opts.assertionNames)) {
      opts.assertionNames = [opts.assertionName];
    }

    if (check.array(opts.assertionNames)) {
      _assertionNames = opts.assertionNames;
    }
    check.verify.array(_assertionNames,
      'invalid assertion names', _assertionNames);
    _assertionNames.forEach(function (name, k) {
      check.verify.unemptyString(name, 'invalid assertion name ' + name + ' at ' + k);
    });

    // console.log('opts', JSON.stringify(opts, null, 2));
    rewrite = rewriteLazyAssMessage.bind(null, opts);

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

  function wrapMethod(o, name, opts) {
    check.verify.unemptyString(name, 'missing method name');
    opts = opts || {};
    var method = o[name];
    check.verify.fn(method, 'expected method ' + name + ' in object');

    var wrapped = function () {
      var args = Array.prototype.slice.call(arguments, 0);
      args = args.map(function (a) {
        if (check.fn(a)) {
          a = wrapSingleFunction(a, opts);
        }
        return a;
      });
      return method.apply(o, args);
    };
    o[name] = wrapped;
    return wrapped;
  }

  env.lazyAssHelpful = function (a1, a2, opts) {
    if (check.fn(a1)) {
      opts = a2;
      return wrapSingleFunction(a1, opts);
    } else if (check.object(a1) && check.unemptyString(a2)) {
      return wrapMethod(a1, a2, opts);
    } else {
      throw new Error('Do not know how to handle arguments ' + a1 + ',' + a2);
    }
  };
}(typeof global === 'object' ? global : window));

