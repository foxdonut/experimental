import React from "react"
import { StateNavigator } from "navigation"
import { ListPage, createList } from "./list.jsx"
import { FormPage, createForm } from "./form.jsx"

export const createApp = update => {
  const stateNavigator = new StateNavigator([
    { key: ListPage, route: "" },
    { key: FormPage }
  ])

  const componentMap = {}

  Array.of(createList, createForm).forEach(create => {
    const Component = create(stateNavigator)(update)
    componentMap[Component.pageId] = Component
    stateNavigator.states[Component.pageId].renderView = (data, asyncData) => {
      console.log("navigate to", Component.pageId, "with data", data)
      update(model => Object.assign(model,
        { pageId: Component.pageId, params: Object.assign({}, data, asyncData) }
      )) }
  })

  stateNavigator.start()

  return {
    view: model => {
      const Component = componentMap[model.pageId]

      return (<div>
        Hello, world
        {Component.view(model)}
      </div>)
    }
  }
}
