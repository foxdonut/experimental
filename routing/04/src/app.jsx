import React from "react"
import { createRouter } from "./router"
import { createList } from "./list.jsx"
import { createForm } from "./form.jsx"

export const createApp = update => {
  const router = createRouter(update)

  Array.of(createList, createForm).forEach(
    create => router.register(create(router)(update)))

  return {
    router,
    view: model => {
      const Component = router.getComponent(model.pageId)

      return (<div>
        Hello, world
        {Component.view(model)}
      </div>)
    }
  }
}
