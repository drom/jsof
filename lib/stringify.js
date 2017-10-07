'use strict';

var tag = {
    key: '\u001b[36m',
    boolean: '\u001b[33m',
    number: '\u001b[35m',
    string: '\u001b[32m',
    function: '\u001b[33m',
    reset: '\u001b[0m'
};

var ess = /["'`\n\r]/g;

var eso = {
    '"': '\\"',
    '\n': '\\n',
    '\r': '\\r',
    '\'': '\\\'',
    '`': '\\`'
};

function esf(chr) { return eso[chr]; }

function escape(str) { return str.replace(ess, esf); }

function stylize (text, type, options) {
    if (options && options.ansi) {
        return tag[type] + text + tag.reset;
    }
    return text;
}

function indent (txt) {
    var res = [];
    var arr;

    arr = txt.split('\n');

    if (arr.length === 1) {
        return '  ' + txt;
    }

    res = arr.map(function (e) {
        if (e === '') {
            return e;
        }
        return '  ' + e;
    });
    return res.join('\n');
}

function formKey (txt, options) {
    var res;
    if (txt.match('^[0-9a-zA-Z_]+$')) {
        res = txt;
    } else {
        res = '\'' + txt + '\'';
    }
    return stylize(res, 'key', options);
}

function rec (value, options) {
    var type, res;

    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (value === true) return stylize('true', 'boolean', options);
    if (value === false) return stylize('false', 'boolean', options);

    type = Object.prototype.toString.call(value);

    switch (typeof value) {
    case 'boolean':
        return stylize(value, 'boolean', options);

    case 'number':
        return stylize(value.toString(), 'number', options);

    case 'string':
        return stylize('\'' + escape(value) + '\'', 'string', options);

    case 'function':
        return stylize('\'' + value.toString() + '\'', 'function', options);

    case 'object':
        switch (type) {

        case '[object Array]':
            res = value.map(function (e) {
                return (rec(e, options));
            });
            if (res.length < 2) {
                return '[' + res.join(', ') + ']';
            }
            return '[\n' + indent(res.join(',\n')) + '\n]';

        default:
            res = Object.keys(value).map(function (key) {
                return formKey(key, options) + ': ' + rec(value[key], options);
            });
            if (res.length < 2) {
                return '{' + res.join(',\n') + '}';
            }
            return '{\n' + indent(res.join(',\n')) + '\n}';
        }
    default:
        return type;
    }
}

module.exports = rec;
