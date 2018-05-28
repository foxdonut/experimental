import m from "mithril"
import { createNavigator } from "./navigator"
import { createList } from "./list"
import { createForm } from "./form"

export const createApp = update => {
  const navigator = createNavigator(update)

  Array.of(createList, createForm).forEach(
    create => navigator.register(create(navigator)(update)))

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
