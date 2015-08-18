'use strict';

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
            return key + ': ' + rec(value[key]);
        });
        return '{ ' + res.join(', ') + ' }';

    case '[object Array]':
        res = value.map(function (e) {
            return (rec(e));
        });
        return '[ ' + res.join(', ') + ' ]';

    default:
        return type;
    }
}

module.exports = rec;
