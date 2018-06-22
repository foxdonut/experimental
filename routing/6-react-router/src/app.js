import { Component } from "react"
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
    { key: HomePage, page: createHome(navigator)(update), path: "/", exact: true },
    { key: ListPage, page: createList(navigator)(update), path: "/list" },
    { key: FormPage, page: createForm(navigator)(update), path: "/form/:itemId" }
  ], createNotFound(navigator)(update))

  return class extends Component {
    render() {
      const model = this.props.model

      return m(Router,
        m("div",
          m("div", "Hello, world"),
          m(Switch, routes.map(route => {
            route.render = props => {
              props.model = model
              return m(route.page, props)
            }
            return m(Route, route)
          }))
        )
      )
    }
  }
}
