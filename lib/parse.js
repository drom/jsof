'use strict';

var esprima = require('esprima');

var Syntax = esprima.Syntax;

function rec (node) {
    var res;

    if (node === null) {
        return node;
    }

    switch (node.type) {
    case Syntax.Literal:
        return node.value;

    case Syntax.Identifier:
        return node.name;

    case Syntax.ObjectExpression:
        res = {};
        node.properties.forEach(function (e) {
            // expect node.type to be Syntax.Property
            res[rec(e.key)] = rec(e.value);
        });
        return res;

    case Syntax.ArrayExpression:
        return node.elements.map(function (e) {
            return rec(e);
        });
    }
}

function parse (text) {
    var fullTree = esprima.parse('OBJ = ' + text);
    var tree = fullTree.body[0].expression.right;
    var res = rec(tree);
    return res;
};

module.exports = parse;
