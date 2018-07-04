import { isArray, isObject, isString } from "./util"

/*
The problem with supporting varargs is, how do you differentiate an element from two text nodes?
For example:
["div", ["b", "hello"]] vs
["div", ["hello", "there"]]
For the second case, varargs MUST be used:
["div", "hello", "there"]
*/
const processChildren = (functions, rest, result) => {
  const ch = []
  rest.forEach(child => {
    ch.push(sv(functions)(child))
  })
  result = functions.children(result, ch)
  return result
}

export const sv = functions => node => {
  const { tag, attrs, text } = functions
  let result = {}

  // Text node
  if (isString(node)) {
    return text(result, node)
  }

  // Tag
  let rest = node[2]
  let varArgsLimit = 3

  // Process tag
  result = tag(result, node[0])

  // Process attrs
  if (isObject(node[1])) {
    result = attrs(result, node[1])
  }
  else {
    rest = node[1]
    varArgsLimit = 2
  }

  if (node.length > varArgsLimit) {
    // Process children: varargs
    result = processChildren(functions, node.slice(varArgsLimit - 1), result)
  }
  else {
    // Process children: one child arg

    // Text node
    if (isString(rest)) {
      result = text(result, rest)
    }

    if (isArray(rest)) {
      if (isString(rest[0])) {
        // One child node
        result = processChildren(functions, [ rest ], result)
      }
      else {
        // Array of children
        result = processChildren(functions, rest, result)
      }
    }
  }

  return result
}
