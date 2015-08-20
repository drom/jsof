'use strict';

var parse = require('./parse'),
    stringify = require('./stringify'),
    _parse = require('./_parse'),
    _stringify = require('./_stringify');

module.exports = {
    parse: parse,
    stringify: stringify,
    shift: {
        parse: _parse,
        stringify: _stringify
    }
};
