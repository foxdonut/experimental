import { m, HomePage } from "./constants"

export const createNotFound = navigator => _update => {
  return {
    view: _model => m("div",
      m("div", "Not Found Page"),
      m("div", "Sorry, we could not find what you were looking 4...04"),
      m("div",
        m("a", { href:  navigator.getLink(HomePage) }, "Home Page")
      )
    )
  }
}
