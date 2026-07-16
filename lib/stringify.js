'use strict';

const tag = {
  key: '[36m',
  boolean: '[33m',
  number: '[35m',
  string: '[32m',
  function: '[33m',
  reset: '[0m'
};

const ess = /["'`\n\r]/g;

const eso = {
  '"': '\\"',
  '\n': '\\n',
  '\r': '\\r',
  '\'': '\\\'',
  '`': '\\`'
};

function esf(chr) { return eso[chr]; }

function escape(str) { return str.replace(ess, esf); }

function quote(str, options) {
  const q = options?.legacy ? '"' : '\'';
  return q + escape(str) + q;
}

function stylize (text, type, options) {
  if (options?.ansi) {
    return tag[type] + text + tag.reset;
  }
  return text;
}

// indentation unit: number -> that many spaces, string -> itself, default 2 spaces
function unit (options) {
  const i = options?.indent;
  if (typeof i === 'number') { return ' '.repeat(i); }
  if (typeof i === 'string') { return i; }
  return '  ';
}

function indent (txt, options) {
  const pad = unit(options);
  const arr = txt.split('\n');

  if (arr.length === 1) {
    return pad + txt;
  }

  const res = arr.map(function (e) {
    if (e === '') {
      return e;
    }
    return pad + e;
  });
  return res.join('\n');
}

function formKey (txt, options) {
  let res;
  if (options?.legacy) {
    res = '"' + escape(txt) + '"';
  } else if (txt.match('^[0-9a-zA-Z_]+$')) {
    res = txt;
  } else {
    res = '\'' + txt + '\'';
  }
  return stylize(res, 'key', options);
}

function uniformArray (value, options) {
  if (value.length === 0) {
    return '[]';
  }
  const el0 = value[0];
  if (typeof el0 === 'object') { // only for scalar values
    return null;
  }
  for (const el of value) { // only for values of the same type
    if (typeof el !== typeof el0) {
      return null;
    }
  }
  const body = [];
  if (typeof el0 === 'string') {
    for (const el of value) {
      body.push(stylize('"' + escape(el) + '"', 'string', options));
    }
  } else if (typeof el0 === 'number') {
    for (const el of value) {
      body.push(stylize(el.toString(), 'number', options));
    }
  } else if (typeof el0 === 'boolean') {
    for (const el of value) {
      body.push(stylize(el.toString(), 'boolean', options));
    }
  } else {
    return null;
  }
  return '[' + body.join(', ') + ']';
}

function formObject (value, options) {
  let keys = Object.keys(value);
  if (Array.isArray(options?.replacer)) {
    const allow = options.replacer.map(String);
    keys = keys.filter(function (k) { return allow.includes(k); });
  }
  if (options?.sortKeys) {
    keys = keys.slice().sort();
  }
  const res = keys.map(function (key) {
    let v = value[key];
    if (typeof options?.replacer === 'function') {
      v = options.replacer.call(value, key, v);
    }
    return formKey(key, options) + ': ' + rec(v, options);
  });
  if (res.length < 2) {
    return '{' + res.join(',\n') + '}';
  }
  return '{\n' + indent(res.join(',\n'), options) + '\n}';
}

function formArray (value, options) {
  const uniform = uniformArray(value, options);
  if (uniform) { return uniform; }

  const res = value.map(function (e) {
    return rec(e, options);
  });
  if (res.length < 2) {
    return '[' + res.join(', ') + ']';
  }
  return '[\n' + indent(res.join(',\n'), options) + '\n]';
}

function rec (value, options) {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value === true) return stylize('true', 'boolean', options);
  if (value === false) return stylize('false', 'boolean', options);

  const type = Object.prototype.toString.call(value);

  if (Array.isArray(value)) {
    return formArray(value, options);
  }

  switch (typeof value) {
  case 'boolean':
    return stylize(value, 'boolean', options);

  case 'number':
    return stylize(value.toString(), 'number', options);

  case 'string':
    return stylize(quote(value, options), 'string', options);

  case 'bigint':
    // 42n round-trips through parse; legacy JSON has no BigInt -> bare integer
    return stylize(value.toString() + (options?.legacy ? '' : 'n'), 'number', options);

  case 'function':
    return stylize(quote(value.toString(), options), 'function', options);

  case 'object':
    return formObject(value, options);

  default:
    return type;
  }
}

module.exports = rec;
