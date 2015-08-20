'use strict';

var jsof = require('../lib'),
    expect = require('chai').expect;

var data = {
    'undefined':{ src: 'undefined', dst: undefined },
    'null':     { src: 'null', dst: null },
    'true':     { src: 'true', dst: true },
    'false':    { src: 'false', dst: false },
    number :    { src: '3.1415', dst: 3.1415 },
    string:     { src: '"some string"', dst: 'some string' },
    object: {
        src: '{ key1:"value1", /* some \n comment */ "key2": 1234, }',
        dst: { key1: 'value1', key2: 1234 }
    },
    array: {
        src: '[123, \n 456,, ] // comment! ',
        dst: [123, 456, null]
    },
    'function': {
        src: 'function (a, /* comment */ b) { return b + c }',
        dst: '${function(a,b){return b+c}}'
    },
    expressions: {
        src: '[~a, a+b, a++, --a, ,a(), a.b, a.b.c.d]',
        dst: ['${~a}', '${a+b}', '${a++}', '${--a}', null, '${a()}', '${a.b}', '${a.b.c.d}']
    }
};

describe('#parse', function () {
    Object.keys(data).forEach(function (source) {
        it(source, function (done) {
            var res = jsof.parse(data[source].src);
            expect(res).to.deep.equal(data[source].dst);
            done();
        });
    });
});

describe('#shift.parse', function () {
    Object.keys(data).forEach(function (source) {
        it(source, function (done) {
            var res = jsof.shift.parse(data[source].src);
            expect(res).to.deep.equal(data[source].dst);
            done();
        });
    });
});
