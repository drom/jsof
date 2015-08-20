[![Build Status](https://travis-ci.org/drom/jsof.svg?branch=master)](https://travis-ci.org/drom/jsof) [![NPM version](https://img.shields.io/npm/v/jsof.svg)](https://www.npmjs.org/package/jsof)

# JSOF (liberal JSON)
Uses `esprima, escodegen` or `shift-{parser, codegen}` to parse and stringify an JavaScript values.

## API
### jsof.parse()
The `jsof.parse()` method parses a JS value string and returns a JavaScript value. Passes all 3 JSON **pass** tests. Also passes 18 of 33 JSON **fail** tests.

`value = jsof.parse(text)`

### jsof.stringify()
The `jsof.stringify()` method converts a JavaScript value to a JS string.

`text = jsof.stringify(value)`

### jsof.shift.parse()
The same as `jsof.parse()` but using `shift-*` tools.

### jsof.shift.stringify()
The same as `jsof.stringify()` but using `shift-*` tools.
