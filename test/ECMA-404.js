'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const jsof = require('../lib');

function read (dir, name) {
  return fs.readFileSync(path.resolve(__dirname, dir, name), 'utf8');
}

// strict JSON must round-trip identical to JSON.parse
fs.readdirSync(path.resolve(__dirname, './parse-pass/')).forEach(function (name) {
  test('parse-pass: ' + name, function () {
    const text = read('./parse-pass/', name);
    assert.deepStrictEqual(jsof.parse(text), JSON.parse(text));
  });
});

// liberal JSON6 that must parse without throwing
fs.readdirSync(path.resolve(__dirname, './parse-this-too-shall-pass/')).forEach(function (name) {
  test('parse-this-too-shall-pass: ' + name, function () {
    const text = read('./parse-this-too-shall-pass/', name);
    assert.doesNotThrow(function () { jsof.parse(text); });
  });
});

// invalid input that must throw
fs.readdirSync(path.resolve(__dirname, './parse-fail/')).forEach(function (name) {
  test('parse-fail: ' + name, function () {
    const text = read('./parse-fail/', name);
    assert.throws(function () { jsof.parse(text); });
  });
});
