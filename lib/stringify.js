'use strict';

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

function formKey (txt) {
    if (txt.match('^[0-9a-zA-Z_]+$')) {
        return txt;
    }
    return '\'' + txt + '\'';
}

function rec (value) {
    var type, res;

    if (value === undefined) return 'undefined';
    if (value === null) return 'null';
    if (value === true) return 'true';
    if (value === false) return 'false';

    type = Object.prototype.toString.call(value);

    switch (type) {
    case '[object Number]':
    case '[object Function]':
        return value.toString();

    case '[object String]':
        return '\'' + value + '\'';

    case '[object Object]':
        res = Object.keys(value).map(function (key) {
            return formKey(key) + ': ' + rec(value[key]);
        });
        return '{\n' + indent(res.join(',\n')) + '\n}';

    case '[object Array]':
        res = value.map(function (e) {
            return (rec(e));
        });
        return '[\n' + indent(res.join(',\n')) + '\n]';

    default:
        return type;
    }
}

module.exports = rec;
