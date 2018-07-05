import { nodeDef } from "./util"

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
