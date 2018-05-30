import React from "react"
import { StateNavigator } from "navigation"
import { HomePage, ListPage, FormPage } from "./constants"
import { createHome } from "./home.jsx"
import { createList } from "./list.jsx"
import { createForm } from "./form.jsx"

export const createApp = update => {
  const stateNavigator = new StateNavigator([
    { key: HomePage, route: "" },
    { key: ListPage, route: "/list" },
    { key: FormPage, route: "/form/{itemId}" }
  ])

  Array.of(createHome, createList, createForm).forEach(create => {
    const component = create(stateNavigator)(update)
    const state = stateNavigator.states[component.pageId]
    state.component = component

    if (component.navigating) {
      state.navigating = component.navigating
    }
  })

  stateNavigator.onNavigate(() => {
    const { data, asyncData, url } = stateNavigator.stateContext
    update(model => Object.assign(model, data, asyncData, { url }))
  })

  stateNavigator.start()

  return {
    view: model => {
      const component = stateNavigator.stateContext.state.component

      return (<div>
        Hello, world
        {component.view(model)}
      </div>)
    }
  }
}
