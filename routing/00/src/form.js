import { blankHref, HomePage, ListPage } from "./constants"
import { m } from "./utils"

const items = {
  "a": "Article",
  "b": "Book"
}

const loadData = itemId => new Promise(resolve =>
  setTimeout(() => resolve(items[itemId]), 5)
)

export const createForm = navigator => _update => {
  return {
    navigating: ({ itemId }, navigate) => {
      loadData(itemId).then(item =>
        navigate(model => Object.assign(model, { item })))
    },
    view: model => {
      return m("div",
        m("div", "Form Page for item " + model.item),
        m("div",
          m("button",
            { onClick: () => navigator.navigateTo(ListPage) },
            "List"
          )
        ),
        m("div",
          m("a", {
            href: blankHref,
            onClick: () => navigator.navigateTo(HomePage)
          }, "Home Page")
        )
      )
    }
  }
}
