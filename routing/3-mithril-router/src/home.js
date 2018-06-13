import m from "mithril"
import { href, ListPage } from "./constants"

export const createHome = navigator => _update => {
  return {
    view: _vnode => m("div",
      "Home Page",
      m("div",
        m("a", href(navigator.getUrl(ListPage)), "List Page")
      )
    )
  }
}
