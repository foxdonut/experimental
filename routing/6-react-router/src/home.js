import { ListPage } from "./constants"
import { Link } from "react-router-dom"
import { m } from "./utils"

export const createHome = navigator => _update => {
  return () =>
    m("div",
      m("div", "Home Page"),
      m("div",
        m(Link, { to: navigator.getUrl(ListPage) }, "List Page")
      )
    )
}
