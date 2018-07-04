export const isString = x => typeof x === "string"
export const isArray = x => Array.isArray(x)
export const isObject = x => typeof x === "object" && !isArray(x) && x !== null && x !== undefined
export const isFunction = x => typeof x === "function"

// Credit: JSnoX https://github.com/af/JSnoX/blob/master/jsnox.js

// matches "input", "input:text"
const tagTypeRegex = /^([a-z1-6]+)(?::([a-z]+))?/

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
  classes: ["quack", "yellow"],
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
        if (result.classes === undefined) {
          result.classes = []
        }
        result.classes.push(prop)
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

/*
returns node definition, expanding on the above tag properties and adding to obtain:
{
  tag: "input",
  type: "password",
  id: "duck",
  classes: ["quack", "yellow"],
  attrs: { name: "pwd", required: true },
  text: "some text",
  events: { onClick: ..., ... },
  children: [ { tag: ... }, ... ]
}
*/
const processChildren = rest => {
  const ch = []
  rest.forEach(child => {
    ch.push(nodeDef(child))
  })
  return ch
}

export const nodeDef = node => {
  // Text node
  if (isString(node)) {
    return { text: node }
  }

  // Tag
  let rest = node[2]
  let varArgsLimit = 3

  // Process tag
  const result = getTagProperties(node[0])

  // Process attrs
  if (isObject(node[1])) {
    const attrs = node[1]

    // Process class and className
    if (attrs["class"] !== undefined || attrs["className"] !== undefined) {
      const classAttr = attrs["class"] || attrs["className"]
      delete attrs["class"]
      delete attrs["className"]

      let addClasses = []
      if (isString(classAttr)) {
        addClasses = classAttr.split(" ")
      }
      else if (isObject(classAttr)) {
        Object.keys(classAttr).forEach(key => {
          if (classAttr[key]) {
            addClasses.push(key)
          }
        })
      }
      if (addClasses.length > 0) {
        if (result.classes === undefined) {
          result.classes = addClasses
        }
        else {
          result.classes = result.classes.concat(addClasses)
        }
      }
    }

    // Process id
    if (attrs.id) {
      result.id = attrs.id
      delete attrs.id
    }

    // Process events, which start with "on"
    const events = {}
    Object.keys(attrs).forEach(attr => {
      if (attr.startsWith("on")) {
        events[attr] = attrs[attr]
        delete attrs[attr]
      }
    })
    if (Object.keys(events).length > 0) {
      result.events = events
    }

    // Add remaining attributes
    if (Object.keys(attrs).length > 0) {
      if (result.attrs === undefined) {
        result.attrs = attrs
      }
      else {
        result.attrs = Object.assign(result.attrs, attrs)
      }
    }
  }
  // No attrs, use second argument as rest
  else {
    rest = node[1]
    varArgsLimit = 2
  }

  // Process children: varargs
  if (node.length > varArgsLimit) {
    result.children = processChildren(node.slice(varArgsLimit - 1))
  }
  // Process children: one child arg
  else {
    // Text node
    if (isString(rest)) {
      result.text = rest
    }

    if (isArray(rest)) {
      // One child node vs Array of children
      result.children = processChildren( isString(rest[0]) ? [ rest ] : rest )
    }
  }
  return result
}
