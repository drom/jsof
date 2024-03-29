'use strict';

const shiftParser = require('shift-parser');
const shiftCodegen = require('shift-codegen');

const parser = shiftParser['default'];

const codegen = shiftCodegen['default'];

const Syntax = {
  LiteralBooleanExpression: 'LiteralBooleanExpression',
  LiteralNumericExpression: 'LiteralNumericExpression',
  LiteralStringExpression: 'LiteralStringExpression',
  LiteralNullExpression: 'LiteralNullExpression',
  StaticPropertyName: 'StaticPropertyName',
  IdentifierExpression: 'IdentifierExpression',
  UnaryExpression: 'UnaryExpression',
  ObjectExpression: 'ObjectExpression',
  ArrayExpression: 'ArrayExpression'
};

function rec (node) {
  let res;

  if (node === null) {
    return node;
  }

  switch (node.type) {

  case Syntax.LiteralNullExpression:
    return null;

  case Syntax.LiteralNumericExpression:
  case Syntax.LiteralBooleanExpression:
  case Syntax.LiteralStringExpression:
  case Syntax.StaticPropertyName:
    return node.value;

  case Syntax.IdentifierExpression:
    if (node.name === 'undefined')
      return undefined;
    return node.name;

  case Syntax.UnaryExpression:
    // negative numbers
    if (
      node.operator === '-' &&
            node.operand.type === Syntax.LiteralNumericExpression
    ) {
      return -(node.operand.value);
    }
    return '${' + codegen(node) + '}';

    // recursive constructs
  case Syntax.ObjectExpression:
    res = {};
    node.properties.forEach(function (e) {
      // expect node.type to be Syntax.DataProperty
      res[rec(e.name)] = rec(e.expression);
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
  const fullTree = parser('OBJ = ' + text);
  const tree = fullTree.statements[0].expression.expression;
  const res = rec(tree);
  return res;
}

module.exports = parse;
