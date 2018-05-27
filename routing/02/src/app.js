import m from "mithril"
import { createRouter } from "./router"
import { ListPage, createList } from "./list"
import { FormPage, createForm } from "./form"

export const createApp = update => {
  const router = createRouter(update)

  Array.of(createList, createForm).forEach(
    create => router.register(create(router)(update)))

  return {
    view: vnode => {
      const model = vnode.attrs.model
      const Component = router.getComponent(model.pageId)

      return m("div",
        "Hello, world",
        m(Component, { model })
      )
    }
  }
}
