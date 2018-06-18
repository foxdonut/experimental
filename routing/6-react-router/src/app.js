//import { createNavigator } from "./navigator"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { HomePage, ListPage, FormPage } from "./constants"
import { m } from "./utils"
import { createHome } from "./home"
import { createList } from "./list"
import { createForm } from "./form"
import { createNotFound } from "./404"

export const createApp = update => {
  /*
  const navigator = createNavigator(update)

  navigator.register([
    { key: HomePage, component: createHome(navigator)(update), route: "/" },
    { key: ListPage, component: createList(navigator)(update), route: "/list" },
    { key: FormPage, component: createForm(navigator)(update), route: "/form/:itemId" }
  ], createNotFound(navigator)(update))
  */

  return {
    // navigator,
    view: _model => {
      // const Component = navigator.getComponent(model.pageId)

      return m(Router,
        m("div",
          m("div", "Hello, world"),
          m(Route, { path: "/", exact: true, component: createHome(navigator)(update) }),
          m(Route, { path: "/list", component: createList(navigator)(update) })
        )
      )
    }
  }
}
