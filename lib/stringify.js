'use strict';

const tag = {
  key: '\u001b[36m',
  boolean: '\u001b[33m',
  number: '\u001b[35m',
  string: '\u001b[32m',
  function: '\u001b[33m',
  reset: '\u001b[0m'
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

function stylize (text, type, options) {
  if (options?.ansi) {
    return tag[type] + text + tag.reset;
  }
  return text;
}

function indent (txt) {
  const arr = txt.split('\n');

  if (arr.length === 1) {
    return '  ' + txt;
  }

  const res = arr.map(function (e) {
    if (e === '') {
      return e;
    }
    return '  ' + e;
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

function rec (value, options) {
  let res;

  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (value === true) return stylize('true', 'boolean', options);
  if (value === false) return stylize('false', 'boolean', options);

  const type = Object.prototype.toString.call(value);

  if (Array.isArray(value)) {
    res = uniformArray(value, options);
    if (res) { return res; }

    res = value.map(function (e) {
      return (rec(e, options));
    });
    if (res.length < 2) {
      return '[' + res.join(', ') + ']';
    }
    return '[\n' + indent(res.join(',\n')) + '\n]';
  }

  switch (typeof value) {
  case 'boolean':
    return stylize(value, 'boolean', options);

  case 'number':
    return stylize(value.toString(), 'number', options);

  case 'string':
    return stylize(
      (options?.legacy ? '"' : '\'') +
      escape(value) +
      (options?.legacy ? '"' : '\''),
      'string', options
    );

  case 'bigint':
    return stylize(value.toString(), 'string', options);

  case 'function':
    return stylize(
      (options?.legacy ? '"' : '\'') +
      escape(value.toString()) +
      (options?.legacy ? '"' : '\''),
      'function', options
    );

  case 'object':
    res = Object.keys(value).map(function (key) {
      return formKey(key, options) + ': ' + rec(value[key], options);
    });
    if (res.length < 2) {
      return '{' + res.join(',\n') + '}';
    }
    return '{\n' + indent(res.join(',\n')) + '\n}';

  default:
    return type;
  }
}

module.exports = rec;
