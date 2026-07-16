# JSOF (liberal JSON)
[![NPM version](https://img.shields.io/npm/v/jsof.svg)](https://www.npmjs.org/package/jsof)
[![Tests](https://github.com/drom/jsof/workflows/Tests/badge.svg)](https://github.com/drom/jsof/actions)
[![Coveralls](https://coveralls.io/repos/github/drom/jsof/badge.svg?branch=master)](https://coveralls.io/github/drom/jsof?branch=master)

A tiny, **zero-dependency** parser and stringifier for liberal (JSON6-style) JavaScript values.

## Why?
### Reason 1
Do you think that JSON is a bit verbose? restrictive? hard to comment?

Remember, you wrote something like the text below, gave it to `JSON.parse()` and got errors, one by one?

```js
{
    unquoted_key: "keys need no quotes",
    café_ключ: "unicode keys are fine",
    trailing: ["comma", "ok",],
    sparse: ["hole", , "ok"],   // -> ['hole', null, 'ok']
    // single line comment
    /* multi-line comment */
    leadingDot: .5,
    hex: 0x14,
    big: 9007199254740993n,     // BigInt
    inf: Infinity,
    nan: NaN,
    'single quoted': true,
    "line\
    continuation": "one string",
}
```

So now you can use `jsof.parse()`, and everything is fine.

### Reason 2
`JSON.stringify(obj, null, 2);`

```json
{
  "a": [
    {"b": [
      [
        "string"
      ]
    ]}
  ],
  "c": 42
}
```

`jsof.stringify(obj);`

```js
{
  a: [{b: 'string'}],
  c: 42
}
```

### Reason 3
Colors. `jsof.stringify(obj, {ansi: true})` returns an ANSI-colored string ready to print to a terminal.

### Reason 4
No `eval()`, no `Yaml`, no runtime dependencies. Input is parsed by a small hand-written JSON6 parser — arbitrary code is never executed.

### Reason 5
Better error messages: a `SyntaxError` carrying `line` and `column`.

## Use
### Node.js

```
npm i jsof --save
```

```js
const jsof = require('jsof');
```

### Browser
A prebuilt bundle is published to unpkg:

```html
<script src="https://unpkg.com/jsof"></script>
<script>
  jsof.parse('{a: 1}');
</script>
```

## Grammar
`jsof.parse()` accepts a superset of JSON:

- `//` line and `/* */` block comments
- unquoted object keys, including unicode identifiers
- single- or double-quoted strings and keys
- trailing commas, and sparse arrays (`[1, , 2]` → `[1, null, 2]`)
- numbers: leading/trailing dot (`.5`, `5.`), hex (`0x1f`), `Infinity`,
  `-Infinity`, `NaN`, and leading zeros (`013` → `13`)
- **BigInt** literals (`42n`, `0xffn`)
- `undefined`
- string line continuations (a `\` before a newline) and `\xHH` escapes

## API
### jsof.parse() / jsof.p()
Parses a liberal JSON6 string and returns a JavaScript value.

`value = jsof.parse(text[, reviver])`

`reviver` works exactly like the second argument of `JSON.parse`. On invalid
input a `SyntaxError` is thrown with `.line` and `.column` properties.

### jsof.stringify() / jsof.s()
Converts a JavaScript value to a compact liberal string.

`text = jsof.stringify(value[, options])`

By default keys are left unquoted when they match `^[0-9a-zA-Z_]+$` (otherwise
single-quoted), strings use single quotes, arrays of same-typed scalars are
printed inline, and `BigInt` values keep their `n` suffix.

| option     | type              | effect                                                              |
| ---------- | ----------------- | ------------------------------------------------------------------- |
| `ansi`     | `boolean`         | Wrap tokens in ANSI color escapes for terminal output.              |
| `legacy`   | `boolean`         | Strict-JSON-compatible output: double-quoted keys/strings, bare int for BigInt. |
| `indent`   | `number \| string`| Indentation unit (spaces count or literal string). Default `2`.     |
| `sortKeys` | `boolean`         | Sort object keys alphabetically.                                    |
| `replacer` | `function \| array`| Like `JSON.stringify`: transform values or whitelist keys.         |

```js
jsof.stringify({a: [{b: 'string'}], c: 42});
// {
//   a: [{b: 'string'}],
//   c: 42
// }

jsof.stringify({a: 1}, {legacy: true});      // {"a": 1}
jsof.stringify({b: 1, a: 2}, {sortKeys: true, indent: 4});
```

## Testing
`npm test`

## License
MIT [LICENSE](https://github.com/drom/jsof/blob/master/LICENSE).
