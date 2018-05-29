import m from "mithril"
import { createNavigator } from "./navigator"
import { FormPage, ListPage } from "./constants"
import { createForm } from "./form"
import { createList } from "./list"

export const createApp = update => {
  const navigator = createNavigator(update)

  navigator.register({
    [FormPage]: createForm(navigator)(update),
    [ListPage]: createList(navigator)(update)
  })

  return {
    navigator,
    view: vnode => {
      const model = vnode.attrs.model
      const Component = navigator.getComponent(model.pageId)

      return m("div",
        "Hello, world",
        m(Component, { model })
      )
    }
  }
}
