import m from "mithril"
import { ListPage } from "./constants"

export const createForm = navigator => update => {
  return {
    pageId: FormPage,
    navigate: item => update({ pageId: FormPage, item }),
    view: vnode => {
      const model = vnode.attrs.model

      return m("div",
        "Form Page for item ", model.item,
        m("div",
          m("button",
            { onclick: () => navigator.navigate(ListPage) },
            "List"
          )
        )
      )
    }
  }
}
