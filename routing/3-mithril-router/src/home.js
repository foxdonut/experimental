import { href, ListPage } from "./constants"
import m from "mithril"

export const createHome = navigator => _update => {
  return {
    view: _vnode => m("div",
      m("div", "Home Page"),
      m("div",
        m("a", href(navigator.getUrl(ListPage)), "List Page")
      )
    )
  }
}
