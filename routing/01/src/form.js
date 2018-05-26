import m from "mithril";
import { Pages } from "./constants"

export const createForm = actions => update => {
  return {
    navigateTo: item => update({ pageId: Pages.FORM, item }),
    view: vnode => {
      const model = vnode.attrs.model

      return m("div",
        "Form Page for item ", model.item,
        m("div",
          m("button",
            { onclick: () => actions.navigateTo(Pages.LIST) },
            "List"
          )
        )
      )
    }
  }
}