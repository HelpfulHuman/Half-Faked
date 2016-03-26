'use strict';

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

babelHelpers;

/**
 * Returns a string with the data type of the given value.
 *
 * @param  {*} val
 * @return {String}
 */
function getType(val) {
  if (val === null) return 'null';
  return Array.isArray(val) ? 'array' : typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val);
}

/**
 * Invokes the given function on each value of the object and
 * returns the new object.
 *
 * @param  {Object} hash
 * @param  {Function} fn
 * @return {Object}
 */
function mapObject(hash, fn) {
  var o = {};
  for (var k in hash) {
    o[k] = fn(hash[k], k);
  }return o;
}

/**
 * Walks down a tree of data and invokes any nested functions.
 *
 * @param  {*} val
 * @return {*}
 */
function walkSchema(val) {
  var valType = getType(val);
  switch (valType) {
    case 'function':
      val = walkSchema(val());
      break;
    case 'object':
      val = mapObject(val, walkSchema);
      break;
    case 'array':
      // TODO Add a polyfill?
      val = val.map(walkSchema);
      break;
  }
  return val;
}

/**
 * Creates an array by invoking the given factory method the
 * specified count, then returns that array.
 *
 * @param  {Function} factory
 * @param  {Number} count
 * @return {Array}
 */
function make(factory, count) {
  var i = 0,
      o = [];
  while (i++ < count) {
    o.push(factory());
  }return o;
}

/**
 * Applies a modifier to a given value.
 *
 * @param  {Object} modifier
 * @param  {*} val
 * @return {*}
 */
function applyModifier(modifier, val) {
  var vt = getType(val),
      mt = getType(modifier);
  if (vt === 'object' && mt === 'object') return babelHelpers.extends({}, val, modifier);else if (mt === 'function') return modifier(val);
  return val;
}

/**
 * Creates a new factory instance using a given schema.
 *
 * @param  {Object} schema
 * @return {Function}
 */
function createFactory(schema) {
  var factory = walkSchema.bind(null, schema);
  return function (count, modifier) {
    if (!count || count < 1) return applyModifier(modifier, factory());
    return make(factory, count).map(applyModifier.bind(null, modifier));
  };
}

module.exports = createFactory;