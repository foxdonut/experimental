import React from "react"
import jsnox from "jsnox"

export const m = jsnox(React)
export const compose = (f, g) => x => f(g(x))

export const preventDefault = func => evt => {
  evt.preventDefault()
  func(evt)
}
