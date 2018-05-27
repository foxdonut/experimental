import m from "mithril"
import { FormPage } from "./form"

export const ListPage = "ListPage";

export const createList = router => update => {
  return {
    pageId: ListPage,
    view: vnode => m("div",
      "List Page",
      m("div",
        ["a", "b"].map(item => m("button",
          { onclick: () => router.navigateTo(FormPage, item) },
          "Form ", item
        ))
      )
    )
  }
}
