import { compile } from "path-to-regexp"

export const createNavigator = update => {
  const componentMap = {}
  const routes = {}
  const toPath = {}

  return {
    register: configs => {
      configs.forEach(config => {
        componentMap[config.id] = config.component
        routes[config.route] = config.id
        toPath[config.id] = compile(config.route)
      })
    },
    navigate: (pageId, params) => {
      const Component = componentMap[pageId]

      if (Component && Component.navigate) {
        return Component.navigate(params)
      }
      else {
        update({ pageId, params })
      }
    },
    getComponent: pageId => componentMap[pageId],
    getPath: (id, params) => toPath[id](params),
    routes
  }
}
