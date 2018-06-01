import React from "react"
import { createNavigator } from "./navigator"
import { HomePage, ListPage, FormPage } from "./constants"
import { createHome } from "./home.jsx"
import { createList } from "./list.jsx"
import { createForm } from "./form.jsx"

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

      return (<div>
        Hello, world
        {Component && Component.view(model)}
      </div>)
    }
  }
}
