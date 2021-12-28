'use strict';

const parse = require('./parse');
const stringify = require('./stringify');

exports.parse = parse;
exports.stringify = stringify;
exports.p = parse;
exports.s = stringify;
