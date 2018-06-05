import { m, ListPage } from "./constants"

export const createHome = navigator => _update => {
  return {
    view: _model => m("div",
      m("div", "Home Page"),
      m("div",
        m("a", {
          href: navigator.getUrl(ListPage),
          onClick: evt => { evt.preventDefault(); navigator.navigateTo(ListPage) }
        }, "List Page")
      )
    )
  }
}
