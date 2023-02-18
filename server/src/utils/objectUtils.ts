/* Takes an object and flattens it to a one layer deep object where 
   flattened keys take the form layerOneKey.layerTwoKey = layerTwoValue */
export function flattenObject(
  obj: object,
  prefix: string | false = false,
  result: object = null
) {
  result = result || {};

  // Preserve empty objects and arrays, they are lost otherwise
  if (
    prefix &&
    typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).length === 0
  ) {
    result[prefix] = Array.isArray(obj) ? [] : {};
    return result;
  }

  prefix = prefix ? prefix + "." : "";

  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      // Only recurse on true objects and arrays, ignore custom classes like dates
      if (
        typeof obj[i] === "object" &&
        (Array.isArray(obj[i]) ||
          Object.prototype.toString.call(obj[i]) === "[object Object]") &&
        obj[i] !== null
      ) {
        // Recursion on deeper objects
        flattenObject(obj[i], prefix + i, result);
      } else {
        result[prefix + i] = obj[i];
      }
    }
  }
  return result;
}


// Takes two or more objects and merges them into one.
export function merge(...args: object[]) {
  const base = {};
  args.forEach((arg) => Object.assign(base, arg));
  return base;
}
