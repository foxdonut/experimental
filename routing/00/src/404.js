import { blankHref, HomePage } from "./constants"
import { m } from "./utils"

export const createNotFound = navigator => _update => {
  return {
    view: _model => m("div",
      m("div", "Not Found Page"),
      m("div", "Sorry, we could not find what you were looking 4...04"),
      m("div",
        m("a", {
          href: blankHref,
          onClick: () => navigator.navigateTo(HomePage)
        }, "Home Page")
      )
    )
  }
}
