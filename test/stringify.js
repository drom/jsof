'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const jsof = require('../lib');

const data = {
  'undefined':{ src: undefined, dst: 'undefined' },
  'null':     { src: null, dst: 'null' },
  'true':     { src: true, dst: 'true' },
  'false':    { src: false, dst: 'false' },
  number :    { src: 3.1415, dst: '3.1415' },
  bigint:     { src: 9007199254740993n, dst: '9007199254740993n' },
  string:     { src: 'some string', dst: '\'some string\'' },
  object: {
    src: { 'Key_1': 'value1', 'key 2': 1234 },
    dst: '{\n  Key_1: \'value1\',\n  \'key 2\': 1234\n}'
  },
  array: {
    src: [123, 456, null],
    dst: `[
  123,
  456,
  null
]`
  },
  'function': {
    src: function fn(a, b) { return a + b; },
    dst: '\'function fn(a, b) { return a + b; }\''
  }
};

Object.keys(data).forEach(function (name) {
  test('stringify: ' + name, function () {
    assert.deepStrictEqual(jsof.stringify(data[name].src), data[name].dst);
  });
});

test('stringify: legacy uses double quotes', function () {
  assert.strictEqual(jsof.stringify({ a: 1 }, { legacy: true }), '{"a": 1}');
  assert.strictEqual(jsof.stringify('x', { legacy: true }), '"x"');
});

test('stringify: sortKeys orders object keys', function () {
  assert.strictEqual(
    jsof.stringify({ b: 1, a: 2, c: 3 }, { sortKeys: true }),
    '{\n  a: 2,\n  b: 1,\n  c: 3\n}'
  );
});

test('stringify: indent number sets width', function () {
  assert.strictEqual(
    jsof.stringify({ a: 1, b: 2 }, { indent: 4 }),
    '{\n    a: 1,\n    b: 2\n}'
  );
});

test('stringify: replacer function transforms values', function () {
  const res = jsof.stringify({ a: 1, b: 2 }, {
    replacer: function (key, value) {
      return typeof value === 'number' ? value + 1 : value;
    }
  });
  assert.strictEqual(res, '{\n  a: 2,\n  b: 3\n}');
});

test('stringify: replacer array whitelists keys', function () {
  assert.strictEqual(
    jsof.stringify({ a: 1, b: 2, c: 3 }, { replacer: ['a', 'c'] }),
    '{\n  a: 1,\n  c: 3\n}'
  );
});

test('stringify: ansi wraps with escape codes', function () {
  const res = jsof.stringify('x', { ansi: true });
  assert.ok(res.includes('32m') && res.includes('0m'));
});

test('stringify: bigint legacy emits bare integer', function () {
  assert.strictEqual(jsof.stringify(42n, { legacy: true }), '42');
});

test('stringify: bigint round-trips through parse', function () {
  const big = 9007199254740993n;
  assert.strictEqual(jsof.parse(jsof.stringify(big)), big);
});
