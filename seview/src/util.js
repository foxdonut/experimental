export const isString = x => typeof x === "string"
export const isArray = x => Array.isArray(x)
export const isObject = x => typeof x === "object" && !isArray(x) && x !== null && x !== undefined
export const isFunction = x => typeof x === "function"

// Credit: JSnoX https://github.com/af/JSnoX/blob/master/jsnox.js

// matches "input", "input:text"
const tagTypeRegex = /^([a-z1-6]+)(?:\:([a-z]+))?/

// matches "#id", ".class", "[name=value]", "[required]"
const propsRegex = /((?:#|\.|@)[\w-]+)|(\[.*?\])/g

// matches "[name=value]" or "[required]"
const attrRegex = /\[([\w-]+)(?:=([^\]]+))?\]/

/*
returns tag properties: for example, "input:password#duck.quack.yellow[name=pwd][required]"
{
  tag: "input",
  type: "password",
  id: "duck",
  class: ["quack", "yellow"],
  attrs: { name: "pwd", required: true }
}
*/
export const getTagProperties = selector => {
  const result = {}

  let tagType = selector.match(tagTypeRegex)

  // Use div by default
  if (!tagType) {
    tagType = ["div", "div"]
  }
  result.tag = tagType[1]

  if (tagType[2]) {
    result.type = tagType[2]
  }

  const tagProps = selector.match(propsRegex)

  if (tagProps) {
    tagProps.forEach(tagProp => {
      const ch = tagProp[0]
      const prop = tagProp.slice(1)

      if (ch === "#") {
        result.id = prop
      }
      else if (ch === ".") {
        if (result.class === undefined) {
          result.class = []
        }
        result.class.push(prop)
      }
      else if (ch === "[") {
        if (result.attrs === undefined) {
          result.attrs = {}
        }
        const attrs = tagProp.match(attrRegex)
        result.attrs[attrs[1]] = (attrs[2] || true)
      }
    })
  }

  return result
}
