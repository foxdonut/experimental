import m from "mithril"
import { href, FormPage, HomePage } from "./constants"

export const createList = navigator => _update => {
  return {
    view: _vnode => m("div",
      "List Page",
      m("div",
        ["a", "b"].map(itemId => m("button",
          //{ onclick: () => navigator.navigate(FormPage, { itemId }) },
          { onclick: () => m.route.set(navigator.getPath(FormPage, { itemId })) },
          "Form ", itemId
        ))
      ),
      m("div",
        m("a", href(navigator.getPath(HomePage)), "Home Page")
      )
    )
  }
}
