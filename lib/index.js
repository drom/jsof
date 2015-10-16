'use strict';

var parse = require('./parse'),
    stringify = require('./stringify'),
    _parse = require('./_parse');

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
