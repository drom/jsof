'use strict';

var parse = require('./parse'),
    stringify = require('./stringify'),
    _parse = require('./_parse'),
    _stringify = require('./_stringify');

module.exports = {
    parse: parse,
    stringify: stringify,
    p: parse,
    s: stringify,
    shift: {
        parse: _parse,
        stringify: _stringify,
        p: _parse,
        s: _stringify
    }
};
