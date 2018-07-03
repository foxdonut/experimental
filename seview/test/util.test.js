import { isString, isArray, isObject, isFunction } from "../src/util"

const string = "test"
const object = { key: "value" }
const array = ["div", "test"]
const func = x => x

export default {
  isString: {
    "true for string": [
      isString(string),
      true
    ],
    "false for object": [
      isString(object),
      false
    ],
    "false for array": [
      isString(array),
      false
    ],
    "false for function": [
      isString(func),
      false
    ]
  },
  isArray: {
    "false for string": [
      isArray(string),
      false
    ],
    "false for object": [
      isArray(object),
      false
    ],
    "true for array": [
      isArray(array),
      true
    ],
    "false for function": [
      isArray(func),
      false
    ]
  },
  isObject: {
    "false for string": [
      isObject(string),
      false
    ],
    "true for object": [
      isObject(object),
      true
    ],
    "false for array": [
      isObject(array),
      false
    ],
    "false for function": [
      isObject(func),
      false
    ]
  },
  isFunction: {
    "false for string": [
      isFunction(string),
      false
    ],
    "true for object": [
      isFunction(object),
      false
    ],
    "false for array": [
      isFunction(array),
      false
    ],
    "true for function": [
      isFunction(func),
      true
    ]
  }
}