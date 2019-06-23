'use strict';

var jsof = require('../lib'),
    expect = require('chai').expect;

var data = {
    'undefined':{ src: undefined, dst: 'undefined' },
    'null':     { src: null, dst: 'null' },
    'true':     { src: true, dst: 'true' },
    'false':    { src: false, dst: 'false' },
    number :    { src: 3.1415, dst: '3.1415' },
    string:     { src: 'some string', dst: '\'some string\'' },
    object: {
        src: { Key_1: 'value1', 'key 2': 1234 },
        dst: '{\n  Key_1: \'value1\',\n  \'key 2\': 1234\n}'
    },
    array: {
        src: [123, 456, null],
        dst: `[
  123,
  456,
  null
]`
    },
    'function': {
        src: function fn(a, b) { return a + b; },
        dst: '\'function fn(a, b) { return a + b; }\''
    }
};

describe('#stringify', function () {
    Object.keys(data).forEach(function (source) {
        it(source, function (done) {
            var res;

            res = jsof.stringify(data[source].src);
            expect(res).to.deep.equal(data[source].dst);

            res = jsof.shift.stringify(data[source].src);
            expect(res).to.deep.equal(data[source].dst);

            // console.log(JSON.stringify(res, null, 2));
            // console.log(jsof.stringify(res));
            done();
        });
    });
});
