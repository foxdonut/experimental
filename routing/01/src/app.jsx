import React from "react"
import { createNavigator } from "./navigator"
import { createList } from "./list.jsx"
import { createForm } from "./form.jsx"

export const createApp = update => {
  const navigator = createNavigator(update)

  Array.of(createList, createForm).forEach(
    create => navigator.register(create(navigator)(update)))

  return {
    navigator,
    view: model => {
      const Component = navigator.getComponent(model.pageId)

      return (<div>
        Hello, world
        {Component.view(model)}
      </div>)
    }
  }
}
