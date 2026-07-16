'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const jsof = require('../lib');

const data = {
  'undefined':{ src: 'undefined', dst: undefined },
  'null':     { src: 'null', dst: null },
  'true':     { src: 'true', dst: true },
  'false':    { src: 'false', dst: false },
  number :    { src: '3.1415', dst: 3.1415 },
  'negative': { src: '-42', dst: -42 },
  'leading dot': { src: '.5', dst: 0.5 },
  'trailing dot': { src: '5.', dst: 5 },
  hex:        { src: '0x1f', dst: 31 },
  bigint:     { src: '9007199254740993n', dst: 9007199254740993n },
  'negative bigint': { src: '-42n', dst: -42n },
  'hex bigint': { src: '0xffn', dst: 255n },
  'leading zero': { src: '013', dst: 13 },
  Infinity:   { src: 'Infinity', dst: Infinity },
  '-Infinity':{ src: '-Infinity', dst: -Infinity },
  string:     { src: '"some string"', dst: 'some string' },
  'single quote string': { src: '\'single\'', dst: 'single' },
  'hex escape': { src: '"\\x41"', dst: 'A' },
  'unicode escape': { src: '"\\u0041"', dst: 'A' },
  'line continuation': { src: '"a\\\nb"', dst: 'ab' },
  'unicode key': { src: '{café: 1}', dst: { 'café': 1 } },
  object: {
    src: '{ key1:"value1", /* some \n comment */ "key2": 1234, }',
    dst: { key1: 'value1', key2: 1234 }
  },
  array: {
    src: '[123, \n 456,, ] // comment! ',
    dst: [123, 456, null]
  }
};

Object.keys(data).forEach(function (name) {
  test('parse: ' + name, function () {
    assert.deepStrictEqual(jsof.parse(data[name].src), data[name].dst);
  });
});

test('parse: NaN', function () {
  assert.ok(Number.isNaN(jsof.parse('NaN')));
});

test('parse: reviver doubles numbers', function () {
  const res = jsof.parse('{a: 1, b: 2}', function (key, value) {
    return typeof value === 'number' ? value * 2 : value;
  });
  assert.deepStrictEqual(res, { a: 2, b: 4 });
});

test('parse: error carries line and column', function () {
  try {
    jsof.parse('{a:}');
    assert.fail('should have thrown');
  } catch (e) {
    assert.ok(e instanceof SyntaxError);
    assert.strictEqual(typeof e.line, 'number');
    assert.strictEqual(typeof e.column, 'number');
  }
});
