/**
 * Returns a string with the data type of the given value.
 *
 * @param  {*} val
 * @return {String}
 */
export function getType (val) {
  if (val === null) return 'null';
  return (Array.isArray(val) ? 'array' : typeof val);
}

/**
 * Invokes the given function on each value of the object and
 * returns the new object.
 *
 * @param  {Object} hash
 * @param  {Function} fn
 * @return {Object}
 */
export function mapObject (hash, fn) {
  var o = {};
  for (var k in hash) o[k] = fn(hash[k], k);
  return o;
}

/**
 * Walks down a tree of data and invokes any nested functions.
 *
 * @param  {*} val
 * @return {*}
 */
export function walkSchema (val) {
  const valType = getType(val);
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
export function make (factory, count) {
  var i = 0, o = [];
  while (i++ < count) o.push(factory());
  return o;
}

/**
 * Applies a modifier to a given value.
 *
 * @param  {Object} modifier
 * @param  {*} val
 * @return {*}
 */
export function applyModifier (modifier, val) {
  const vt = getType(val), mt = getType(modifier);
  if (vt === 'object' && mt === 'object') return { ...val, ...modifier };
  else if (mt === 'function') return modifier(val);
  return val;
}

/**
 * Creates a new factory instance using a given schema.
 *
 * @param  {Object} schema
 * @return {Function}
 */
export function createFactory (schema) {
  const factory = walkSchema.bind(null, schema);
  return function (count, modifier) {
    if ( ! count || count < 1) return applyModifier(modifier, factory());
    return make(factory, count).map(applyModifier.bind(null, modifier));
  }
}
