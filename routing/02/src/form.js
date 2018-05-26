import m from "mithril"
import { router } from "./router"

export const FormPage = "FormPage"

export const createForm = actions => update => {
  return {
    pageId: FormPage,
    navigateTo: item => update({ pageId: FormPage, item }),
    view: vnode => {
      const model = vnode.attrs.model

      return m("div",
        "Form Page for item ", model.item,
        m("div",
          m("button",
            { onclick: () => actions.saveItem(model.item) },
            "List"
          )
        )
      )
    }
  }
}