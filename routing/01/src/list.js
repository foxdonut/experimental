import m from "mithril";
import { Pages } from "./constants"

export const createList = actions => update => {
  return {
    navigateTo: () => update({ pageId: Pages.LIST }),
    view: vnode => m("div",
      "List Page",
      m("div",
        ["a", "b"].map(item => m("button",
          { onclick: () => actions.navigateTo(Pages.FORM, item) },
          "Form ", item
        ))
      )
    )
  }
}
