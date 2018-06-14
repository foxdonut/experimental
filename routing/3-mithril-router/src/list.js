import { href, FormPage, HomePage } from "./constants"
import m from "mithril"

export const createList = navigator => _update => {
  return {
    view: _vnode => m("div",
      m("div", "List Page"),
      m("div",
        ["a", "b"].map(itemId => m("button",
          { key: itemId, onclick: () => navigator.navigateTo(FormPage, { itemId }) },
          "Form ", itemId
        ))
      ),
      m("div",
        m("a", href(navigator.getUrl(HomePage)), "Home Page")
      )
    )
  }
}
