# JSOF (liberal JSON)
[![NPM version](https://img.shields.io/npm/v/jsof.svg)](https://www.npmjs.org/package/jsof) [![Build Status](https://travis-ci.org/drom/jsof.svg?branch=master)](https://travis-ci.org/drom/jsof) [![Build status](https://ci.appveyor.com/api/projects/status/pcxe8l0w97jwfmil?svg=true)](https://ci.appveyor.com/project/drom/jsof)

Uses `esprima, escodegen` or `shift-{parser, codegen}` to parse and stringify an JavaScript values.

## Why?

### Reason 1

Do you think, that JSON is a bit verbose? restrictive? hard to comment?
Remember, you wrote something like the text below and `JSON.parse()` reported ~30 issues?

```js
{
    unquoted_key: "keys must be quoted",
    a1: ["extra comma",],
    a2: ["double extra comma",,],
    // single line comment
    "Illegal expression": 1 + 2,
    "Illegal invocation": alert(),
    "Numbers cannot have leading zeroes": 013,
    "Numbers cannot be hex": 0x14,
    a3: [
        "Illegal backslash escape: \x15",
        "Illegal backslash escape: \017",
        [[[[[[[[[[[[[[[[[[[["Too deep"]]]]]]]]]]]]]]]]]]]],
        "Bad value", truth,
        'single quote',
        /* multi-line comment */
        "	tab	character	in	string	",
        "tab\   character\   in\  string\  ",
        "line\
        break"
    ],
    "Extra comma": true,
}
```
So, now you can use `jsof.parse()`, and everything is fine!

## Use
### Node.js

```
npm i jsof --save
```

```js
var jsof = require('jsof');
```

## API
### jsof.parse()
### jsof.p()
The `jsof.parse()` method parses a JS value string and returns a JavaScript value. Passes all 3 JSON **pass** tests. Also passes 18 of 33 JSON **fail** tests.

`value = jsof.parse(text)`

### jsof.stringify()
### jsof.s()
The `jsof.stringify()` method converts a JavaScript value to a JS string.

`text = jsof.stringify(value)`

### jsof.shift.parse()
### jsof.shift.p()
The same as `jsof.parse()` but using `shift-*` tools.

### jsof.shift.stringify()
### jsof.shift.s()
The same as `jsof.stringify()` but using `shift-*` tools.

## Testing
`npm test`

## License
MIT [LICENSE](https://github.com/drom/jsof/blob/master/LICENSE).
