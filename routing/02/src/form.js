import m from "mithril"
import { href, FormPage, HomePage, ListPage } from "./constants"

const items = {
  "a": "Article",
  "b": "Book"
}

const loadData = itemId => new Promise(resolve =>
  setTimeout(() => resolve(items[itemId]), 5)
)

export const createForm = navigator => update => {
  return {
    navigate: ({ itemId }) =>
      loadData(itemId).then(item => {
        update({ pageId: FormPage, params: { itemId }, item })
      }),

    view: vnode => {
      const model = vnode.attrs.model

      return m("div",
        "Form Page for item ", model.item,
        m("div",
          m("button",
            { onclick: () => m.route.set(navigator.getLink(ListPage)) },
            "List"
          )
        ),
        m("div",
          m("a", href(navigator.getLink(HomePage)), "Home Page")
        )
      )
    }
  }
}
