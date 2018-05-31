import React from "react"
import Navigo from "navigo"
import { createHome } from "./home.jsx"
import { createList } from "./list.jsx"
import { createForm } from "./form.jsx"

export const createApp = update => {
  const router = new Navigo(null, true)
  router.navigateTo = (id, params) => router.navigate(router.generate(id, params))

  const componentMap = {}
  const routes = {}

  Array.of(createHome, createList, createForm).forEach(create => {
    const component = create(router)(update)
    componentMap[component.pageId] = component
    routes[component.route] = {
      as: component.pageId,
      uses: params => {
        if (component.navigate) {
          component.navigate(params)
        }
        else {
          update(model => Object.assign(model, { pageId: component.pageId, params }))
        }
      }
    }
  })
  router.on(routes).resolve()

  return {
    router,
    view: model => {
      const Component = componentMap[model.pageId]

      return (<div>
        Hello, world
        {Component.view(model)}
      </div>)
    }
  }
}
