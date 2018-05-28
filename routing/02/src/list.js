import m from "mithril"
import { FormPage } from "./form"

export const ListPage = "ListPage"

export const createList = router => _update => {
  return {
    pageId: ListPage,
    view: _vnode => m("div",
      "List Page",
      m("div",
        ["a", "b"].map(item => m("button",
          { onclick: () => router.navigate(FormPage, { item }) },
          "Form ", item
        ))
      )
    )
  }
}
