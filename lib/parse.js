'use strict';

var esprima = require('esprima'),
    escodegen = require('escodegen');

var parser = esprima.parse;

var codegen = function (node) {
    return escodegen.generate(
        node,
        {format: {compact: true, semicolons: false}}
    );
};

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
        if (node.name === 'undefined')
            return undefined;
        return node.name;

    case Syntax.UnaryExpression:
        // negative numbers
        if (
            node.operator === '-' &&
            node.argument.type === Syntax.Literal &&
            (typeof node.argument.value === 'number')
        ) {
            return -(node.argument.value);
        }
        return '${' + codegen(node) + '}';

    // recursive constructs
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

    default:
        return '${' + codegen(node) + '}';
    }
}

function parse (text) {
    var fullTree;
    try {
        fullTree = parser('OBJ = ' + text);
    } catch (err) {
        console.log(err);
        console.log('\n');
        console.log(err.lineNumber, err.description);
        console.log(text.split('\n')[err.lineNumber]);
        throw err;
    }
    var tree = fullTree.body[0].expression.right;
    var res = rec(tree);
    return res;
}

module.exports = parse;
/* eslint no-console: 0 */
