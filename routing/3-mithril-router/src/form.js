import { href, HomePage, ListPage } from "./constants"
import m from "mithril"

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
      loadData(itemId).then(item => navigate({ item }))
    },
    view: vnode => {
      const model = vnode.attrs.model

      return m("div",
        m("div", "Form Page for item " + model.item),
        m("div",
          m("button",
            { onclick: () => navigator.navigateTo(ListPage) },
            "List"
          )
        ),
        m("div",
          m("a", href(navigator.getUrl(HomePage)), "Home Page")
        )
      )
    }
  }
}
