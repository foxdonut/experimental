import React from "react"
import jsnox from "jsnox"

export const m = jsnox(React)

export const preventDefault = func => evt => {
  evt.preventDefault()
  func(evt)
}

export const compose = (...funcs) => x =>
  funcs.reduceRight((value, func) => func(value), x)
