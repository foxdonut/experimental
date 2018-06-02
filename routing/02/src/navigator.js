import { compile } from "path-to-regexp"

export const createNavigator = update => {
  const componentMap = {}
  const routes = {}
  const toPath = {}

  return {
    register: configs => {
      configs.forEach(config => {
        componentMap[config.key] = config.component
        routes[config.route] = config.key
        toPath[config.key] = compile(config.route)
      })
    },
    navigateTo: (pageId, params) => {
      const Component = componentMap[pageId]

      if (Component && Component.navigating) {
        return Component.navigating(params)
      }
      else {
        update({ pageId, params })
      }
    },
    getComponent: pageId => componentMap[pageId],
    getLink: (id, params) => toPath[id](params),
    routes
  }
}
