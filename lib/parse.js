'use strict';

// Hand-written JSON6 parser. Zero dependencies.
// Superset of JSON: comments, unquoted (incl. unicode) keys, single quotes,
// trailing + sparse commas, hex, .5 / 5., Infinity, NaN, undefined.

const idStart = /[$_\p{ID_Start}]/u;
const idPart = /[$_‌‍\p{ID_Continue}]/u;

function isWs (c) {
  return c === ' ' || c === '\t' || c === '\n' || c === '\r' ||
    c === '\f' || c === '\v' || c === '﻿' || c === ' ';
}

const escapes = {
  'b': '\b', 'f': '\f', 'n': '\n', 'r': '\r', 't': '\t', 'v': '\v', '0': '\0'
};

function Parser (text) {
  this.text = String(text);
  this.pos = 0;
  this.line = 1;
  this.col = 1;
}

Parser.prototype.err = function (msg) {
  const e = new SyntaxError(
    'jsof: ' + msg + ' at line ' + this.line + ' column ' + this.col
  );
  e.line = this.line;
  e.column = this.col;
  return e;
};

Parser.prototype.peek = function () {
  return this.text[this.pos];
};

Parser.prototype.next = function () {
  const c = this.text[this.pos++];
  if (c === '\n') {
    this.line++;
    this.col = 1;
  } else {
    this.col++;
  }
  return c;
};

// skip whitespace and comments
Parser.prototype.ws = function () {
  for (;;) {
    const c = this.peek();
    if (c === undefined) {
      return;
    }
    if (isWs(c)) {
      this.next();
      continue;
    }
    if (c === '/') {
      const c1 = this.text[this.pos + 1];
      if (c1 === '/') {
        this.next(); this.next();
        while (this.peek() !== undefined && this.peek() !== '\n') {
          this.next();
        }
        continue;
      }
      if (c1 === '*') {
        this.next(); this.next();
        for (;;) {
          if (this.peek() === undefined) {
            throw this.err('unterminated block comment');
          }
          if (this.peek() === '*' && this.text[this.pos + 1] === '/') {
            this.next(); this.next();
            break;
          }
          this.next();
        }
        continue;
      }
    }
    return;
  }
};

Parser.prototype.value = function () {
  this.ws();
  const c = this.peek();

  if (c === undefined) {
    throw this.err('unexpected end of input');
  }
  if (c === '{') {
    return this.object();
  }
  if (c === '[') {
    return this.array();
  }
  if (c === '"' || c === '\'') {
    return this.string();
  }
  if (c === '-' || c === '+' || c === '.' || (c >= '0' && c <= '9')) {
    return this.number();
  }
  return this.word();
};

// bare keywords / identifiers used as a value
Parser.prototype.word = function () {
  const start = this.pos;
  if (!idStart.test(this.peek() || '')) {
    throw this.err('unexpected token ' + JSON.stringify(this.peek()));
  }
  while (this.peek() !== undefined && idPart.test(this.peek())) {
    this.next();
  }
  const w = this.text.slice(start, this.pos);
  switch (w) {
  case 'true': return true;
  case 'false': return false;
  case 'null': return null;
  case 'undefined': return undefined;
  case 'Infinity': return Infinity;
  case 'NaN': return NaN;
  default:
    throw this.err('unexpected identifier ' + JSON.stringify(w));
  }
};

Parser.prototype.digits = function () {
  let n = 0;
  while (this.peek() !== undefined && this.peek() >= '0' && this.peek() <= '9') {
    this.next();
    n++;
  }
  return n;
};

Parser.prototype.hex = function (neg) {
  this.next(); this.next(); // 0x
  const hs = this.pos;
  while (/[0-9a-fA-F]/.test(this.peek() || '')) {
    this.next();
  }
  if (this.pos === hs) {
    throw this.err('missing hexadecimal digits');
  }
  const digits = this.text.slice(hs, this.pos);
  if (this.peek() === 'n') { // BigInt
    this.next();
    const bv = BigInt('0x' + digits);
    return neg ? -bv : bv;
  }
  const hv = parseInt(digits, 16);
  return neg ? -hv : hv;
};

Parser.prototype.exponent = function () {
  if (this.peek() !== 'e' && this.peek() !== 'E') {
    return;
  }
  this.next();
  if (this.peek() === '+' || this.peek() === '-') {
    this.next();
  }
  if (this.digits() === 0) {
    throw this.err('invalid exponent');
  }
};

