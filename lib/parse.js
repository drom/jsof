'use strict';

var esprima = require('esprima'),
    estraverse = require('estraverse');

var Syntax = estraverse.Syntax;

function parse (text) {
    var fullTree = esprima.parse('OBJ = ' + text);
    var tree = fullTree.body[0].expression.right;
    var res = '';

    estraverse.traverse(tree, {
        leave: function (node) {
            if (node.type === Syntax.Literal) {
                res += node.value;
            }
        }
    });

    return res;
};

module.exports = parse;
