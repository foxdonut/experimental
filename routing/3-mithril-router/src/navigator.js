import { compile } from "path-to-regexp"
import { prefix } from "./constants"
import m from "mithril"
import { P } from "patchinko"

export const createNavigator = update => {
  const componentMap = {}
  const routes = {}
  const toPath = {}
  let notFoundComponent = undefined

  const getUrl = (id, params) => toPath[id](params)

  return {
    register: (configs, notFound) => {
      configs.forEach(config => {
        componentMap[config.key] = config.component
        routes[config.route] = config.key
        toPath[config.key] = compile(config.route)
      })
      notFoundComponent = notFound
    },
    onnavigate: (pageId, params, url) => {
      const Component = componentMap[pageId]
      const updateObj = { pageId, url: prefix + url }

      if (Component && Component.navigating) {
        return new Promise(resolve => {
          Component.navigating(params, obj => {
            update(P(updateObj, obj))
            resolve()
          })
        })
      }
      else {
        update(updateObj)
      }
    },
    navigateTo: (pageId, params) => {
      m.route.set(getUrl(pageId, params))
    },
    getComponent: pageId => componentMap[pageId] || notFoundComponent,
    getUrl,
    routes
  }
}