Parser.prototype.number = function () {
  const start = this.pos;
  const c = this.peek();

  if (c === '+' || c === '-') {
    this.next();
  }
  const neg = this.text[start] === '-';

  // signed Infinity / NaN
  const rest = this.text.slice(this.pos);
  if (rest.startsWith('Infinity')) {
    for (let i = 0; i < 8; i++) { this.next(); }
    return neg ? -Infinity : Infinity;
  }
  if (rest.startsWith('NaN')) {
    for (let i = 0; i < 3; i++) { this.next(); }
    return NaN;
  }

  if (this.peek() === '0' && (this.text[this.pos + 1] === 'x' || this.text[this.pos + 1] === 'X')) {
    return this.hex(neg);
  }

  let isInt = true;
  let seenDigit = this.digits() > 0;
  if (this.peek() === '.') {
    isInt = false;
    this.next();
    seenDigit = this.digits() > 0 || seenDigit;
  }
  if (!seenDigit) {
    throw this.err('invalid number');
  }
  if (isInt && this.peek() === 'n') { // BigInt (integers only)
    this.next();
    // strip leading zeros so BigInt() accepts 013n -> 13n
    const raw = this.text.slice(start, this.pos - 1).replace(/^([+-]?)0+(?=\d)/, '$1');
    return BigInt(raw);
  }
  this.exponent();
  // leading-zero integers accepted, parsed as decimal (013 -> 13)
  return Number(this.text.slice(start, this.pos));
};

Parser.prototype.string = function () {
  const quote = this.next();
  let res = '';
  for (;;) {
    const c = this.peek();
    if (c === undefined) {
      throw this.err('unterminated string');
    }
    if (c === quote) {
      this.next();
      return res;
    }
    if (c === '\n') {
      throw this.err('unterminated string');
    }
    if (c === '\\') {
      this.next();
      res += this.escape();
      continue;
    }
    res += this.next();
  }
};

Parser.prototype.escape = function () {
  const c = this.next();
  if (c === undefined) {
    throw this.err('unterminated string');
  }
  if (c === '\n') { // line continuation
    return '';
  }
  if (c === '\r') {
    if (this.peek() === '\n') { this.next(); }
    return '';
  }
  if (c === 'x') {
    const h = this.text.substr(this.pos, 2);
    if (!/^[0-9a-fA-F]{2}$/.test(h)) {
      throw this.err('invalid hexadecimal escape');
    }
    this.next(); this.next();
    return String.fromCharCode(parseInt(h, 16));
  }
  if (c === 'u') {
    const h = this.text.substr(this.pos, 4);
    if (!/^[0-9a-fA-F]{4}$/.test(h)) {
      throw this.err('invalid unicode escape');
    }
    this.next(); this.next(); this.next(); this.next();
    return String.fromCharCode(parseInt(h, 16));
  }
  if (Object.prototype.hasOwnProperty.call(escapes, c)) {
    return escapes[c];
  }
  return c; // unknown escape -> literal char
};

Parser.prototype.key = function () {
  this.ws();
  const c = this.peek();
  if (c === '"' || c === '\'') {
    return this.string();
  }
  if (!idStart.test(c || '')) {
    throw this.err('expected property key');
  }
  const start = this.pos;
  this.next();
  while (this.peek() !== undefined && idPart.test(this.peek())) {
    this.next();
  }
  return this.text.slice(start, this.pos);
};

Parser.prototype.object = function () {
  this.next(); // {
  const res = {};
  this.ws();
  if (this.peek() === '}') {
    this.next();
    return res;
  }
  for (;;) {
    this.ws();
    if (this.peek() === '}') { // trailing comma
      this.next();
      return res;
    }
    const k = this.key();
    this.ws();
    if (this.next() !== ':') {
      throw this.err('expected ":" after property key');
    }
    res[k] = this.value();
    this.ws();
    const c = this.next();
    if (c === '}') {
      return res;
    }
    if (c !== ',') {
      throw this.err('expected "," or "}" in object');
    }
  }
};

Parser.prototype.array = function () {
  this.next(); // [
  const res = [];
  for (;;) {
    this.ws();
    const c = this.peek();
    if (c === undefined) {
      throw this.err('unterminated array');
    }
    if (c === ']') {
      this.next();
      return res;
    }
    if (c === ',') { // hole / sparse -> null
      this.next();
      res.push(null);
      continue;
    }
    res.push(this.value());
    this.ws();
    const d = this.next();
    if (d === ']') {
      return res;
    }
    if (d !== ',') {
      throw this.err('expected "," or "]" in array');
    }
  }
};

// JSON.parse-style reviver walk
function revive (holder, key, reviver) {
  const value = holder[key];
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) {
      const v = revive(value, k, reviver);
      if (v === undefined) {
        delete value[k];
      } else {
        value[k] = v;
      }
    }
  }
  return reviver.call(holder, key, value);
}

function parse (text, reviver) {
  const p = new Parser(text);
  const res = p.value();
  p.ws();
  if (p.peek() !== undefined) {
    throw p.err('unexpected trailing characters');
  }
  if (typeof reviver === 'function') {
    return revive({'': res}, '', reviver);
  }
  return res;
}

module.exports = parse;
