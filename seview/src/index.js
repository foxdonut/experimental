import { nodeDef } from "./util"

/*
The problem with supporting varargs is, how do you differentiate an element from two text nodes?
For example:
["div", ["b", "hello"]] vs
["div", ["hello", "there"]]
For the second case, varargs MUST be used:
["div", "hello", "there"]
*/
const processChildren = (transform, rest) => {
  const result = []
  rest.forEach(child => {
    result.push(transform(child))
  })
  return result
}

export const sv = transform => node => {
  const def = nodeDef(node)
  if (def.children) {
    def.children = processChildren(transform, def.children)
  }
  return transform(def)
}
