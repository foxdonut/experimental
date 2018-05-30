import m from "mithril"
import { createNavigator } from "./navigator"
import { HomePage, FormPage, ListPage } from "./constants"
import { createForm } from "./form"
import { createHome } from "./home"
import { createList } from "./list"

export const createApp = update => {
  const navigator = createNavigator(update)

  navigator.register([
    { id: HomePage, component: createHome(navigator)(update), route: "/" },
    { id: FormPage, component: createForm(navigator)(update), route: "/form/:itemId" },
    { id: ListPage, component: createList(navigator)(update), route: "/list" }
  ])

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
