import { createNavigator } from "./navigator"
import { m, HomePage, ListPage, FormPage } from "./constants"
import { createHome } from "./home"
import { createList } from "./list"
import { createForm } from "./form"

export const createApp = update => {
  const navigator = createNavigator(update)

  navigator.register([
    { key: HomePage, component: createHome(navigator)(update), route: "/" },
    { key: ListPage, component: createList(navigator)(update), route: "/list" },
    { key: FormPage, component: createForm(navigator)(update), route: "/form/:itemId" }
  ])

  navigator.start()

  return {
    navigator,
    view: model => {
      const Component = navigator.getComponent(model.pageId)

      return m("div",
        m("div", "Hello, world"),
        Component && Component.view(model)
      )
    }
  }
}
