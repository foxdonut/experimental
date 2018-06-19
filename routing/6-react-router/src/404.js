import { Link } from "react-router-dom"
import { HomePage } from "./constants"
import { m } from "./utils"

export const createNotFound = navigator => _update => {
  return () =>
    m("div",
      m("div", "Not Found Page"),
      m("div", "Sorry, we could not find what you were looking 4...04"),
      m("div",
        m(Link, { to: navigator.getUrl(HomePage) }, "Home Page")
      )
    )
}
