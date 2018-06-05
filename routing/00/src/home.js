import { blankHref, m, ListPage } from "./constants"

export const createHome = navigator => _update => {
  return {
    view: _model => m("div",
      m("div", "Home Page"),
      m("div",
        m("a", { href: blankHref, onClick: () =>  navigator.navigateTo(ListPage) }, "List Page")
      )
    )
  }
}
