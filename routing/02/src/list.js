import m from "mithril"
import { FormPage } from "./constants"

export const createList = navigator => _update => {
  return {
    view: _vnode => m("div",
      "List Page",
      m("div",
        ["a", "b"].map(item => m("button",
          { onclick: () => navigator.navigate(FormPage, { item }) },
          "Form ", item
        ))
      )
    )
  }
}
