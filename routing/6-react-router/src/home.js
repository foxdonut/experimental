import { ListPage } from "./constants"
import { Link } from "react-router-dom"
import { m } from "./utils"

export const createHome = navigator => _update => {
  return () =>
    m("div",
      m("div", "Home Page"),
      m("div",
        //m("a", { href: navigator.getUrl(ListPage) }, "List Page")
        m(Link, { to: "/list" }, "List Page")
      )
    )
}
