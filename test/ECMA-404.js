'use strict';

const fs = require('fs');
const path = require('path');
const jsof = require('../lib');
const expect = require('chai').expect;

function parser (text) {
  return function () {
    return jsof.parse(text);
  };
}

function _parser (text) {
  return function () {
    return jsof.shift.parse(text);
  };
}

fs.readdir(
  path.resolve(__dirname, './parse-pass/'),
  function (err0, jsonFiles) {
    if (err0) { throw err0; }
    describe('#ECMA-404-parse-pass', function () {
      jsonFiles.forEach(function (jsonFileName) {
        it(jsonFileName, function (done) {
          fs.readFile(
            path.resolve(__dirname, './parse-pass/', jsonFileName),
            'utf8',
            function (err1, text) {
              if (err1) { throw err1; }
              const orig = JSON.parse(text);
              expect(jsof.parse(text)).to.deep.equal(orig);
              expect(jsof.shift.parse(text)).to.deep.equal(orig);
              done();
            }
          );
        });
      });
    });
  }
);

fs.readdir(
  path.resolve(__dirname, './parse-this-too-shall-pass/'),
  function (err0, jsonFiles) {
    if (err0) { throw err0; }
    describe('#ECMA-404-parse-this-too-shall-pass', function () {
      jsonFiles.forEach(function (jsonFileName) {
        it(jsonFileName, function (done) {
          fs.readFile(
            path.resolve(__dirname, './parse-this-too-shall-pass/', jsonFileName),
            'utf8',
            function (err1, text) {
              let res1, res2;
              if (err1) { throw err1; }
              //   if (false) {
              //   let orig;
              //   eval('orig = ' + text);
              //   expect(jsof.parse(text)).to.deep.equal(orig);
              //   } else {
              res1 = jsof.parse(text);
              res2 = jsof.shift.parse(text);
              expect(res1).to.deep.equal(res2);
              done();
            }
          );
        });
      });
    });
  }
);

fs.readdir(
  path.resolve(__dirname, './parse-fail/'),
  function (err0, jsonFiles) {
    if (err0) { throw err0; }
    describe('#ECMA-404-parse-fail', function () {
      jsonFiles.forEach(function (jsonFileName) {
        it(jsonFileName, function (done) {
          fs.readFile(
            path.resolve(__dirname, './parse-fail/', jsonFileName),
            'utf8',
            function (err1, text) {
              if (err1) { throw err1; }
              expect(parser(text)).to.throw();
              expect(_parser(text)).to.throw();
              done();
            }
          );
        });
      });
    });
  }
);

/* eslint-env mocha */
