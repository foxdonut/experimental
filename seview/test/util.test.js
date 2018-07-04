import { isString, isArray, isObject, isFunction, getTagProperties, nodeDef } from "../src/util"

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
        classes: ["btn"]
      }
    ],
    all: [
      getTagProperties("input:password#duck.quack.yellow[name=pwd][required]"),
      {
        tag: "input",
        type: "password",
        id: "duck",
        classes: ["quack", "yellow"],
        attrs: { name: "pwd", required: true }
      }
    ],
    extraTypesIgnored: [
      getTagProperties("input:text:password.form-input"),
      {
        tag: "input",
        type: "text",
        classes: ["form-input"]
      }
    ]
  },
  nodeDef: {
    basicText: [
      nodeDef(["div", { width: "100%" }, "test"]),
      {
        tag: "div",
        attrs: { width: "100%" },
        text: "test"
      }
    ],
    basicChildren: [
      nodeDef(["div", { id: "test" }, [
        ["div", "test1"],
        ["div", "test2"]
      ]]),
      {
        tag: "div",
        id: "test",
        children: [
          { tag: "div", text: "test1" },
          { tag: "div", text: "test2" }
        ]
      }
    ],
    justATag: [
      nodeDef(["hr"]),
      { tag: "hr" }
    ],
    combineAttrs: [
      nodeDef(["input[name=duck]", { value: "quack" }]),
      {
        tag: "input",
        attrs: { name: "duck", value: "quack" }
      }
    ],
    combineClass: [
      nodeDef(["button.btn", { class: "btn-default other" }]),
      {
        tag: "button",
        classes: ["btn", "btn-default", "other"]
      }
    ],
    combineClassName: [
      nodeDef(["button.btn", { className: "btn-default other" }]),
      {
        tag: "button",
        classes: ["btn", "btn-default", "other"]
      }
    ],
    classToggles: [
      nodeDef(["button.btn", { class: { "btn-primary": true, "btn-default": false }}]),
      {
        tag: "button",
        classes: ["btn", "btn-primary"]
      }
    ],
    classNameToggles: [
      nodeDef(["button.btn", { className: { "btn-primary": true, "btn-default": false }}]),
      {
        tag: "button",
        classes: ["btn", "btn-primary"]
      }
    ],
    events: [
      nodeDef(["button", { onClick: func, onBlur: func }]),
      {
        tag: "button",
        events: {
          onClick: func,
          onBlur: func
        }
      }
    ]
  }
}