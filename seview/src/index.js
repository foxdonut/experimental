import { isString, isArray, mapKeys as mk, nodeDef } from "./util"

const processChildren = (transform, rest) => {
  const result = []
  rest.forEach(child => {
    console.log("child:", child)
    result.push(isString(child) ? child : sv(transform)(child))
  })
  return result
}

export const sv = transform => node => {
  const def = nodeDef(node)
  console.log("def:", JSON.stringify(def, null, 4))
  if (isArray(def.children)) {
    def.children = processChildren(transform, def.children)
  }
  console.log("def.children:", JSON.stringify(def.children, null, 4))
  return transform(def)
}

export const mapKeys = mk
