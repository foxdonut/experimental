import { ListPage } from "./constants"
import { m, preventDefault } from "./utils"

export const createHome = navigator => _update => {
  return {
    view: _model => m("div",
      m("div", "Home Page"),
      m("div",
        m("a", {
          href: navigator.getUrl(ListPage),
          onClick: preventDefault(() => navigator.navigateTo(ListPage))
        }, "List Page")
      )
    )
  }
}