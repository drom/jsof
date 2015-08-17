'use strict';

var jsof = require('../lib'),
    expect = require('chai').expect;

var data = {
    number : {
        src: '3.1415',
        dst: 3.1415
    },
    string: {
        src: '"some string"',
        dst: 'some string'
    },
    object: {
        src: '{ key1:"value1", /* some \n comment */ "key2": 1234, }',
        dst: { key1: 'value1', key2: 1234 }
    },
    array: {
        src: '[123, \n 456, ] // comment! ',
        dst: [123, 456]
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
