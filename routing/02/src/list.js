import m from "mithril"
import { href, FormPage, HomePage } from "./constants"

export const createList = navigator => _update => {
  return {
    view: _vnode => m("div",
      m("div", "List Page"),
      m("div",
        ["a", "b"].map(itemId => m("button",
          //{ onclick: () => navigator.navigateTo(FormPage, { itemId }) },
          { onclick: () => m.route.set(navigator.getLink(FormPage, { itemId })) },
          "Form ", itemId
        ))
      ),
      m("div",
        m("a", href(navigator.getLink(HomePage)), "Home Page")
      )
    )
  }
}
