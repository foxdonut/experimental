import { m, prefix, ListPage } from "./constants"

export const createHome = navigator => _update => {
  return {
    view: _model => m("div",
      m("div", "Home Page"),
      m("div",
        m("a", { href: prefix + navigator.getLink(ListPage) }, "List Page")
      )
    )
  }
}
