import { createNavigator } from "./navigator"
import { HomePage, ListPage, FormPage, NotFoundPage } from "./constants"
import { m } from "./utils"
import { createHome } from "./home"
import { createList } from "./list"
import { createForm } from "./form"
import { createNotFound } from "./404"

export const createApp = update => {
  const navigator = createNavigator(update)

  navigator.register([
    { key: HomePage, component: createHome(navigator)(update) },
    { key: ListPage, component: createList(navigator)(update) },
    { key: FormPage, component: createForm(navigator)(update) },
    { key: NotFoundPage, component: createNotFound(navigator)(update) }
  ])

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
