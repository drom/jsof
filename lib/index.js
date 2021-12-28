'use strict';

const parse = require('./parse');
const stringify = require('./stringify');
const _parse = require('./_parse');

module.exports = {
  parse: parse,
  stringify: stringify,
  p: parse,
  s: stringify,
  shift: {
    parse: _parse,
    stringify: stringify,
    p: _parse,
    s: stringify
  }
};
