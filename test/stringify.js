'use strict';

const jsof = require('../lib');
const expect = require('chai').expect;

const data = {
  'undefined':{ src: undefined, dst: 'undefined' },
  'null':     { src: null, dst: 'null' },
  'true':     { src: true, dst: 'true' },
  'false':    { src: false, dst: 'false' },
  number :    { src: 3.1415, dst: '3.1415' },
  string:     { src: 'some string', dst: '\'some string\'' },
  object: {
    src: { 'Key_1': 'value1', 'key 2': 1234 },
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
      const res1 = jsof.stringify(data[source].src);
      expect(res1).to.deep.equal(data[source].dst);
      const res2 = jsof.shift.stringify(data[source].src);
      expect(res2).to.deep.equal(data[source].dst);
      // console.log(JSON.stringify(res, null, 2));
      // console.log(jsof.stringify(res));
      done();
    });
  });
});

/* eslint-env mocha */
