import { isArray, isObject, isString } from "./util"

/*
The problem with supporting varargs is, how do you differentiate an element from two text nodes?
For example:
["div", ["b", "hello"]] vs
["div", ["hello", "there"]]
Without varargs, the children must be in an array. Thus, for the above, we'd use:
["div" [ ["b", "hello"] ]] and
["div", ["hello", "there"]]
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

  // Process tag
  result = tag(result, node[0])

  // Process attrs
  if (isObject(node[1])) {
    result = attrs(result, node[1])
  }
  else {
    rest = node[1]
  }

  // Process children

  // Text node
  if (isString(rest)) {
    result = text(result, rest)
  }

  // Array of children
  if (isArray(rest)) {
    result = processChildren(functions, rest, result)
  }

  return result
}
