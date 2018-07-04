export const isString = x => typeof x === "string"
export const isArray = x => Array.isArray(x)
export const isObject = x => typeof x === "object" && !isArray(x) && x !== null && x !== undefined
export const isFunction = x => typeof x === "function"
