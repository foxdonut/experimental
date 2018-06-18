import { Link } from "react-router-dom"
import { FormPage, HomePage } from "./constants"
import { m } from "./utils"

export const createList = navigator => _update => {
  return () =>
    m("div",
      m("div", "List Page"),
      m("div",
        ["a", "b"].map(itemId => m("button",
          { key: itemId, /* onClick: () =>navigator.navigateTo(FormPage, { itemId })*/ },
          "Form ", itemId
        ))
      ),
      m("div",
        m(Link, { to: "/" }, "Home Page")
      )
    )
}
