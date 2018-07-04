import { isString, isArray, isObject, isFunction, getTagProperties } from "../src/util"

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
    ],
    "false for null": [
      isString(null),
      false
    ],
    "false for undefined": [
      isString(undefined),
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
    ],
    "false for null": [
      isArray(null),
      false
    ],
    "false for undefined": [
      isArray(undefined),
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
    ],
    "false for null": [
      isObject(null),
      false
    ],
    "false for undefined": [
      isObject(undefined),
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
    ],
    "false for null": [
      isFunction(null),
      false
    ],
    "false for undefined": [
      isFunction(undefined),
      false
    ]
  },
  getTagProperties: {
    divByDefault: [
      getTagProperties(".btn"),
      {
        tag: "div",
        class: ["btn"]
      }
    ],
    all: [
      getTagProperties("input:password#duck.quack.yellow[name=pwd][required]"),
      {
        tag: "input",
        type: "password",
        id: "duck",
        class: ["quack", "yellow"],
        attrs: { name: "pwd", required: true }
      }
    ]
  }
}