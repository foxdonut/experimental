import { isArray, isFunction, isObject, isString } from "./util"

export const sv = ({ tag, attrs, children, text }) => node => {
  let result = {}

  result = tag(result, node[0])
  result = attrs(result, node[1])

  if (isString(node[2])) {
    result = text(result, node[2])
  }

  if (isArray(node[2])) {
    const ch = []
    node[2].forEach(child => {
      ch.push(sv({ tag, attrs, children, text})(child))
    })
    result = children(result, ch)
  }

  return result
}
