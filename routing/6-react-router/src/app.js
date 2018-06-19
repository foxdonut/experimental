import { createNavigator } from "./navigator"
import { HashRouter as Router, Route, Switch } from "react-router-dom"
import { HomePage, ListPage, FormPage } from "./constants"
import { m } from "./utils"
import { createHome } from "./home"
import { createList } from "./list"
import { createForm } from "./form"
import { createNotFound } from "./404"

export const createApp = update => {
  const navigator = createNavigator()

  const routes = navigator.register([
    { key: HomePage, component: createHome(navigator)(update), path: "/", exact: true },
    { key: ListPage, component: createList(navigator)(update), path: "/list" },
    { key: FormPage, component: createForm(navigator)(update), path: "/form/:itemId" }
  ], createNotFound(navigator)(update))

  return {
    // navigator,
    view: _model =>
      m(Router,
        m("div",
          m("div", "Hello, world"),
          m(Switch, routes.map(route => m(Route, route)))
        )
      )
  }
}
